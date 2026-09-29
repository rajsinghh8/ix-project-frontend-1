import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, PieChart as PieChartIcon, Wallet } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import EventTabs from '../components/EventTabs';
import ProgressBar from '../components/ProgressBar';
import { SkeletonGrid } from '../components/Skeletons';
import { getBudgetCategories, getEvent, getVendors } from '../data/store';
import type { BudgetCategoryItem, EventItem, VendorItem } from '../types';
import { formatCurrency } from '../utils/format';
import { BUDGET_WARNING_THRESHOLD } from '../constants';

const CHART_COLORS = ['#6C5CE7', '#00D9C0', '#3E9BFF', '#FFB020', '#FF5A6E', '#22C58B'];

export function EventBudget() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [categories, setCategories] = useState<BudgetCategoryItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);

  useEffect(() => {
    if (!eventId) return;
    const currentEventId: string = eventId;
    let isMounted = true;

    async function load() {
      const [eventData, categoryData, vendorData] = await Promise.all([
        getEvent(currentEventId),
        getBudgetCategories(currentEventId),
        getVendors(currentEventId),
      ]);
      if (!isMounted) return;
      setEvent(eventData);
      setCategories(categoryData);
      setVendors(vendorData);
      setIsLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const chartData = useMemo(
    () => categories.map((category) => ({ name: category.category, value: category.spent })),
    [categories]
  );

  const totalPlanned = event?.budgetPlanned ?? 0;
  const totalSpent = event?.budgetSpent ?? 0;
  const remaining = Math.max(0, totalPlanned - totalSpent);
  const overallRatio = totalPlanned > 0 ? totalSpent / totalPlanned : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EventTabs />
        <SkeletonGrid count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <EventTabs />

      {overallRatio >= BUDGET_WARNING_THRESHOLD && (
        <div className="flex items-start gap-3 rounded-2xl bg-danger-light dark:bg-danger/10 border border-danger/30 px-5 py-4 text-danger">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Budget warning</p>
            <p className="text-sm">
              This event has spent {Math.round(overallRatio * 100)}% of its planned budget. Review remaining
              categories before approving new spend.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <p className="text-sm text-muted mb-1">Planned budget</p>
          <p className="text-2xl font-display font-semibold">{formatCurrency(totalPlanned)}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted mb-1">Actual spending</p>
          <p className="text-2xl font-display font-semibold text-primary-600">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted mb-1">Remaining budget</p>
          <p className="text-2xl font-display font-semibold text-success">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold">Spending by category</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold">Category breakdown</h2>
          </div>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id}>
                <ProgressBar
                  value={category.spent}
                  max={category.planned}
                  warningThreshold={BUDGET_WARNING_THRESHOLD}
                  label={`${category.category} — ${formatCurrency(category.spent)} of ${formatCurrency(category.planned)}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="font-semibold mb-4">Vendor costs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="text-left text-muted border-b border-surface-border dark:border-surface-borderDark">
              <tr>
                <th className="py-2.5 font-medium">Vendor</th>
                <th className="py-2.5 font-medium">Cost</th>
                <th className="py-2.5 font-medium">Paid</th>
                <th className="py-2.5 font-medium">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-borderDark">
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="py-2.5">{vendor.name}</td>
                  <td className="py-2.5">{formatCurrency(vendor.cost)}</td>
                  <td className="py-2.5 text-success">{formatCurrency(vendor.amountPaid)}</td>
                  <td className="py-2.5 text-danger">{formatCurrency(vendor.cost - vendor.amountPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

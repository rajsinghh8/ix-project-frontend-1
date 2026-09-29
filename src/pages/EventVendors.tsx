import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Plus, Trash2 } from 'lucide-react';
import EventTabs from '../components/EventTabs';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeletons';
import { createVendor, deleteVendor, getVendors } from '../data/store';
import type { VendorBookingStatus, VendorItem } from '../types';
import { validateEmail, validateRequired } from '../validation';
import { formatCurrency } from '../utils/format';
import ProgressBar from '../components/ProgressBar';

const STATUS_TONE: Record<VendorBookingStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  inquiry: 'info',
  booked: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
};

interface VendorFormState {
  name: string;
  service: string;
  cost: string;
  amountPaid: string;
  bookingStatus: VendorBookingStatus;
  contact: string;
}

const EMPTY_FORM: VendorFormState = {
  name: '',
  service: '',
  cost: '',
  amountPaid: '0',
  bookingStatus: 'inquiry',
  contact: '',
};

export function EventVendors() {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<VendorFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState({ name: '', service: '', cost: '', contact: '' });
  const [vendorPendingDelete, setVendorPendingDelete] = useState<VendorItem | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
    getVendors(eventId).then((data) => {
      if (isMounted) {
        setVendors(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const isValid =
    validateRequired(form.name, 'Name') === '' &&
    validateRequired(form.service, 'Service') === '' &&
    form.cost.trim() !== '' &&
    Number(form.cost) >= 0 &&
    validateEmail(form.contact) === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = {
      name: validateRequired(form.name, 'Name'),
      service: validateRequired(form.service, 'Service'),
      cost: form.cost.trim() === '' || Number(form.cost) < 0 ? 'Enter a valid cost' : '',
      contact: validateEmail(form.contact),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !isValid || !eventId) {
      return;
    }

    const created = await createVendor({
      eventId,
      name: form.name,
      service: form.service,
      cost: Number(form.cost),
      amountPaid: Number(form.amountPaid) || 0,
      bookingStatus: form.bookingStatus,
      contact: form.contact,
    });

    setVendors((previous) => [created, ...previous]);
    setForm(EMPTY_FORM);
    setIsModalOpen(false);
  }

  async function handleConfirmDelete() {
    if (!vendorPendingDelete) return;
    await deleteVendor(vendorPendingDelete.id);
    setVendors((previous) => previous.filter((vendor) => vendor.id !== vendorPendingDelete.id));
    setVendorPendingDelete(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EventTabs />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <EventTabs />

      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl">Vendors</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" /> Add vendor
        </button>
      </div>

      {vendors.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-6 h-6" />}
          title="No vendors yet"
          description="Add vendors to track bookings, costs, and payments for this event."
          action={
            <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
              Add a vendor
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="card-surface p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-muted">{vendor.service}</p>
                </div>
                <Badge tone={STATUS_TONE[vendor.bookingStatus]}>{vendor.bookingStatus}</Badge>
              </div>

              <ProgressBar
                value={vendor.amountPaid}
                max={vendor.cost}
                showPercentLabel={false}
                label={`${formatCurrency(vendor.amountPaid)} of ${formatCurrency(vendor.cost)} paid`}
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted">
                  Remaining <span className="font-semibold text-danger">{formatCurrency(vendor.cost - vendor.amountPaid)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setVendorPendingDelete(vendor)}
                  aria-label={`Remove ${vendor.name}`}
                  className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger-light dark:hover:bg-danger/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} title="Add vendor" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-name">
              Vendor name
            </label>
            <input
              id="vendor-name"
              type="text"
              value={form.name}
              onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.name && <p className="text-xs mt-1 text-danger">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-service">
              Service
            </label>
            <input
              id="vendor-service"
              type="text"
              value={form.service}
              onChange={(event) => setForm((previous) => ({ ...previous, service: event.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            {errors.service && <p className="text-xs mt-1 text-danger">{errors.service}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-cost">
                Total cost ($)
              </label>
              <input
                id="vendor-cost"
                type="number"
                min={0}
                value={form.cost}
                onChange={(event) => setForm((previous) => ({ ...previous, cost: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.cost && <p className="text-xs mt-1 text-danger">{errors.cost}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-paid">
                Amount paid ($)
              </label>
              <input
                id="vendor-paid"
                type="number"
                min={0}
                value={form.amountPaid}
                onChange={(event) => setForm((previous) => ({ ...previous, amountPaid: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-status">
                Booking status
              </label>
              <select
                id="vendor-status"
                value={form.bookingStatus}
                onChange={(event) => setForm((previous) => ({ ...previous, bookingStatus: event.target.value as VendorBookingStatus }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="inquiry">Inquiry</option>
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="vendor-contact">
                Contact email
              </label>
              <input
                id="vendor-contact"
                type="email"
                value={form.contact}
                onChange={(event) => setForm((previous) => ({ ...previous, contact: event.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border dark:border-surface-borderDark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors.contact && <p className="text-xs mt-1 text-danger">{errors.contact}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-primary shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add vendor
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={vendorPendingDelete !== null}
        title="Remove vendor?"
        description={`This will remove ${vendorPendingDelete?.name ?? 'this vendor'} from the event. This cannot be undone.`}
        confirmLabel="Remove vendor"
        onConfirm={handleConfirmDelete}
        onCancel={() => setVendorPendingDelete(null)}
      />
    </div>
  );
}

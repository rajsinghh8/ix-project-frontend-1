import type { ReactNode } from 'react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ReactNode;
  accentClassName?: string;
  trend?: string;
}

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  icon,
  accentClassName = 'bg-primary-500/10 text-primary-600',
  trend,
}: StatCardProps) {
  const animatedValue = useAnimatedCounter(value);

  return (
    <div className="card-surface p-5 animate-slide-up hover:-translate-y-0.5 hover:shadow-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClassName}`}>{icon}</span>
        {trend && <span className="text-xs font-medium text-success bg-success-light dark:bg-success/10 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <p className="text-2xl font-display font-semibold tracking-tight">
        {prefix}
        {animatedValue.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

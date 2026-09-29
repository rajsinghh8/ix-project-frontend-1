import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const TONE_CLASSES: Record<Required<BadgeProps>['tone'], string> = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  success: 'bg-success-light text-success dark:bg-success/15',
  warning: 'bg-warning-light text-warning dark:bg-warning/15',
  danger: 'bg-danger-light text-danger dark:bg-danger/15',
  info: 'bg-info-light text-info dark:bg-info/15',
  neutral: 'bg-surface-card text-muted dark:bg-white/5',
};

export default function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

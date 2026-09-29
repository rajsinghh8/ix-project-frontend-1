import { clampPercent } from '../utils/format';

interface ProgressBarProps {
  value: number;
  max: number;
  warningThreshold?: number;
  label?: string;
  showPercentLabel?: boolean;
}

export default function ProgressBar({
  value,
  max,
  warningThreshold = 0.85,
  label,
  showPercentLabel = true,
}: ProgressBarProps) {
  const ratio = max > 0 ? value / max : 0;
  const percent = clampPercent(ratio * 100);
  const isDanger = ratio >= 1;
  const isWarning = !isDanger && ratio >= warningThreshold;

  const barColorClassName = isDanger ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-gradient-primary';

  return (
    <div>
      {(label || showPercentLabel) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showPercentLabel && (
            <span
              className={`font-semibold ${isDanger ? 'text-danger' : isWarning ? 'text-warning' : 'text-primary-600'}`}
            >
              {percent}%
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-surface-border dark:bg-surface-borderDark overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColorClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

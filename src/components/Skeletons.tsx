export function SkeletonCard() {
  return (
    <div className="card-surface p-5 animate-pulse-slow">
      <div className="w-10 h-10 rounded-xl bg-surface-border dark:bg-surface-borderDark mb-4" />
      <div className="h-6 w-24 bg-surface-border dark:bg-surface-borderDark rounded mb-2" />
      <div className="h-4 w-32 bg-surface-border dark:bg-surface-borderDark rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse-slow">
      <div className="w-9 h-9 rounded-full bg-surface-border dark:bg-surface-borderDark" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 bg-surface-border dark:bg-surface-borderDark rounded" />
        <div className="h-3 w-1/4 bg-surface-border dark:bg-surface-borderDark rounded" />
      </div>
      <div className="h-6 w-16 bg-surface-border dark:bg-surface-borderDark rounded-full" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

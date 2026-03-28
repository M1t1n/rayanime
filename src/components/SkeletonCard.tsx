export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-bg-card border border-white/5 animate-pulse">
      <div className="aspect-[3/4] w-full bg-bg-tertiary" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-4/5 rounded bg-bg-tertiary" />
        <div className="h-3 w-2/5 rounded bg-bg-tertiary/60" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div className="flex gap-4 rounded-xl border border-white/5 bg-bg-card p-4 animate-pulse">
      <div className="h-20 w-14 shrink-0 rounded-lg bg-bg-tertiary" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 w-3/4 rounded bg-bg-tertiary" />
        <div className="h-3 w-1/2 rounded bg-bg-tertiary/60" />
        <div className="h-3 w-1/4 rounded bg-bg-tertiary/40" />
      </div>
    </div>
  );
}

export function SkeletonFeed({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3 max-w-2xl">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonFeedItem key={i} />
      ))}
    </div>
  );
}

export function SkeletonReview() {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-bg-tertiary" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-1/4 rounded bg-bg-tertiary" />
          <div className="h-3 w-1/5 rounded bg-bg-tertiary/60" />
        </div>
        <div className="h-6 w-10 rounded bg-bg-tertiary/60" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded bg-bg-tertiary/60" />
        <div className="h-3 w-5/6 rounded bg-bg-tertiary/40" />
      </div>
    </div>
  );
}

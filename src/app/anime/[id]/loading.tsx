import { SkeletonReview } from "@/components/SkeletonCard";

export default function AnimeLoading() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="h-80 w-56 shrink-0 rounded-xl bg-bg-tertiary animate-pulse md:h-96 md:w-64" />
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-8 w-2/3 rounded-lg bg-bg-tertiary animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-bg-tertiary/60 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 rounded-full bg-bg-tertiary animate-pulse" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-bg-tertiary/60 animate-pulse" />
            <div className="h-3.5 w-11/12 rounded bg-bg-tertiary/60 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-bg-tertiary/60 animate-pulse" />
          </div>
          <div className="flex gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 rounded-lg bg-bg-tertiary animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3 max-w-2xl">
        <div className="h-5 w-24 rounded bg-bg-tertiary animate-pulse" />
        {[1, 2, 3].map((i) => <SkeletonReview key={i} />)}
      </div>
    </div>
  );
}

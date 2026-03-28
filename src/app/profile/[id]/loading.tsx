import { SkeletonGrid, SkeletonReview } from "@/components/SkeletonCard";

export default function ProfileLoading() {
  return (
    <div className="space-y-10">
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 shrink-0 rounded-full bg-bg-tertiary animate-pulse" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-7 w-40 rounded-lg bg-bg-tertiary animate-pulse" />
          <div className="h-4 w-56 rounded bg-bg-tertiary/60 animate-pulse" />
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 rounded bg-bg-tertiary/40 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <section className="space-y-4">
        <div className="h-5 w-28 rounded bg-bg-tertiary animate-pulse" />
        <SkeletonGrid count={5} />
      </section>
      <section className="space-y-3">
        <div className="h-5 w-36 rounded bg-bg-tertiary animate-pulse" />
        {[1, 2, 3].map((i) => <SkeletonReview key={i} />)}
      </section>
    </div>
  );
}

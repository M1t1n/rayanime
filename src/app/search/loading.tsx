import { SkeletonGrid } from "@/components/SkeletonCard";

export default function SearchLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-bg-tertiary animate-pulse" />
        <div className="h-4 w-24 rounded bg-bg-tertiary/60 animate-pulse" />
      </div>
      <div className="h-10 w-full max-w-md rounded-lg bg-bg-tertiary animate-pulse" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-6 w-16 rounded-full bg-bg-tertiary animate-pulse" />
        ))}
      </div>
      <SkeletonGrid count={15} />
    </div>
  );
}

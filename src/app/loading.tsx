import { SkeletonGrid, SkeletonFeed } from "@/components/SkeletonCard";

export default function HomeLoading() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <div className="mx-auto h-10 w-72 rounded-lg bg-bg-tertiary animate-pulse" />
        <div className="mx-auto h-4 w-48 rounded bg-bg-tertiary/60 animate-pulse" />
      </div>
      <section>
        <div className="mb-4 h-5 w-32 rounded bg-bg-tertiary animate-pulse" />
        <SkeletonGrid count={10} />
      </section>
      <section>
        <div className="mb-4 h-5 w-36 rounded bg-bg-tertiary animate-pulse" />
        <SkeletonFeed count={5} />
      </section>
    </div>
  );
}

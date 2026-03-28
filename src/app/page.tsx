import { prisma } from "@/lib/prisma";
import AnimeCard from "@/components/AnimeCard";
import FeedItem from "@/components/FeedItem";

export const dynamic = "force-dynamic";

async function getTrendingAnime() {
  return prisma.anime.findMany({
    orderBy: { score: "desc" },
    take: 10,
  });
}

async function getFeed() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { id: true, name: true } },
      anime: { select: { id: true, title: true, coverImage: true } },
    },
  });

  return reviews.map((r) => ({
    type: "review" as const,
    user: r.user,
    anime: r.anime,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
}

export default async function Home() {
  const [trending, feed] = await Promise.all([getTrendingAnime(), getFeed()]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Track your <span className="text-accent-primary">anime</span> journey
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
          Rate, review, and discover anime with a community of fans.
        </p>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Trending Anime</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trending.map((a) => (
              <AnimeCard
                key={a.id}
                id={a.id}
                title={a.title}
                coverImage={a.coverImage}
                score={a.score}
                genres={a.genres}
                year={a.year}
              />
            ))}
          </div>
        </section>
      )}

      {/* Feed */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Activity</h2>
        {feed.length > 0 ? (
          <div className="space-y-3 max-w-2xl">
            {feed.map((item, i) => (
              <FeedItem key={i} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            No activity yet. Be the first to rate an anime!
          </p>
        )}
      </section>
    </div>
  );
}

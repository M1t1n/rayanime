import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const [watched, reviews, favorites] = await Promise.all([
    prisma.watchedAnime.findMany({
      where: { userId: params.id },
      include: { anime: { select: { episodes: true, genres: true, score: true } } },
    }),
    prisma.review.findMany({
      where: { userId: params.id },
      select: { rating: true },
    }),
    prisma.favorite.count({ where: { userId: params.id } }),
  ]);

  const completed = watched.filter((w) => w.status === "COMPLETED");
  const watching  = watched.filter((w) => w.status === "WATCHING");
  const planToWatch = watched.filter((w) => w.status === "PLAN_TO_WATCH");
  const dropped   = watched.filter((w) => w.status === "DROPPED");

  // Total episodes watched (completed * their episode count, else episodeProgress)
  const totalEpisodes = watched.reduce((sum, w) => {
    if (w.status === "COMPLETED") return sum + (w.anime.episodes ?? 0);
    return sum + (w.episodeProgress ?? 0);
  }, 0);

  // Avg rating
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  // Genre breakdown
  const genreCounts: Record<string, number> = {};
  for (const w of completed) {
    for (const g of w.anime.genres) {
      genreCounts[g] = (genreCounts[g] ?? 0) + 1;
    }
  }
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return NextResponse.json({
    totalWatched: watched.length,
    completed: completed.length,
    watching: watching.length,
    planToWatch: planToWatch.length,
    dropped: dropped.length,
    totalEpisodes,
    totalReviews: reviews.length,
    totalFavorites: favorites,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    topGenres,
  });
}

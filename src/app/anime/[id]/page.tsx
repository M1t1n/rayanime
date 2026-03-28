import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import AnimeActions from "./AnimeActions";
import ReviewCard from "@/components/ReviewCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AnimePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const anime = await prisma.anime.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
          likes: userId ? { where: { userId } } : false,
        },
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  });

  if (!anime) notFound();

  const avgRating =
    anime.reviews.length > 0
      ? anime.reviews.reduce((s, r) => s + r.rating, 0) / anime.reviews.length
      : null;

  // Check user state
  let userReview = null;
  let userWatched = null;
  let userFavorited = false;
  if (userId) {
    userReview = await prisma.review.findUnique({
      where: { userId_animeId: { userId, animeId: anime.id } },
    });
    userWatched = await prisma.watchedAnime.findUnique({
      where: { userId_animeId: { userId, animeId: anime.id } },
    });
    const fav = await prisma.favorite.findUnique({
      where: { userId_animeId: { userId, animeId: anime.id } },
    });
    userFavorited = !!fav;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          <div className="relative h-80 w-56 overflow-hidden rounded-xl shadow-2xl md:h-96 md:w-64">
            {anime.coverImage ? (
              <Image src={anime.coverImage} alt={anime.title} fill className="object-cover" sizes="256px" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-bg-tertiary text-text-muted">No Image</div>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{anime.title}</h1>
            {anime.titleJapanese && (
              <p className="mt-1 text-sm text-text-muted">{anime.titleJapanese}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {anime.genres.map((g) => (
              <span key={g} className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            {avgRating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-lg font-bold text-text-primary">{avgRating.toFixed(1)}</span>
                <span className="text-text-muted">/ 10</span>
              </div>
            )}
            {anime.episodes && <span>{anime.episodes} episodes</span>}
            {anime.year && <span>{anime.year}</span>}
            {anime.status && <span>{anime.status}</span>}
          </div>

          {anime.synopsis && (
            <p className="text-sm leading-relaxed text-text-secondary">{anime.synopsis}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{anime._count.reviews} reviews</span>
            <span>·</span>
            <span>{anime._count.favorites} favorites</span>
          </div>

          <AnimeActions
            animeId={anime.id}
            userReview={userReview ? { rating: userReview.rating, content: userReview.content } : null}
            userWatchStatus={userWatched?.status ?? null}
            userFavorited={userFavorited}
            isLoggedIn={!!userId}
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Reviews</h2>
        {anime.reviews.length > 0 ? (
          <div className="max-w-2xl space-y-3">
            {anime.reviews.map((r) => (
              <ReviewCard
                key={r.id}
                id={r.id}
                rating={r.rating}
                content={r.content}
                createdAt={r.createdAt.toISOString()}
                user={r.user}
                likeCount={r._count.likes}
                isLiked={r.likes?.length > 0}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No reviews yet. Be the first!</p>
        )}
      </section>
    </div>
  );
}

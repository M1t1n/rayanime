import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AnimeCard from "@/components/AnimeCard";
import ReviewCard from "@/components/ReviewCard";
import FollowButton from "./FollowButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          anime: { select: { id: true, title: true, coverImage: true } },
          user: { select: { id: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
        },
      },
      favorites: {
        take: 10,
        include: { anime: true },
      },
      watched: {
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { anime: true },
      },
      _count: { select: { reviews: true, followers: true, following: true, watched: true, favorites: true } },
    },
  });

  if (!user) notFound();

  let isFollowing = false;
  if (currentUserId && currentUserId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
    });
    isFollowing = !!follow;
  }

  const isOwn = currentUserId === user.id;

  return (
    <div className="animate-fade-in space-y-10">
      {/* Profile header */}
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 shrink-0 rounded-full bg-accent-primary/20 flex items-center justify-center text-2xl font-bold text-accent-primary">
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
            {!isOwn && currentUserId && (
              <FollowButton userId={user.id} initialFollowing={isFollowing} />
            )}
          </div>
          {user.bio && <p className="mt-1 text-sm text-text-secondary">{user.bio}</p>}
          <div className="mt-3 flex gap-6 text-sm text-text-muted">
            <span><strong className="text-text-primary">{user._count.watched}</strong> watched</span>
            <span><strong className="text-text-primary">{user._count.reviews}</strong> reviews</span>
            <span><strong className="text-text-primary">{user._count.followers}</strong> followers</span>
            <span><strong className="text-text-primary">{user._count.following}</strong> following</span>
          </div>
        </div>
      </div>

      {/* Favorites */}
      {user.favorites.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Favorites ({user._count.favorites})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {user.favorites.map((f) => (
              <AnimeCard
                key={f.anime.id}
                id={f.anime.id}
                title={f.anime.title}
                coverImage={f.anime.coverImage}
                score={f.anime.score}
                genres={f.anime.genres}
                year={f.anime.year}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent reviews */}
      {user.reviews.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Reviews</h2>
          <div className="max-w-2xl space-y-3">
            {user.reviews.map((r) => (
              <ReviewCard
                key={r.id}
                id={r.id}
                rating={r.rating}
                content={r.content}
                createdAt={r.createdAt.toISOString()}
                user={r.user}
                anime={r.anime}
                likeCount={r._count.likes}
                isLiked={r.likes?.length > 0}
                showAnime
              />
            ))}
          </div>
        </section>
      )}

      {/* Watched */}
      {user.watched.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Watched ({user._count.watched})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {user.watched.map((w) => (
              <AnimeCard
                key={w.anime.id}
                id={w.anime.id}
                title={w.anime.title}
                coverImage={w.anime.coverImage}
                score={w.anime.score}
                genres={w.anime.genres}
                year={w.anime.year}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

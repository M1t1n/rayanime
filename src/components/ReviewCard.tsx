"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Props {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
  anime?: { id: string; title: string; coverImage: string | null };
  likeCount: number;
  isLiked: boolean;
  showAnime?: boolean;
}

export default function ReviewCard({
  id, rating, content, createdAt, user, anime,
  likeCount: initialLikes, isLiked: initialIsLiked, showAnime = false,
}: Props) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  async function toggleLike() {
    if (!session) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsLiked(data.liked);
      setLikes((prev) => prev + (data.liked ? 1 : -1));
    }
  }

  return (
    <div className="animate-fade-in rounded-xl border border-white/5 bg-bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${user.id}`}>
            <div className="h-9 w-9 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-bold text-accent-primary">
              {user.name[0]?.toUpperCase()}
            </div>
          </Link>
          <div>
            <Link href={`/profile/${user.id}`} className="text-sm font-medium text-text-primary hover:text-accent-secondary transition">
              {user.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              {showAnime && anime && (
                <>
                  <span>·</span>
                  <Link href={`/anime/${anime.id}`} className="text-text-secondary hover:text-accent-secondary transition">
                    {anime.title}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-yellow-400/10 px-2 py-0.5">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-semibold text-yellow-400">{rating}</span>
        </div>
      </div>

      {content && (
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{content}</p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-xs transition ${
            isLiked ? "text-accent-primary" : "text-text-muted hover:text-accent-secondary"
          }`}
        >
          <span>{isLiked ? "♥" : "♡"}</span>
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Rating from "@/components/Rating";

interface Props {
  animeId: string;
  userReview: { rating: number; content: string | null } | null;
  userWatchStatus: string | null;
  userFavorited: boolean;
  isLoggedIn: boolean;
}

export default function AnimeActions({ animeId, userReview, userWatchStatus, userFavorited, isLoggedIn }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(userReview?.rating ?? 0);
  const [content, setContent] = useState(userReview?.content ?? "");
  const [watchStatus, setWatchStatus] = useState(userWatchStatus);
  const [favorited, setFavorited] = useState(userFavorited);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-text-muted">
        <a href="/login" className="text-accent-primary hover:text-accent-secondary transition">Log in</a> to rate, review, and track anime.
      </p>
    );
  }

  async function handleWatch(status: string) {
    const res = await fetch(`/api/anime/${animeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "watch", status }),
    });
    if (res.ok) {
      setWatchStatus(status);
      router.refresh();
    }
  }

  async function handleFavorite() {
    const res = await fetch(`/api/anime/${animeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "favorite" }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
      router.refresh();
    }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSaving(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId, rating, content: content || null }),
    });
    if (res.ok) {
      setShowReviewForm(false);
      router.refresh();
    }
    setSaving(false);
  }

  const statuses = [
    { value: "COMPLETED", label: "Completed" },
    { value: "WATCHING", label: "Watching" },
    { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
    { value: "DROPPED", label: "Dropped" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleWatch(s.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              watchStatus === s.value
                ? "bg-accent-primary text-white"
                : "border border-white/10 bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={handleFavorite}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            favorited
              ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
              : "border border-white/10 bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80"
          }`}
        >
          {favorited ? "♥ Favorited" : "♡ Favorite"}
        </button>
      </div>

      {!showReviewForm ? (
        <button
          onClick={() => setShowReviewForm(true)}
          className="rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2 text-sm text-text-secondary transition hover:bg-bg-tertiary/80"
        >
          {userReview ? "Edit review" : "Write a review"}
        </button>
      ) : (
        <form onSubmit={handleReview} className="space-y-3 rounded-xl border border-white/10 bg-bg-secondary p-4">
          <Rating value={rating} onChange={setRating} />
          <textarea
            placeholder="Write your thoughts... (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={rating === 0 || saving}
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-secondary disabled:opacity-50"
            >
              {saving ? "Saving..." : userReview ? "Update" : "Post review"}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="rounded-lg px-4 py-2 text-sm text-text-muted transition hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalWatched: number;
  completed: number;
  watching: number;
  planToWatch: number;
  dropped: number;
  totalEpisodes: number;
  totalReviews: number;
  totalFavorites: number;
  avgRating: number | null;
  topGenres: { genre: string; count: number }[];
}

export default function UserStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}/stats`)
      .then((r) => r.json())
      .then(setStats);
  }, [userId]);

  if (!stats) {
    return (
      <div className="rounded-xl border border-white/5 bg-bg-card p-5 animate-pulse space-y-3">
        <div className="h-4 w-24 rounded bg-bg-tertiary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-14 rounded-lg bg-bg-tertiary" />)}
        </div>
      </div>
    );
  }

  const statBoxes = [
    { label: "Completed",    value: stats.completed,      color: "text-green-400" },
    { label: "Watching",     value: stats.watching,       color: "text-blue-400" },
    { label: "Plan to Watch",value: stats.planToWatch,    color: "text-purple-400" },
    { label: "Dropped",      value: stats.dropped,        color: "text-red-400" },
  ];

  const maxGenreCount = stats.topGenres[0]?.count ?? 1;

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card p-5 space-y-5">
      <h3 className="text-sm font-semibold text-text-primary">Stats</h3>

      {/* Top row numbers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statBoxes.map((s) => (
          <div key={s.label} className="rounded-lg bg-bg-tertiary p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Extra info */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
        <span>
          <strong className="text-text-secondary">{stats.totalEpisodes.toLocaleString()}</strong> episodes watched
        </span>
        {stats.avgRating && (
          <span>
            <strong className="text-yellow-400">{stats.avgRating}</strong> avg rating
          </span>
        )}
        <span>
          <strong className="text-text-secondary">{stats.totalFavorites}</strong> favorites
        </span>
      </div>

      {/* Genre bars */}
      {stats.topGenres.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Top Genres</p>
          {stats.topGenres.map(({ genre, count }) => (
            <div key={genre} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-text-secondary">{genre}</span>
              <div className="flex-1 rounded-full bg-bg-tertiary h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-primary/70 transition-all duration-500"
                  style={{ width: `${(count / maxGenreCount) * 100}%` }}
                />
              </div>
              <span className="w-4 text-right text-xs text-text-muted">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

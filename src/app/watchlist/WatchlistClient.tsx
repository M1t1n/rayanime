"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AnimeEntry {
  watchId: string;
  id: string;
  title: string;
  coverImage: string | null;
  score: number | null;
  genres: string[];
  year: number | null;
  episodes: number | null;
  status: string;
  episodeProgress: number;
}

interface Props {
  grouped: Record<string, AnimeEntry[]>;
  statusLabels: Record<string, string>;
  statusOrder: string[];
}

const STATUS_COLORS: Record<string, string> = {
  WATCHING:      "bg-blue-500/15 text-blue-400 border-blue-500/25",
  PLAN_TO_WATCH: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  COMPLETED:     "bg-green-500/15 text-green-400 border-green-500/25",
  DROPPED:       "bg-red-500/15 text-red-400 border-red-500/25",
};

export default function WatchlistClient({ grouped, statusLabels, statusOrder }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(statusOrder[0]);
  const [removing, setRemoving] = useState<string | null>(null);
  const [localGrouped, setLocalGrouped] = useState(grouped);

  const totalCount = statusOrder.reduce((s, k) => s + (localGrouped[k]?.length ?? 0), 0);

  async function handleRemove(watchId: string, animeId: string, status: string) {
    setRemoving(watchId);
    const res = await fetch(`/api/anime/${animeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unwatch" }),
    });
    if (res.ok) {
      setLocalGrouped((prev) => ({
        ...prev,
        [status]: prev[status].filter((e) => e.watchId !== watchId),
      }));
      router.refresh();
    }
    setRemoving(null);
  }

  async function handleChangeStatus(animeId: string, oldStatus: string, newStatus: string, watchId: string) {
    const res = await fetch(`/api/anime/${animeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "watch", status: newStatus }),
    });
    if (res.ok) {
      const entry = localGrouped[oldStatus].find((e) => e.watchId === watchId);
      if (!entry) return;
      setLocalGrouped((prev) => ({
        ...prev,
        [oldStatus]: prev[oldStatus].filter((e) => e.watchId !== watchId),
        [newStatus]: [{ ...entry, status: newStatus }, ...prev[newStatus]],
      }));
      router.refresh();
    }
  }

  const entries = localGrouped[activeTab] ?? [];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Watchlist</h1>
          <p className="mt-1 text-sm text-text-muted">{totalCount} anime tracked</p>
        </div>
        <Link href="/search" className="text-sm text-accent-primary hover:text-accent-secondary transition">
          + Add more
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        {statusOrder.map((status) => {
          const count = localGrouped[status]?.length ?? 0;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`relative px-4 py-2.5 text-sm font-medium transition ${
                activeTab === status
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {statusLabels[status]}
              {count > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === status ? "bg-accent-primary/20 text-accent-primary" : "bg-bg-tertiary text-text-muted"
                }`}>
                  {count}
                </span>
              )}
              {activeTab === status && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-muted text-sm">Nothing here yet.</p>
          <Link href="/search" className="mt-2 inline-block text-sm text-accent-primary hover:text-accent-secondary transition">
            Browse anime →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.watchId}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-bg-card px-4 py-3 transition hover:border-white/10"
            >
              {/* Cover */}
              <Link href={`/anime/${entry.id}`} className="shrink-0">
                <div className="relative h-16 w-11 overflow-hidden rounded-lg bg-bg-tertiary">
                  {entry.coverImage && (
                    <Image src={entry.coverImage} alt="" fill className="object-cover" sizes="44px" />
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <Link href={`/anime/${entry.id}`} className="text-sm font-medium text-text-primary hover:text-accent-secondary transition truncate block">
                  {entry.title}
                </Link>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  {entry.year && <span>{entry.year}</span>}
                  {entry.episodes && <span>{entry.episodes} eps</span>}
                  {entry.score && (
                    <span className="flex items-center gap-0.5">
                      <span className="text-yellow-400">★</span>{entry.score.toFixed(1)}
                    </span>
                  )}
                </div>
                {/* Episode progress bar for Watching */}
                {entry.status === "WATCHING" && entry.episodes && entry.episodes > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-bg-tertiary overflow-hidden max-w-[120px]">
                      <div
                        className="h-full rounded-full bg-blue-400/70 transition-all"
                        style={{ width: `${Math.min(100, (entry.episodeProgress / entry.episodes) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted">{entry.episodeProgress}/{entry.episodes}</span>
                  </div>
                )}
              </div>

              {/* Status changer + remove — visible on hover */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                <select
                  value={entry.status}
                  onChange={(e) => handleChangeStatus(entry.id, entry.status, e.target.value, entry.watchId)}
                  className={`rounded-lg border px-2 py-1 text-xs font-medium cursor-pointer outline-none transition ${STATUS_COLORS[entry.status]} bg-transparent`}
                >
                  {statusOrder.map((s) => (
                    <option key={s} value={s} className="bg-bg-secondary text-text-primary">
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(entry.watchId, entry.id, entry.status)}
                  disabled={removing === entry.watchId}
                  title="Remove from watchlist"
                  className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-40"
                >
                  {removing === entry.watchId ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface JikanResult {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  synopsis: string | null;
  episodes: number | null;
  score: number | null;
  year: number | null;
  genres: { name: string }[];
  status: string | null;
}

export default function AddAnimePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JikanResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="pt-20 text-center">
        <p className="text-text-secondary">
          Please{" "}
          <Link href="/login" className="text-accent-primary hover:text-accent-secondary transition">
            log in
          </Link>{" "}
          to add anime.
        </p>
      </div>
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query.trim())}&limit=20&sfw=true`
      );
      const data = await res.json();
      setResults(data.data ?? []);
      if ((data.data ?? []).length === 0) setError("No results found. Try a different title.");
    } catch {
      setError("Failed to search. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(malId: number) {
    setAdding(malId);
    setError("");

    const res = await fetch("/api/anime/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ malId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to add anime");
      setAdding(null);
      return;
    }

    setAdded((prev) => new Set(prev).add(malId));
    setAdding(null);

    // Navigate to the anime page
    router.push(`/anime/${data.anime.id}`);
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Anime</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Search MyAnimeList and add any anime to RayaNime.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Neon Genesis Evangelion, Spy x Family..."
          className="flex-1 rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
          autoFocus
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-secondary disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((a) => (
            <div
              key={a.mal_id}
              className="flex gap-4 rounded-xl border border-white/5 bg-bg-card p-4 transition hover:border-white/10"
            >
              {/* Cover */}
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-bg-tertiary">
                {a.images?.jpg?.large_image_url && (
                  <Image
                    src={a.images.jpg.large_image_url}
                    alt={a.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-text-primary">{a.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  {a.year && <span>{a.year}</span>}
                  {a.episodes && <span>{a.episodes} eps</span>}
                  {a.score && (
                    <span className="flex items-center gap-0.5">
                      <span className="text-yellow-400">★</span>
                      {a.score}
                    </span>
                  )}
                  {a.genres.slice(0, 3).map((g) => (
                    <span key={g.name} className="rounded-full bg-bg-tertiary px-2 py-0.5">
                      {g.name}
                    </span>
                  ))}
                </div>
                {a.synopsis && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-text-muted">{a.synopsis}</p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0 self-center">
                {added.has(a.mal_id) ? (
                  <span className="rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-400">
                    ✓ Added
                  </span>
                ) : (
                  <button
                    onClick={() => handleAdd(a.mal_id)}
                    disabled={adding === a.mal_id}
                    className="rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent-secondary disabled:opacity-50"
                  >
                    {adding === a.mal_id ? "Adding..." : "+ Add"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

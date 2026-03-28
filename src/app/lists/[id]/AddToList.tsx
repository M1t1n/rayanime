"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToList({ listId }: { listId: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/anime?q=${encodeURIComponent(query.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
    setSearching(false);
  }

  async function addAnime(animeId: string) {
    const res = await fetch(`/api/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId }),
    });
    if (res.ok) {
      setResults((prev) => prev.filter((a) => a.id !== animeId));
      router.refresh();
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-bg-secondary p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime to add..."
          className="flex-1 rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-secondary"
        >
          {searching ? "..." : "Search"}
        </button>
      </form>
      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg bg-bg-tertiary px-3 py-2">
              <span className="text-sm text-text-primary">{a.title}</span>
              <button
                onClick={() => addAnime(a.id)}
                className="rounded px-3 py-1 text-xs font-medium text-accent-primary transition hover:bg-accent-primary/10"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

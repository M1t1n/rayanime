"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent-primary">Raya</span>
            <span className="text-text-primary">Nime</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-text-secondary md:flex">
            <Link href="/" className="transition hover:text-text-primary">Feed</Link>
            <Link href="/search" className="transition hover:text-text-primary">Browse</Link>
            <Link href="/lists" className="transition hover:text-text-primary">Lists</Link>
            {session?.user && (
              <Link href="/anime/add" className="transition hover:text-text-primary">+ Add Anime</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:block">
            <input
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 rounded-lg border border-white/10 bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50 focus:w-64"
            />
          </form>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${(session.user as any).id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
              >
                <div className="h-7 w-7 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs font-bold text-accent-primary">
                  {session.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="hidden md:inline">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-lg px-3 py-1.5 text-sm text-text-muted transition hover:bg-bg-tertiary hover:text-text-primary"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm text-text-secondary transition hover:text-text-primary">
                Log in
              </Link>
              <Link href="/signup" className="rounded-lg bg-accent-primary px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent-secondary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

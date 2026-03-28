"use client";

import Link from "next/link";
import Image from "next/image";

interface Props {
  id: string;
  title: string;
  coverImage: string | null;
  score: number | null;
  genres?: string[];
  year?: number | null;
}

export default function AnimeCard({ id, title, coverImage, score, genres, year }: Props) {
  return (
    <Link href={`/anime/${id}`} className="group block">
      <div className="card-glow overflow-hidden rounded-xl bg-bg-card border border-white/5">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-tertiary text-text-muted">
              No Image
            </div>
          )}
          {score && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-medium text-text-primary group-hover:text-accent-secondary transition">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            {year && <span>{year}</span>}
            {genres && genres.length > 0 && (
              <>
                {year && <span>·</span>}
                <span className="truncate">{genres.slice(0, 2).join(", ")}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

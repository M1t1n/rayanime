"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Props {
  type: "review" | "watched" | "favorite" | "list";
  user: { id: string; name: string };
  anime?: { id: string; title: string; coverImage: string | null };
  rating?: number;
  content?: string | null;
  listTitle?: string;
  createdAt: string;
}

export default function FeedItem({ type, user, anime, rating, content, listTitle, createdAt }: Props) {
  function label() {
    switch (type) {
      case "review": return <>rated <Link href={`/anime/${anime?.id}`} className="font-medium text-text-primary hover:text-accent-secondary transition">{anime?.title}</Link> <span className="text-yellow-400 font-semibold">{rating}/10</span></>;
      case "watched": return <>watched <Link href={`/anime/${anime?.id}`} className="font-medium text-text-primary hover:text-accent-secondary transition">{anime?.title}</Link></>;
      case "favorite": return <>added <Link href={`/anime/${anime?.id}`} className="font-medium text-text-primary hover:text-accent-secondary transition">{anime?.title}</Link> to favorites</>;
      case "list": return <>created list &quot;{listTitle}&quot;</>;
    }
  }

  return (
    <div className="animate-fade-in flex gap-4 rounded-xl border border-white/5 bg-bg-card p-4">
      {anime?.coverImage && (
        <Link href={`/anime/${anime.id}`} className="shrink-0">
          <div className="relative h-20 w-14 overflow-hidden rounded-lg">
            <Image src={anime.coverImage} alt="" fill className="object-cover" sizes="56px" />
          </div>
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-secondary">
          <Link href={`/profile/${user.id}`} className="font-medium text-text-primary hover:text-accent-secondary transition">
            {user.name}
          </Link>{" "}
          {label()}
        </p>
        {content && <p className="mt-1.5 truncate text-xs text-text-muted">{content}</p>}
        <p className="mt-2 text-xs text-text-muted">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

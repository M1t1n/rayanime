"use client";

import Link from "next/link";
import Image from "next/image";

interface Props {
  id: string;
  title: string;
  description: string | null;
  user: { id: string; name: string };
  itemCount: number;
  previewImages: (string | null)[];
}

export default function ListCard({ id, title, description, user, itemCount, previewImages }: Props) {
  return (
    <Link href={`/lists/${id}`} className="block">
      <div className="card-glow rounded-xl border border-white/5 bg-bg-card p-4">
        <div className="mb-3 flex gap-1.5">
          {previewImages.slice(0, 4).map((img, i) => (
            <div key={i} className="relative h-16 w-11 overflow-hidden rounded-md bg-bg-tertiary">
              {img && <Image src={img} alt="" fill className="object-cover" sizes="44px" />}
            </div>
          ))}
          {previewImages.length === 0 && (
            <div className="flex h-16 w-full items-center justify-center rounded-md bg-bg-tertiary text-xs text-text-muted">
              Empty list
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        {description && <p className="mt-1 truncate text-xs text-text-muted">{description}</p>}
        <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
          <span>{user.name}</span>
          <span>·</span>
          <span>{itemCount} anime</span>
        </div>
      </div>
    </Link>
  );
}

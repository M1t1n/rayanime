import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import AddToList from "./AddToList";

export const dynamic = "force-dynamic";

export default async function ListPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  const list = await prisma.list.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true } },
      items: {
        orderBy: { order: "asc" },
        include: { anime: true },
      },
    },
  });

  if (!list) notFound();
  const isOwner = currentUserId === list.userId;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{list.title}</h1>
        {list.description && <p className="mt-1 text-sm text-text-secondary">{list.description}</p>}
        <p className="mt-2 text-xs text-text-muted">
          by <Link href={`/profile/${list.user.id}`} className="text-text-secondary hover:text-accent-secondary transition">{list.user.name}</Link>
          {" · "}{list.items.length} anime
        </p>
      </div>

      {isOwner && <AddToList listId={list.id} />}

      {list.items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {list.items.map((item) => (
            <AnimeCard
              key={item.anime.id}
              id={item.anime.id}
              title={item.anime.title}
              coverImage={item.anime.coverImage}
              score={item.anime.score}
              genres={item.anime.genres}
              year={item.anime.year}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">This list is empty.</p>
      )}
    </div>
  );
}

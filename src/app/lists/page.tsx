import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ListCard from "@/components/ListCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ListsPage() {
  const session = await getServerSession(authOptions);

  const lists = await prisma.list.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      user: { select: { id: true, name: true } },
      items: {
        take: 4,
        include: { anime: { select: { coverImage: true } } },
      },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Lists</h1>
        {session && (
          <Link
            href="/lists/new"
            className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-secondary"
          >
            Create list
          </Link>
        )}
      </div>

      {lists.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              title={list.title}
              description={list.description}
              user={list.user}
              itemCount={list._count.items}
              previewImages={list.items.map((i) => i.anime.coverImage)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">No lists yet. Create the first one!</p>
      )}
    </div>
  );
}

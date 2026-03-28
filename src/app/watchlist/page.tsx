import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WatchlistClient from "./WatchlistClient";

export const dynamic = "force-dynamic";

const STATUS_ORDER = ["WATCHING", "PLAN_TO_WATCH", "COMPLETED", "DROPPED"] as const;
const STATUS_LABELS: Record<string, string> = {
  WATCHING: "Watching",
  PLAN_TO_WATCH: "Plan to Watch",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
};

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const entries = await prisma.watchedAnime.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      anime: {
        select: { id: true, title: true, coverImage: true, score: true, genres: true, year: true, episodes: true },
      },
    },
  });

  // Group by status
  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = entries.filter((e) => e.status === status).map((e) => ({
      watchId: e.id,
      status: e.status,
      episodeProgress: e.episodeProgress,
      ...e.anime,
    }));
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <WatchlistClient
      grouped={grouped}
      statusLabels={STATUS_LABELS}
      statusOrder={[...STATUS_ORDER]}
    />
  );
}

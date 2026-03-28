import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { action, status } = await req.json();

  if (action === "watch") {
    await prisma.watchedAnime.upsert({
      where: { userId_animeId: { userId, animeId: params.id } },
      create: { userId, animeId: params.id, status },
      update: { status },
    });
    return NextResponse.json({ ok: true, status });
  }

  if (action === "progress") {
    const { episode } = await req.json().catch(() => ({}));
    const ep = parseInt(episode);
    if (isNaN(ep) || ep < 0) return NextResponse.json({ error: "Invalid episode" }, { status: 400 });
    await prisma.watchedAnime.upsert({
      where: { userId_animeId: { userId, animeId: params.id } },
      create: { userId, animeId: params.id, status: "WATCHING", episodeProgress: ep },
      update: { episodeProgress: ep },
    });
    return NextResponse.json({ ok: true, episodeProgress: ep });
  }

  if (action === "unwatch") {
    await prisma.watchedAnime.deleteMany({ where: { userId, animeId: params.id } });
    return NextResponse.json({ ok: true });
  }

  if (action === "unfavorite") {
    await prisma.favorite.deleteMany({ where: { userId, animeId: params.id } });
    return NextResponse.json({ ok: true });
  }

  if (action === "favorite") {
    const existing = await prisma.favorite.findUnique({
      where: { userId_animeId: { userId, animeId: params.id } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }
    await prisma.favorite.create({ data: { userId, animeId: params.id } });
    return NextResponse.json({ favorited: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

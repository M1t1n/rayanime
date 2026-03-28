import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { animeId, rating, content } = await req.json();

  if (!animeId || !rating || rating < 1 || rating > 10) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { userId_animeId: { userId, animeId } },
    create: { userId, animeId, rating, content },
    update: { rating, content },
  });

  // Also mark as watched
  await prisma.watchedAnime.upsert({
    where: { userId_animeId: { userId, animeId } },
    create: { userId, animeId, status: "COMPLETED" },
    update: {},
  });

  return NextResponse.json(review, { status: 201 });
}

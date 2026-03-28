import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchAnimeById, jikanToDb } from "@/lib/jikan";

// POST /api/anime/add  { malId: number }
// Fetches from Jikan and saves to DB, returns the anime record
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to add anime" }, { status: 401 });
  }

  const { malId } = await req.json();
  if (!malId || typeof malId !== "number") {
    return NextResponse.json({ error: "Invalid malId" }, { status: 400 });
  }

  // If already in DB just return it
  const existing = await prisma.anime.findUnique({ where: { malId } });
  if (existing) {
    return NextResponse.json({ anime: existing, alreadyExists: true });
  }

  // Fetch from Jikan
  const jikanAnime = await fetchAnimeById(malId);
  if (!jikanAnime) {
    return NextResponse.json({ error: "Anime not found on MyAnimeList" }, { status: 404 });
  }

  const anime = await prisma.anime.create({ data: jikanToDb(jikanAnime) });
  return NextResponse.json({ anime, alreadyExists: false }, { status: 201 });
}

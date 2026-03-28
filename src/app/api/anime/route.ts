import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchAnime, jikanToDb } from "@/lib/jikan";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (q) {
    // Fetch from Jikan and upsert
    const jikanResults = await searchAnime(q);
    for (const a of jikanResults) {
      await prisma.anime.upsert({
        where: { malId: a.mal_id },
        create: jikanToDb(a),
        update: jikanToDb(a),
      });
    }
    const anime = await prisma.anime.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      orderBy: { score: "desc" },
      take: 20,
    });
    return NextResponse.json(anime);
  }

  const anime = await prisma.anime.findMany({
    orderBy: { score: "desc" },
    take: 20,
  });
  return NextResponse.json(anime);
}

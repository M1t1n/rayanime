import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      user: { select: { id: true, name: true } },
      anime: { select: { id: true, title: true, coverImage: true } },
    },
  });

  const feed = reviews.map((r) => ({
    type: "review",
    user: r.user,
    anime: r.anime,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));

  return NextResponse.json(feed);
}

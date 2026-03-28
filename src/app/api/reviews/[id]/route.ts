import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggle like on a review
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId: params.id } },
  });

  if (existing) {
    await prisma.reviewLike.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  await prisma.reviewLike.create({ data: { userId, reviewId: params.id } });
  return NextResponse.json({ liked: true });
}

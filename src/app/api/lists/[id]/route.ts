import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Add anime to list
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { animeId } = await req.json();

  const list = await prisma.list.findUnique({ where: { id: params.id } });
  if (!list || list.userId !== userId) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  const maxOrder = await prisma.listItem.findFirst({
    where: { listId: params.id },
    orderBy: { order: "desc" },
  });

  await prisma.listItem.upsert({
    where: { listId_animeId: { listId: params.id, animeId } },
    create: { listId: params.id, animeId, order: (maxOrder?.order ?? -1) + 1 },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

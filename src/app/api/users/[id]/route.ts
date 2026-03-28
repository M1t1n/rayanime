import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id] — fetch public profile data
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, bio: true, avatar: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

// PUT /api/users/[id] — update own profile
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUserId = (session.user as any).id;
  if (currentUserId !== params.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, bio } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { name: name.trim(), bio: bio?.trim() ?? "" },
    select: { id: true, name: true, bio: true },
  });

  return NextResponse.json(updated);
}

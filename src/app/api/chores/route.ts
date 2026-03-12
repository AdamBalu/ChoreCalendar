export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { chores } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const createChoreSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(50000),
  iconType: z.enum(["emoji", "image"]),
  score: z.number().int().min(1).max(100),
  isFavorite: z.boolean().optional(),
});

const updateChoreSchema = z.object({
  id: z.string().min(1),
  isFavorite: z.boolean(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userChores = await db
    .select()
    .from(chores)
    .where(eq(chores.userId, session.user.id));

  return NextResponse.json(userChores);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = createChoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, icon, iconType, score, isFavorite } = parsed.data;

  const [newChore] = await db
    .insert(chores)
    .values({
      userId: session.user.id,
      name,
      icon,
      iconType,
      score,
      isFavorite: isFavorite ?? false,
    })
    .returning();

  return NextResponse.json(newChore, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing chore id" }, { status: 400 });
  }

  await db
    .delete(chores)
    .where(eq(chores.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = updateChoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, isFavorite } = parsed.data;

  const [updated] = await db
    .update(chores)
    .set({ isFavorite })
    .where(eq(chores.id, id))
    .returning();

  return NextResponse.json(updated);
}


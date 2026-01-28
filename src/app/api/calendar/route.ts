import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { choreInstances } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const createInstanceSchema = z.object({
  choreId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  choreName: z.string().min(1),
  choreIcon: z.string().min(1),
  choreIconType: z.enum(["emoji", "image"]),
  choreScore: z.number().int().min(0),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instances = await db
    .select()
    .from(choreInstances)
    .where(eq(choreInstances.userId, session.user.id));

  return NextResponse.json(instances);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = createInstanceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { choreId, date, choreName, choreIcon, choreIconType, choreScore } = parsed.data;

  const [newInstance] = await db
    .insert(choreInstances)
    .values({
      userId: session.user.id,
      choreId,
      date,
      choreName,
      choreIcon,
      choreIconType,
      choreScore,
    })
    .returning();

  return NextResponse.json(newInstance, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing instance id" }, { status: 400 });
  }

  await db
    .delete(choreInstances)
    .where(eq(choreInstances.id, id));

  return NextResponse.json({ success: true });
}


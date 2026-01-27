import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const updateSettingsSchema = z.object({
  targetScore: z.number().int().min(1).max(100),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select({ targetScore: users.targetScore })
    .from(users)
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ targetScore: user?.targetScore ?? 10 });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = updateSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ targetScore: parsed.data.targetScore })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}

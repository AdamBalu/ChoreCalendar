"use server";

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is admin (creator gets free premium)
    const isAdmin = session.user.email === env.ADMIN_EMAIL;

    // Get user's premium status from database
    const user = await db
      .select({ isPremium: users.isPremium })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const isPremium = isAdmin || (user[0]?.isPremium ?? false);

    return NextResponse.json({
      isPremium,
      isAdmin,
    });
  } catch (error) {
    console.error("Error fetching premium status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

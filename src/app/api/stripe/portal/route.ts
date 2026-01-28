import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user's Stripe customer ID
    const userRecord = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userRecord[0]) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const customerId = userRecord[0].stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: "No active Stripe subscription found for this account" },
        { status: 400 }
      );
    }

    // Determine the base URL for redirects
    const origin = request.headers.get("origin") ?? env.NEXTAUTH_URL ?? "http://localhost:3000";

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

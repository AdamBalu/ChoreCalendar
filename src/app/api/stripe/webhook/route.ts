export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle subscription events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        if (userId) {
          await db
            .update(users)
            .set({
              isPremium: true,
              stripeSubscriptionId: subscriptionId,
            })
            .where(eq(users.id, userId));

          console.log(`User ${userId} upgraded to premium`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerObj = subscription.customer;
        const customerId = typeof customerObj === 'string' 
          ? customerObj 
          : 'deleted' in customerObj 
            ? customerObj.id 
            : customerObj.id;

        // Find user by Stripe customer ID
        const user = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          await db
            .update(users)
            .set({
              isPremium: false,
              stripeSubscriptionId: null,
            })
            .where(eq(users.id, user[0].id));

          console.log(`User ${user[0].id} subscription cancelled`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerObj2 = subscription.customer;
        const customerId = typeof customerObj2 === 'string' 
          ? customerObj2 
          : 'deleted' in customerObj2 
            ? customerObj2.id 
            : customerObj2.id;
        const isActive = subscription.status === "active";

        // Find user by Stripe customer ID
        const user = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          await db
            .update(users)
            .set({ isPremium: isActive })
            .where(eq(users.id, user[0].id));

          console.log(`User ${user[0].id} subscription updated: isPremium=${isActive}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

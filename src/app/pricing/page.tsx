"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Image, ArrowLeft, Loader2 } from "lucide-react";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isPremium, isLoading } = usePremiumStatus();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (response.ok) {
        const data = (await response.json()) as { url: string };
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="pricing-page">
      <button className="pricing-back-btn" onClick={() => router.push("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Unlock custom image icons for your chores</p>
      </div>

      {isLoading ? (
        <div className="pricing-loading">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="pricing-cards">
          {/* Free Tier */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h2>Free</h2>
              <div className="pricing-price">
                <span className="pricing-amount">$0</span>
                <span className="pricing-period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li>
                <Check size={16} />
                <span>Unlimited chores</span>
              </li>
              <li>
                <Check size={16} />
                <span>Emoji icons</span>
              </li>
              <li>
                <Check size={16} />
                <span>Drag & drop calendar</span>
              </li>
              <li>
                <Check size={16} />
                <span>Daily progress tracking</span>
              </li>
              <li>
                <Check size={16} />
                <span>Cloud sync</span>
              </li>
            </ul>
            <button className="pricing-btn current" disabled>
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="pricing-card premium">
            <div className="pricing-badge">
              <Sparkles size={14} />
              <span>Popular</span>
            </div>
            <div className="pricing-card-header">
              <h2>Premium</h2>
              <div className="pricing-price">
                <span className="pricing-amount">$2</span>
                <span className="pricing-period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li>
                <Check size={16} />
                <span>Everything in Free</span>
              </li>
              <li>
                <Check size={16} />
                <span>Support the developer</span>
              </li>
              <li className="highlight">
                <Image size={16} />
                <span>Custom image icons</span>
              </li>
            </ul>
            {isPremium ? (
              <button className="pricing-btn current" disabled>
                <Check size={18} />
                <span>You&apos;re Premium!</span>
              </button>
            ) : (
              <button
                className="pricing-btn upgrade"
                onClick={handleUpgrade}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Upgrade Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

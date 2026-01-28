"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="legal-page">
      <button className="pricing-back-btn" onClick={() => router.back()}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <article className="legal-content">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: January 28, 2026</p>

        <section>
          <h2>1. Provider Information</h2>
          <p>
            These Terms of Service govern your use of Chore Calendar, operated
            by:
            <br />
            <strong>Adam Balušeskul</strong>
            <br />
            IČO: 23539500
            <br />
            Address: Mášova 14, 602 00 Brno, Czech Republic
            <br />
            Email:{" "}
            <a href="mailto:blaubalu.dev@gmail.com">blaubalu.dev@gmail.com</a>
          </p>
          <p>The provider is a sole trader (OSVČ) operating under Czech law.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Chore Calendar is a web application that helps users organize and
            track household chores through a calendar-based interface. The
            service includes:
          </p>
          <ul>
            <li>Creating and managing chores with customizable icons</li>
            <li>Drag-and-drop calendar scheduling</li>
            <li>Progress tracking with daily goals</li>
            <li>Cloud synchronization across devices</li>
            <li>Premium features including custom image icons</li>
          </ul>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <p>
            To use Chore Calendar, you must sign in using a supported
            authentication provider (Google or GitHub). By registering, you
            confirm that:
          </p>
          <ul>
            <li>You are at least 16 years of age</li>
            <li>The information you provide is accurate</li>
            <li>
              You are responsible for maintaining the security of your account
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Free and Premium Plans</h2>
          <p>
            Chore Calendar offers a free tier with core functionality. A Premium
            subscription (2€/month) unlocks additional features such as custom
            image icons.
          </p>
          <p>
            Premium subscriptions are processed via Stripe. By subscribing, you
            agree to:
          </p>
          <ul>
            <li>Automatic monthly billing until cancelled</li>
            <li>
              Cancellation at any time through your account settings or Stripe
              portal
            </li>
            <li>No refunds for partial billing periods upon cancellation</li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>
              Upload content that violates third-party rights or applicable laws
            </li>
            <li>Attempt to disrupt, hack, or interfere with the service</li>
            <li>Share your account credentials with others</li>
            <li>
              Use automated tools to access the service without permission
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            The Chore Calendar application, including its design, code, and
            branding, is owned by the provider. You retain ownership of any
            content (such as custom images) you upload to the service.
          </p>
          <p>
            By uploading content, you grant us a limited license to store and
            display it within the service for your use.
          </p>
        </section>

        <section>
          <h2>7. Service Availability</h2>
          <p>
            We aim to provide reliable service but cannot guarantee
            uninterrupted availability. The service may be temporarily
            unavailable for maintenance or due to circumstances beyond our
            control.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, the provider shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the service.
          </p>
          <p>
            The total liability for any claims related to the service is limited
            to the amount you have paid for the Premium subscription in the 12
            months preceding the claim.
          </p>
        </section>

        <section>
          <h2>9. Account Termination</h2>
          <p>
            You may delete your account at any time. We may suspend or terminate
            your access if you violate these terms. Upon termination, your data
            will be deleted in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms of Service. Continued use of the service
            after changes constitutes acceptance of the updated terms. We will
            notify users of significant changes by email or in-app notice.
          </p>
        </section>

        <section>
          <h2>11. Governing Law and Disputes</h2>
          <p>
            These terms are governed by the laws of the Czech Republic. Any
            disputes shall be resolved by the competent courts of the Czech
            Republic.
          </p>
          <p>
            For EU consumers: You may also use the European Online Dispute
            Resolution platform at{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>
            For questions about these terms, contact the provider at{" "}
            <a href="mailto:blaubalu.dev@gmail.com">blaubalu.dev@gmail.com</a>.
          </p>
        </section>
      </article>

      <div className="legal-footer">
        <Link href="/privacy">Privacy Policy</Link>
        <span>·</span>
        <Link href="/pricing">Pricing</Link>
      </div>
    </div>
  );
}

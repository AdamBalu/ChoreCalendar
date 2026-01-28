"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="legal-page">
      <button className="pricing-back-btn" onClick={() => router.back()}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <article className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 28, 2026</p>

        <section>
          <h2>1. Data Controller</h2>
          <p>
            The data controller for your personal data is:
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
          <p>
            This sole trader (OSVČ) operates under the laws of the Czech
            Republic.
          </p>
        </section>

        <section>
          <h2>2. Personal Data We Collect</h2>
          <p>
            We collect and process the following categories of personal data:
          </p>
          <ul>
            <li>
              <strong>Account data:</strong> Name, email address, and profile
              picture provided by your authentication provider (Google or
              GitHub)
            </li>
            <li>
              <strong>Usage data:</strong> Information about your chores,
              calendar entries, and app preferences
            </li>
            <li>
              <strong>Payment data:</strong> For premium subscriptions, Stripe
              processes your payment information. We only store a reference to
              your Stripe customer ID—we do not store credit card details
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser type, and
              device information collected automatically
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Legal Basis and Purpose</h2>
          <p>We process your personal data based on:</p>
          <ul>
            <li>
              <strong>Contract performance:</strong> To provide the Chore
              Calendar service and manage your account
            </li>
            <li>
              <strong>Legitimate interests:</strong> To improve our services and
              ensure security
            </li>
            <li>
              <strong>Consent:</strong> For optional features and marketing
              communications (where applicable)
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>We share your data only with:</p>
          <ul>
            <li>
              <strong>Authentication providers:</strong> Google and/or GitHub
              for login purposes
            </li>
            <li>
              <strong>Stripe:</strong> Payment processor for premium
              subscriptions
            </li>
            <li>
              <strong>Neon (database provider):</strong> Cloud database hosting
              within the EU
            </li>
          </ul>
          <p>We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active.
            If you delete your account, your data will be removed within 30
            days, except where we are required by law to retain it longer (e.g.,
            financial records).
          </p>
        </section>

        <section>
          <h2>6. Your Rights (GDPR)</h2>
          <p>
            Under the General Data Protection Regulation (GDPR), you have the
            right to:
          </p>
          <ul>
            <li>
              <strong>Access</strong> the personal data we hold about you
            </li>
            <li>
              <strong>Rectify</strong> inaccurate or incomplete data
            </li>
            <li>
              <strong>Erase</strong> your data (&quot;right to be
              forgotten&quot;)
            </li>
            <li>
              <strong>Restrict</strong> processing in certain circumstances
            </li>
            <li>
              <strong>Data portability</strong> — receive your data in a
              structured format
            </li>
            <li>
              <strong>Object</strong> to processing based on legitimate
              interests
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time, where processing is
              based on consent
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact the provider at{" "}
            <a href="mailto:blaubalu.dev@gmail.com">blaubalu.dev@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            We use essential cookies required for authentication and session
            management. These cookies are necessary for the service to function
            and cannot be disabled.
          </p>
          <p>
            We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2>8. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data, including encryption in transit (HTTPS)
            and secure cloud infrastructure.
          </p>
        </section>

        <section>
          <h2>9. Supervisory Authority</h2>
          <p>
            If you believe your data protection rights have been violated, you
            have the right to lodge a complaint with the Czech Office for
            Personal Data Protection (Úřad pro ochranu osobních údajů — ÚOOÚ):
          </p>
          <p>
            <a
              href="https://www.uoou.cz"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.uoou.cz
            </a>
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by posting a notice in the app or by
            email.
          </p>
        </section>
      </article>

      <div className="legal-footer">
        <Link href="/terms">Terms of Service</Link>
        <span>·</span>
        <Link href="/pricing">Pricing</Link>
      </div>
    </div>
  );
}

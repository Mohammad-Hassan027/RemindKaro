"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import CheckoutButton from "@/components/ui/CheckoutButton";
import styles from "./page.module.css";

// ─── Feature row ───────────────────────────────────────────────────────────
function Feature({ included = true, children }) {
  return (
    <li className={`${styles.featureItem} ${included ? "" : styles.disabled}`}>
      {included ? (
        <span className={styles.checkIcon} aria-hidden />
      ) : (
        <span className={styles.crossIcon} aria-hidden />
      )}
      {children}
    </li>
  );
}

// ─── Compare table helpers ─────────────────────────────────────────────────
function Check() {
  return <span className={styles.checkCell}>✓</span>;
}
function Dash() {
  return <span className={styles.dashCell}>—</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'yearly'

  const proPrice = billing === "monthly" ? "749" : "500";
  const proNote =
    billing === "monthly" ? "/month" : "/mo · ₹5,999 billed yearly";
  const proPlanId =
    billing === "monthly" ? "plan_pro_monthly" : "plan_pro_yearly";

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel from your account settings at any time. You keep access until the end of your billing period.",
    },
    {
      q: "What payment methods are supported?",
      a: "UPI, all major credit/debit cards, net banking, wallets (Paytm, PhonePe, etc.) — powered by Razorpay.",
    },
    {
      q: "Are payments secure?",
      a: "Yes. Payments are processed by Razorpay, a PCI DSS Level 1 certified payment gateway. We never store your card details.",
    },
    {
      q: "Is there a free trial for Pro?",
      a: "Not currently, but the Starter plan is free forever — try RemindKaro risk-free.",
    },
    {
      q: "What's included in Lifetime?",
      a: "All current and future Pro features, forever. One payment — no recurring charges, ever.",
    },
    {
      q: "Do you offer team or student plans?",
      a: "Team plans are on our roadmap. Student discounts are coming soon. Contact us to be notified first.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <header className={styles.topbar}>
        <BrandLogo href="/dashboard" size="sm" />
        <Link href="/dashboard" className={styles.backLink}>
          <span className={styles.backArrow}>←</span>
          Back to Dashboard
        </Link>
      </header>

      <main className={styles.main}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <span className={styles.badge}>Pricing · Pay in ₹ INR</span>
          <h1 className={styles.heroTitle}>
            Focus on execution,
            <br />
            not remembering.
          </h1>
          <p className={styles.heroDesc}>
            AI-powered urgency escalation so you never miss a deadline. No
            hidden fees. Cancel anytime. Pay in Indian Rupees via UPI, cards
            &amp; more.
          </p>

          {/* Billing toggle */}
          <div className={styles.billingToggle}>
            <button
              className={`${styles.toggleBtn} ${billing === "monthly" ? styles.active : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`${styles.toggleBtn} ${billing === "yearly" ? styles.active : ""}`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              {billing !== "yearly" && (
                <span className={styles.saveBadge}>Save 33%</span>
              )}
            </button>
          </div>
        </section>

        {/* ── Pricing cards ── */}
        <div className={styles.grid}>
          {/* Starter */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.planName}>Starter</p>
              <p className={styles.planDesc}>For students and casual users.</p>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₹</span>
              <span className={styles.priceAmount}>0</span>
              <span className={styles.pricePeriod}>/forever</span>
            </div>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <Feature>Up to 15 active deadlines</Feature>
              <Feature>Standard web reminders</Feature>
              <Feature>Manual task entry</Feature>
              <Feature included={false}>Smart urgency escalation</Feature>
              <Feature included={false}>Voice task creation</Feature>
              <Feature included={false}>WhatsApp &amp; Telegram nudges</Feature>
            </ul>
            <Link
              href="/dashboard"
              className={`${styles.ctaBtn} ${styles.ctaSecondary}`}
            >
              Current Plan
            </Link>
          </div>

          {/* Pro (featured) */}
          <div className={`${styles.card} ${styles.cardFeatured}`}>
            <span className={styles.popularBadge}>Most Popular</span>
            <div className={styles.cardHeader}>
              <p className={styles.planName}>Pro</p>
              <p className={styles.planDesc}>
                For professionals and power users.
              </p>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₹</span>
              <span className={styles.priceAmount}>{proPrice}</span>
              <span className={styles.pricePeriod}>{proNote}</span>
            </div>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <Feature>Unlimited active deadlines</Feature>
              <Feature>AI-driven urgency escalation</Feature>
              <Feature>Voice-based task creation</Feature>
              <Feature>WhatsApp &amp; Telegram nudges</Feature>
              <Feature>Priority calendar sync</Feature>
              <Feature>Priority email support</Feature>
            </ul>
            <CheckoutButton
              planId={proPlanId}
              className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
            >
              Subscribe to Pro
            </CheckoutButton>
          </div>

          {/* Lifetime */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.planName}>Lifetime</p>
              <p className={styles.planDesc}>
                Pay once. Never miss a deadline again.
              </p>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceCurrency}>₹</span>
              <span className={styles.priceAmount}>7,999</span>
              <span className={styles.pricePeriod}>/once</span>
            </div>
            <div className={styles.divider} />
            <ul className={styles.features}>
              <Feature>All Pro features included</Feature>
              <Feature>Early access to new AI features</Feature>
              <Feature>Lifetime product updates</Feature>
              <Feature>Premium support line</Feature>
              <Feature>Founding member badge</Feature>
              <Feature>Input on product roadmap</Feature>
            </ul>
            <CheckoutButton
              planId="plan_lifetime"
              className={`${styles.ctaBtn} ${styles.ctaLifetime}`}
            >
              Get Lifetime Access
            </CheckoutButton>
          </div>
        </div>

        {/* ── Payment methods strip ── */}
        <div className={styles.paymentStrip}>
          <span className={styles.paymentLabel}>Accepted payments</span>
          <div className={styles.paymentBadges}>
            {[
              "UPI",
              "Visa",
              "Mastercard",
              "Rupay",
              "Net Banking",
              "Paytm",
              "PhonePe",
            ].map((m) => (
              <span key={m} className={styles.paymentBadge}>
                {m}
              </span>
            ))}
          </div>
          <span className={styles.poweredBy}>
            Secured by <strong>Razorpay</strong>
          </span>
        </div>

        {/* ── Comparison table ── */}
        <section className={styles.comparisonSection}>
          <h2 className={styles.sectionTitle}>Compare plans</h2>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th className={styles.planColHeader}>Starter</th>
                <th
                  className={`${styles.planColHeader} ${styles.planColHeaderFeatured}`}
                >
                  Pro
                </th>
                <th className={styles.planColHeader}>Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active deadlines</td>
                <td>Up to 15</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Web reminders</td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>AI urgency escalation</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>Voice task creation</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>WhatsApp &amp; Telegram nudges</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>Calendar sync</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>Early AI feature access</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>Roadmap input</td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Dash />
                </td>
                <td>
                  <Check />
                </td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Community</td>
                <td>Priority email</td>
                <td>Premium (dedicated)</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── FAQs ── */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <p className={styles.faqQuestion}>{faq.q}</p>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer note ── */}
        <footer className={styles.footer}>
          <p>
            Need custom team plans?{" "}
            <a
              href="mailto:support@remindkaro.com"
              className={styles.footerLink}
            >
              Contact us
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

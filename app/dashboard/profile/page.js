"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Phone,
  Globe,
  Calendar,
  Crown,
  Clock,
  ArrowRight,
} from "lucide-react";

import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  const isPro = user.plan && user.plan !== "free";
  const planName = user.plan ? user.plan.replace("_", " ") : "free";

  return (
    <div className={styles.container}>
      <p className={styles.pageEyebrow}>Profile & Settings</p>
      <h1 className={styles.pageTitle}>Your Profile</h1>

      <div className={styles.planCard}>
        <div className={styles.planHeader}>
          <h2 className={styles.planName}>
            {isPro ? (
              <Crown size={28} className={styles.cardTitleIcon} />
            ) : (
              <User size={28} className={styles.cardTitleIcon} />
            )}
            {planName} Plan
          </h2>
          <span
            className={`${styles.planBadge} ${!isPro ? styles.planBadgeFree : ""}`}
          >
            {isPro ? "PRO" : "FREE"}
          </span>
        </div>

        <div className={styles.planDetails}>
          {isPro ? (
            <>
              <p>You are enjoying all the premium features of RemindKaro.</p>
              {user.planExpiresAt && (
                <p className={styles.planExpiry}>
                  <Clock size={16} />
                  Plan expires on:{" "}
                  {new Date(user.planExpiresAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </>
          ) : (
            <>
              <p>You are currently on the free plan with limited features.</p>
              <Link href="/pricing" className={styles.upgradeBtn}>
                Upgrade to Pro <ArrowRight size={18} />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <Shield size={24} className={styles.cardTitleIcon} />
            Personal Information
          </h2>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <User size={14} /> Name
            </span>
            <span className={styles.infoValue}>{user.name || "—"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <Mail size={14} /> Email
            </span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <Shield size={14} /> Role
            </span>
            <span className={styles.infoValue}>{user.role || "—"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <Phone size={14} /> WhatsApp Number
            </span>
            <span className={styles.infoValue}>
              {user.whatsappNumber || "—"}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <Globe size={14} /> Timezone
            </span>
            <span className={styles.infoValue}>{user.timezone || "—"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>
              <Calendar size={14} /> Joined
            </span>
            <span className={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DeadlineWidget.module.css';

const URGENCY_THRESHOLDS = {
  critical: {
    color: '#ef4444',
    label: 'Critical',
    glow: 'rgba(239,68,68,0.35)',
  },
  high: { color: '#f97316', label: 'High', glow: 'rgba(249,115,22,0.30)' },
  medium: { color: '#eab308', label: 'Medium', glow: 'rgba(234,179,8,0.28)' },
  low: { color: '#22c55e', label: 'On Track', glow: 'rgba(34,197,94,0.25)' },
};

function getUrgency(minutesLeft) {
  if (minutesLeft < 180) return URGENCY_THRESHOLDS.critical;
  if (minutesLeft < 720) return URGENCY_THRESHOLDS.high;
  if (minutesLeft < 2880) return URGENCY_THRESHOLDS.medium;
  return URGENCY_THRESHOLDS.low;
}

function formatCountdown(minutes) {
  if (minutes < 60) return { value: minutes, unit: 'min' };
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return { value: `${h}:${String(m).padStart(2, '0')}`, unit: 'hrs' };
  }
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  return { value: `${d}d ${h}h`, unit: 'left' };
}

// Animated SVG urgency ring
function UrgencyRing({ progress, color, glow, size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  return (
    <svg width={size} height={size} className={styles.ring} aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={3}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
      />
    </svg>
  );
}

const BASE_DEADLINES = [
  {
    id: 1,
    title: 'DSA Contest',
    category: 'Coding Test',
    baseMinutes: 142,
    icon: null,
  },
  {
    id: 2,
    title: 'Hackathon Pitch',
    category: 'Hackathon',
    baseMinutes: 438,
    icon: null,
  },
  {
    id: 3,
    title: 'SDE Interview',
    category: 'Interview',
    baseMinutes: 1560,
    icon: null,
  },
];

export default function DeadlineWidget() {
  const [mounted, setMounted] = useState(false);
  const [minutes, setMinutes] = useState(
    BASE_DEADLINES.map((d) => d.baseMinutes)
  );
  const [pulse, setPulse] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Tick down 1 min every 4s for visual effect
    intervalRef.current = setInterval(() => {
      setMinutes((prev) => prev.map((m) => Math.max(0, m - 1)));
      setPulse(0); // Pulse first item on each tick
      setTimeout(() => setPulse(null), 600);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!mounted) return <div className={styles.widget} />;

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetLabel}>Upcoming Deadlines</span>
        <span className={styles.liveTag}>
          <span className={styles.liveDot} />
          Live
        </span>
      </div>

      <div className={styles.list}>
        <AnimatePresence>
          {BASE_DEADLINES.map((d, idx) => {
            const minsLeft = minutes[idx];
            const urgency = getUrgency(minsLeft);
            const fmt = formatCountdown(minsLeft);
            // Ring progress: inverse of how much time remains relative to base
            const progress = Math.max(
              0.08,
              1 - minsLeft / (d.baseMinutes * 1.2)
            );

            return (
              <motion.div
                key={d.id}
                className={styles.item}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  boxShadow:
                    pulse === idx
                      ? `0 0 0 2px ${urgency.color}55, 0 8px 32px ${urgency.glow}`
                      : `0 2px 16px rgba(0,0,0,0.18)`,
                }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                style={{ '--urgency-color': urgency.color }}
              >
                <div className={styles.ringWrap}>
                  <UrgencyRing
                    progress={progress}
                    color={urgency.color}
                    glow={urgency.glow}
                  />
                  <span
                    className={styles.urgencyDot}
                    style={{
                      background: urgency.color,
                      boxShadow: `0 0 6px ${urgency.glow}`,
                    }}
                  />
                </div>

                <div className={styles.info}>
                  <div className={styles.titleRow}>
                    <span className={styles.taskTitle}>{d.title}</span>
                    <span
                      className={styles.urgencyBadge}
                      style={{
                        color: urgency.color,
                        background: `${urgency.color}18`,
                        borderColor: `${urgency.color}40`,
                      }}
                    >
                      {urgency.label}
                    </span>
                  </div>
                  <span className={styles.category}>{d.category}</span>
                </div>

                <div className={styles.countdown}>
                  <motion.span
                    className={styles.countVal}
                    key={fmt.value}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: urgency.color }}
                  >
                    {fmt.value}
                  </motion.span>
                  <span className={styles.countUnit}>{fmt.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={styles.widgetFooter}>
        <span className={styles.footerText}>3 of 12 deadlines upcoming</span>
        <div className={styles.footerDots}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${styles.footerDot} ${i === 0 ? styles.footerDotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

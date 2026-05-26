'use client';

import { useState, useEffect } from 'react';
import styles from './Clock.module.css';

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (num) => String(num).padStart(2, '0');
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  const dateLabel = time
    .toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase();

  if (!mounted) {
    return <div className={styles.minimalClockSkeleton} />;
  }

  return (
    <div className={styles.minimalClockContainer}>
      <div className={styles.dateLabelRow}>
        <span className={styles.accentDot} />
        <span className={styles.dateText}>{dateLabel}</span>
      </div>
      <div className={styles.timeTextRow}>
        <span className={styles.timeDigit}>{hours}</span>
        <span className={styles.timeSeparator}>:</span>
        <span className={styles.timeDigit}>{minutes}</span>
        <span className={styles.timeSeparator}>:</span>
        <span className={styles.timeDigitSec}>{seconds}</span>
      </div>
      <div className={styles.timeSubtitle}>REALTIME SYSTEM PING</div>
    </div>
  );
}

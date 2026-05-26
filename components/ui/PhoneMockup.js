'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Battery,
  Wifi,
  Signal,
  Phone,
  Mic,
  Bell,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import styles from './PhoneMockup.module.css';

const NOTIFICATIONS = [
  {
    id: 'google-oa',
    type: 'phone-call',
    appName: 'Priority Alert',
    icon: <Phone size={11} style={{ color: '#fff' }} />,
    timeText: 'Now',
    title: 'Google Coding Test',
    desc: 'Critical deadline in 10 min · Priority ringtone &amp; Telegram active.',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.4)',
    actionText: 'Priority Calling · Telegram Active',
    vibrate: true,
    islandText: 'Alert',
  },
  {
    id: 'voice-scheduler',
    type: 'voice-command',
    appName: 'Voice Scheduler',
    icon: <Mic size={11} style={{ color: '#fff' }} />,
    timeText: '1s ago',
    title: 'DSA Assignment',
    desc: 'Voice command parsed · Due Friday at 5 PM successfully added.',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.35)',
    actionText: 'Voice-to-Task scheduled',
    vibrate: false,
    islandText: 'Task',
  },
  {
    id: 'squad-standup',
    type: 'squad-update',
    appName: 'Squad Sync',
    icon: <MessageSquare size={11} style={{ color: '#fff' }} />,
    timeText: '4m ago',
    title: 'HackFest Milestone',
    desc: 'Pitch due in 1 hour · Slack alerts sent to Karan, Priya &amp; 2 more.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    actionText: 'Team deadline synchronized',
    vibrate: false,
    islandText: 'Sync',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date) {
  let h = date.getHours();
  const m = pad(date.getMinutes());
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return { display: `${h}:${m}`, ampm };
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Dynamic Island ───────────────────────────────────────────────────────────
function DynamicIsland({ notification, isExpanded }) {
  return (
    <div className={styles.dynamicIslandWrapper}>
      <motion.div
        className={styles.dynamicIsland}
        layout
        animate={
          isExpanded
            ? { width: 110, height: 30, borderRadius: 15 }
            : { width: 100, height: 28, borderRadius: 20 }
        }
        transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.85 }}
        style={{
          boxShadow: isExpanded
            ? `0 4px 22px ${notification.glow}, 0 2px 10px rgba(0,0,0,0.5)`
            : '0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        {/* Collapsed dots */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              key="dots"
              className={styles.islandDots}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.sensorDot} />
              <div className={styles.cameraDot} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded row state (Bell + one-word category) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="expanded"
              className={styles.islandBellContent}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.05, duration: 0.2 }}
            >
              <Bell
                size={12}
                className={styles.islandBellIcon}
                style={{ color: notification.color }}
                fill={notification.color}
              />
              <span
                className={styles.islandBellText}
                style={{ color: notification.color }}
              >
                {notification.islandText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Bell Pop-up ──────────────────────────────────────────────────────────────
function BellPopup({ color, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.bellPopup}
          initial={{ opacity: 0, scale: 0.5, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          style={{ '--bell-color': color }}
        >
          <Bell size={13} fill={color} color={color} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhoneMockup() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [isBuzzing, setIsBuzzing] = useState(false);
  const [bellVisible, setBellVisible] = useState(false);
  const timersRef = useRef([]);

  // Mount + live clock
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const clockInterval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Scrubber
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % NOTIFICATIONS.length);
          return 0;
        }
        return prev + 1.25;
      });
    }, 60);
    return () => clearInterval(id);
  }, [isPlaying]);

  // On slide change: trigger DI expand, bell, optional buzz
  useEffect(() => {
    if (!mounted) return;
    // clear previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Bell pop-up
    setBellVisible(true);
    timersRef.current.push(setTimeout(() => setBellVisible(false), 1800));

    // DI expand
    setIslandExpanded(true);
    timersRef.current.push(setTimeout(() => setIslandExpanded(false), 2800));

    // Haptic buzz (vibrate notifications only)
    if (NOTIFICATIONS[currentSlide].vibrate) {
      setIsBuzzing(true);
      timersRef.current.push(setTimeout(() => setIsBuzzing(false), 420));
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, [currentSlide, mounted]);

  if (!mounted || !now) return <div style={{ width: 300, height: 630 }} />;

  const activeTask = NOTIFICATIONS[currentSlide];
  const { display: timeDisplay, ampm } = formatTime(now);
  const dateDisplay = formatDate(now);

  const handleSelect = (idx) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  return (
    <motion.div
      className={styles.screenWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.phoneScene}>
        <div
          className={`${styles.phoneFrame} ${isBuzzing ? styles.phoneVibrate : ''}`}
        >
          <div className={styles.glassReflection} />

          {/* Physical buttons */}
          <div className={styles.muteSwitch} />
          <div className={styles.volUp} />
          <div className={styles.volDown} />
          <div className={styles.powerBtn} />

          {/* Bezel-inset Screen */}
          <div className={styles.innerScreen}>
            {/* Status Bar */}
            <div className={styles.statusBar}>
              <span className={styles.statusTime}>
                {timeDisplay}
                <span className={styles.statusAmpm}> {ampm}</span>
              </span>
              <div className={styles.statusIcons}>
                <Signal size={12} strokeWidth={2.5} />
                <Wifi size={12} strokeWidth={2.5} />
                <Battery size={17} strokeWidth={2.5} />
              </div>
            </div>

            {/* Dynamic Island */}
            <DynamicIsland
              notification={activeTask}
              isExpanded={islandExpanded}
            />

            {/* Lock Screen */}
            <div
              className={styles.screenContent}
              style={{ '--active-color': activeTask.color }}
            >
              {/* Time */}
              <div className={styles.lockTimeGroup}>
                <span className={styles.lockDate}>{dateDisplay}</span>
                <h2 className={styles.lockTime}>
                  {timeDisplay}
                  <span className={styles.lockAmpm}>{ampm}</span>
                </h2>
              </div>

              {/* Notification Zone */}
              <div className={styles.notificationZone}>
                {/* Bell pop-up anchor */}
                <div className={styles.bellAnchor}>
                  <BellPopup color={activeTask.color} visible={bellVisible} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTask.id}
                    initial={{ opacity: 0, y: -16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: 12,
                      scale: 0.96,
                      filter: 'blur(2px)',
                    }}
                    transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                    className={`${styles.notificationBanner} ${isBuzzing ? styles.bannerVibrate : ''}`}
                    style={{
                      borderColor: activeTask.color,
                      boxShadow: `0 16px 36px rgba(0,0,0,0.55), 0 0 18px ${activeTask.glow}`,
                    }}
                  >
                    {/* Banner header */}
                    <div className={styles.bannerHeader}>
                      <div className={styles.bannerAppInfo}>
                        <div
                          className={styles.appIconContainer}
                          style={{ backgroundColor: activeTask.color }}
                        >
                          {activeTask.icon}
                        </div>
                        <span
                          className={styles.appName}
                          style={{ color: activeTask.color }}
                        >
                          {activeTask.appName}
                        </span>
                      </div>
                      <span className={styles.bannerTime}>
                        {activeTask.timeText}
                      </span>
                    </div>

                    {/* Banner body */}
                    <div className={styles.bannerContent}>
                      <h4 className={styles.bannerTitle}>{activeTask.title}</h4>
                      <p
                        className={styles.bannerDesc}
                        dangerouslySetInnerHTML={{ __html: activeTask.desc }}
                      />
                    </div>

                    {/* Ripple for phone-call type */}
                    {activeTask.type === 'phone-call' && (
                      <div className={styles.rippleWrap}>
                        <span
                          className={styles.ripple}
                          style={{ borderColor: activeTask.color }}
                        />
                        <span
                          className={styles.ripple}
                          style={{
                            borderColor: activeTask.color,
                            animationDelay: '0.85s',
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action label */}
              <div className={styles.actionLabel}>
                <span
                  className={styles.actionDot}
                  style={{
                    backgroundColor: activeTask.color,
                    boxShadow: `0 0 8px ${activeTask.color}`,
                  }}
                />
                <span className={styles.actionText}>
                  {activeTask.actionText}
                </span>
              </div>
            </div>

            {/* Progress scrubber */}
            <div className={styles.scrubberContainer}>
              <div
                className={styles.scrubberProgress}
                style={{
                  width: `${progress}%`,
                  backgroundColor: activeTask.color,
                }}
              />
            </div>

            {/* Bottom controls */}
            <div className={styles.bottomControls}>
              <div className={styles.mediaControls}>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={13} />
                  ) : (
                    <Play size={13} fill="currentColor" />
                  )}
                </button>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={() => {
                    setCurrentSlide(0);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  aria-label="Restart"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              <div className={styles.pagDots}>
                {NOTIFICATIONS.map((n, i) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`${styles.pagDot} ${currentSlide === i ? styles.pagDotActive : ''}`}
                    onClick={() => handleSelect(i)}
                    style={{ '--dot-color': n.color }}
                    aria-label={`Notification ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.homeIndicator} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

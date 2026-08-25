"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './herobanner.module.scss';
import Button from '@/components/button';
import SideRays from '@/components/sideRays';

const SparkleIcon = '/assets/icons/sparkle.svg';
const RightArrow = '/assets/icons/right.svg';

const liveMarketPills = [
  { pair: 'XAU/USD', price: '2,934.50', change: '+1.42%', isUp: true, signal: 'Strong Buy', score: 96 },
  { pair: 'EUR/USD', price: '1.0842', change: '+0.35%', isUp: true, signal: 'Bullish', score: 88 },
  { pair: 'BTC/USDT', price: '96,420', change: '+3.18%', isUp: true, signal: 'Strong Buy', score: 98 },
  { pair: 'GBP/JPY', price: '194.60', change: '+0.82%', isUp: true, signal: 'Trend Up', score: 85 },
  { pair: 'NAS100', price: '21,450', change: '+1.15%', isUp: true, signal: 'Breakout', score: 92 },
  { pair: 'ETH/USDT', price: '2,780', change: '+2.40%', isUp: true, signal: 'Strong Buy', score: 94 },
  { pair: 'USD/JPY', price: '154.20', change: '-0.22%', isUp: false, signal: 'Pullback', score: 78 }
];

const featurePillars = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    badge: '96% CONVICTION',
    title: 'AI Pattern Analysis',
    desc: 'Real-time multi-timeframe candle intelligence and instantaneous breakout level detection across 1,000+ pairs.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    badge: '<12MS SPEED',
    title: 'Smart Trade Signals',
    desc: 'Machine-learning powered entries, optimized Stop-Loss & Take-Profit targets, backed by institutional quantitative models.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    badge: '1:3.4 AVG R:R',
    title: 'Institutional Risk Engine',
    desc: 'Dynamic position sizing and portfolio preservation algorithms to maximize risk-adjusted Alpha in any volatility.'
  }
];

export default function Herobanner() {
  const router = useRouter();
  const [activePillIndex, setActivePillIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePillIndex((prev) => (prev + 1) % liveMarketPills.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToCockpit = () => {
    const cockpitEl = document.querySelector('section[aria-label*="Cockpit"]') || document.querySelector('section');
    if (cockpitEl) {
      cockpitEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      authNavigate(router, '/trade-snap');
    }
  };

  return (
    <section className={styles.herobanner}>
      {/* Dynamic Atmospheric Light & Rays Shader */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <SideRays
        rayColor1="#C1902E"
        rayColor2="#F4D17A"
        origin="top-left"
        spread={3.2}
        tilt={42}
        blend={0.55}
        speed={2.2}
        intensity={2.1}
      />

      <div className="container">
        <div className={styles.heroWrapper}>
          {/* 1. Release / AI Status Pill */}
          <motion.div
            className={styles.topBadgeRow}
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badge} onClick={() => authNavigate(router, '/trade-snap')}>
              <span className={styles.pulseDot}>
                <span className={styles.pulseRing} />
              </span>
              <span className={styles.badgeTag}>CHRONOSX 3.0</span>
              <span className={styles.badgeDivider}>•</span>
              <span className={styles.badgeText}>Next-Gen AI Forex & Crypto Intelligence</span>
              <span className={styles.badgeArrow}>→</span>
            </div>
          </motion.div>

          {/* 2. Main High-Impact Typography Headline */}
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Trade Smarter With <br />
            <span className={styles.goldGradient}>AI That Never Sleeps</span>
          </motion.h1>

          {/* 3. Value-Packed Sub-headline */}
          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            Get institutional-grade real-time AI trading signals, instant chart analysis, and automated conviction scoring engineered for the world’s most demanding traders.
          </motion.p>

          {/* 4. Dual Call To Actions & Interactive Trigger */}
          <motion.div
            className={styles.actionsGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              text="GET STARTED FREE"
              icon={RightArrow}
              onClick={() => authNavigate(router, '/dashboard')}
            />

            <motion.button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleScrollToCockpit}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.playIconCircle}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#040300">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              </span>
              <span>EXPLORE LIVE TERMINAL</span>
            </motion.button>
          </motion.div>

          {/* 5. Trust & Social Proof Row */}
          <motion.div
            className={styles.socialProofRow}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.avatarStack}>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #FFE693 0%, #C1902E 100%)' }}>
                <span>JD</span>
              </div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}>
                <span>MK</span>
              </div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
                <span>AL</span>
              </div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}>
                <span>SR</span>
              </div>
              <div className={`${styles.avatarCircle} ${styles.avatarCount}`}>
                <span>+25K</span>
              </div>
            </div>

            <div className={styles.proofMeta}>
              <div className={styles.starsRow}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.ratingText}>4.9/5 Rating</span>
              </div>
              <span className={styles.proofSub}>Trusted by 25,000+ traders in 140+ countries</span>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.systemStatusBlock}>
              <div className={styles.liveBeaconRow}>
                <span className={styles.greenDot} />
                <span className={styles.statusLabel}>99.98% Model Uptime</span>
              </div>
              <span className={styles.latencySub}>⚡ &lt;12ms Sub-Second Inference</span>
            </div>
          </motion.div>

          {/* 6. Live Market Telemetry Bar */}
          <motion.div
            className={styles.liveTelemetryBar}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.telemetryHeader}>
              <div className={styles.telemetryTag}>
                <span className={styles.beaconRing} />
                <span>LIVE TICKER FEED</span>
              </div>
              <span className={styles.telemetrySub}>1,080 FOREX &amp; CRYPTO PAIRS</span>
            </div>

            <div className={styles.tickerScrollTrack}>
              {liveMarketPills.map((item, idx) => {
                const isActive = idx === activePillIndex;
                return (
                  <motion.div
                    key={item.pair}
                    className={`${styles.tickerItem} ${isActive ? styles.tickerItemActive : ''}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={() => setActivePillIndex(idx)}
                  >
                    <span className={styles.tickerPair}>{item.pair}</span>
                    <span className={styles.tickerPrice}>${item.price}</span>
                    <span className={`${styles.tickerChange} ${item.isUp ? styles.changeUp : styles.changeDown}`}>
                      {item.change}
                    </span>
                    <span className={styles.signalBadge}>
                      {item.signal}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* 7. Interactive 3-Pillar Feature Cards Grid */}
          <motion.div
            className={styles.featurePillarsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {featurePillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                className={styles.pillarCard}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className={styles.pillarTop}>
                  <div className={styles.pillarIconBox}>
                    {pillar.icon}
                  </div>
                  <span className={styles.pillarBadge}>{pillar.badge}</span>
                </div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
                <div className={styles.pillarShine} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './herobanner.module.scss';
import Button from '@/components/button';
import SideRays from '@/components/sideRays';
import AiCockpit from '../aiCockpit';
import CountUp from '@/components/countUp';

const RightArrow = '/assets/icons/right.svg';

const metrics = [
  { target: 50, suffix: '+', decimals: 0, label: 'Global Market Pairs', sub: 'Forex, Crypto, Indices & Metals' },
  { target: 500, prefix: '< ', suffix: 'ms', decimals: 0, label: 'AI Processing Speed', sub: 'Sub-second neural pattern analysis' },
  { target: 6, suffix: ' Timeframes', decimals: 0, label: 'Multi-TF Confluence', sub: 'From 1-minute scalping to daily swings' },
  { target: 99.9, suffix: '%', decimals: 1, label: 'Platform Availability', sub: '24/7 continuous market telemetry' }
];

export default function Herobanner() {
  const router = useRouter();

  const handleScrollToScanner = () => {
    const sectionEl = document.querySelector('section[aria-label*="Breakout"]') || document.querySelector('section[aria-label*="Capabilities"]');
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      authNavigate(router, '/ai-strategy/live');
    }
  };

  return (
    <section className={styles.herobanner}>
      {/* High-Tech Ambient Atmosphere & Glow Layers */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.radialVignette} aria-hidden="true" />

      {/* SideRays for Desktop/Laptop View */}
      <div className={styles.sideRaysWrapper}>
        <SideRays
          rayColor1="#C1902E"
          rayColor2="#F4D17A"
          origin="top-left"
          spread={3.4}
          tilt={40}
          blend={0.5}
          speed={2.0}
          intensity={2.2}
        />
      </div>

      {/* Modern High-Tech Ambient Atmosphere & Animations for Mobile */}
      <div className={styles.mobileTechAtmosphere} aria-hidden="true">
        <div className={styles.mobileQuantumHalo} />
        <div className={styles.mobileLaserScan} />
        <div className={styles.mobileConstellation}>
          <span className={`${styles.particleDot} ${styles.pDot1}`} />
          <span className={`${styles.particleDot} ${styles.pDot2}`} />
          <span className={`${styles.particleDot} ${styles.pDot3}`} />
          <span className={`${styles.particleDot} ${styles.pDot4}`} />
          <span className={`${styles.particleDot} ${styles.pDot5}`} />
        </div>
      </div>

      <div className="container">
        <div className={styles.heroWrapper}>

          {/* 1. Futuristic Pill Badge */}
          <motion.div
            className={styles.topBadgeRow}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badge} onClick={() => authNavigate(router, '/trade-snap')}>
              <span className={styles.pulseDot}>
                <span className={styles.pulseRing} />
              </span>
              <span className={styles.badgeTag}>CHRONOSX</span>
              <span className={styles.badgeDivider}>•</span>
              <span className={styles.badgeText}>Next-Gen AI Algorithmic Trading Terminal</span>
              
            </div>
          </motion.div>

          {/* 2. Bold High-Impact Headline */}
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Trade Smarter With <br />
            <span className={styles.goldGradient}>AI That Never Sleeps</span>
          </motion.h1>

          {/* 3. Subheadline */}
          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Real-time institutional-grade AI signals, multi-timeframe pattern recognition, and sniper trade setups engineered for elite Forex &amp; Crypto traders.
          </motion.p>

          {/* 4. Action Buttons */}
          <motion.div
            className={styles.actionsGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              text="GET STARTED"
              icon={RightArrow}
              onClick={() => authNavigate(router, '/dashboard')}
            />
          </motion.div>

          {/* 5. Social Proof Strip */}
          <motion.div
            className={styles.socialProofBar}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.avatarGroup}>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #FFE693 0%, #C1902E 100%)' }}>JD</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}>MK</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>AL</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}>SR</div>
              <div className={`${styles.avatarCircle} ${styles.avatarCount}`}>+25K</div>
            </div>

            <div className={styles.proofText}>
              <div className={styles.starCluster}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.scoreText}>4.9/5 Rating</span>
              </div>
              <span className={styles.verifiedSub}>Verified by 25,000+ Institutional &amp; Prop Traders</span>
            </div>

            <div className={styles.proofDivider} />

            <div className={styles.proofSpeed}>
              <div className={styles.speedHeader}>
                <span className={styles.speedDot} />
                <span className={styles.speedLabel}>Neural Engine Uptime: 99.98%</span>
              </div>
              <span className={styles.speedSub}>⚡ &lt;12ms Sub-second Latency</span>
            </div>
          </motion.div>

          {/* 6. SHOWSTOPPER: Live Real-Time Predictive AI Cockpit Terminal */}
          <motion.div
            className={styles.heroCockpitWrapper}
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <AiCockpit isHero={true} showHeader={false} />
          </motion.div>

          {/* 7. Key Institutional Metrics Strip */}
          <motion.div
            className={styles.metricsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {metrics.map((item) => (
              <div key={item.label} className={styles.metricItem}>
                <div className={styles.metricValue}>
                  <CountUp
                    to={item.target}
                    prefix={item.prefix || ''}
                    suffix={item.suffix || ''}
                    decimals={item.decimals || 0}
                    duration={2.0}
                  />
                </div>
                <div className={styles.metricLabel}>{item.label}</div>
                <div className={styles.metricSub}>{item.sub}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

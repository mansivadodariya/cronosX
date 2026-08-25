"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './teamUp.module.scss';
import Textbutton from '@/components/textbutton';

const pillars = [
  {
    icon: '/assets/icons/hex-chart.svg',
    title: 'Tier-1 Liquidity Pool',
    stat: '< 0.1 PIP SPREADS',
    desc: 'Access deep institutional order books from Tier-1 liquidity providers with zero spread markups.'
  },
  {
    icon: '/assets/icons/hex-shield.svg',
    title: 'Segregated Security',
    stat: 'FCA · ASIC · CySEC',
    desc: 'Our connected partners are fully regulated with segregated client capital and global compliance.'
  },
  {
    icon: '/assets/icons/hex-speed.svg',
    title: 'Ultra-Low Latency',
    stat: '12MS EXECUTION',
    desc: 'High-speed fiber infrastructure co-located with London (LD4) and New York (NY4) exchange servers.'
  },
  {
    icon: '/assets/icons/hex-users.svg',
    title: 'Institutional Scale',
    stat: '$50B+ ROUTED',
    desc: 'Built on institutional trust. Backed by world-class platforms trusted by active traders worldwide.'
  }
];

export default function TeamUp() {
  return (
    <section className={styles.teamUp} aria-label="Supported Brokers and Platforms">
      <div className={styles.topBorderSvgWrapper}>
        <svg
          viewBox="0 0 1440 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldBaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C1902E" stopOpacity="0.1" />
              <stop offset="20%" stopColor="#C1902E" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F4D17A" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#C1902E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C1902E" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="goldBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C1902E" stopOpacity="0" />
              <stop offset="30%" stopColor="#C1902E" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#F4D17A" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            <filter id="goldGlowFilter" x="-20%" y="-300%" width="140%" height="700%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base Solid Gold 1px Border Line */}
          <path
            d="M 0 1 H 220 L 250 31 H 1190 L 1220 1 H 1440"
            stroke="url(#goldBaseGradient)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />

          {/* Animated Traveling Light Beam along the exact border path */}
          <motion.path
            d="M 0 1 H 220 L 250 31 H 1190 L 1220 1 H 1440"
            stroke="url(#goldBeamGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            fill="none"
            filter="url(#goldGlowFilter)"
            initial={{ pathLength: 0.22, pathOffset: -0.22 }}
            animate={{ pathOffset: [-0.22, 1.0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
      </div>

      <div className="container">
        <div className={styles.gridWrapper}>

          {/* Left Column: Clean, Elegant Typography */}
          <motion.div
            className={styles.leftContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badgeWrapper}>
              <Textbutton text="WE TEAM UP" />
            </div>

            <h2 className={styles.sectionHeading}>
              Direct Market Access to <br />
              <span>World-Class Liquidity</span>
            </h2>

            <div className={styles.titleDivider}></div>

            <p className={styles.desc}>
              Seamless connections to top institutional liquidity providers, futures exchanges, and charting platforms ensuring <span>speed, security & execution reliability</span> in every trade.
            </p>
          </motion.div>


          {/* Right Column: 2x2 Bento Pillar Grid & Trust Banner */}
          <motion.div
            className={styles.rightContent}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.bentoGrid}>
              {pillars.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={styles.bentoCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className={styles.bentoCardTop}>
                    <div className={styles.iconBox}>
                      <img src={item.icon} alt={item.title} />
                    </div>
                    <span className={styles.statPill}>{item.stat}</span>
                  </div>
                  <h3 className={styles.bentoTitle}>{item.title}</h3>
                  <p className={styles.bentoDesc}>{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Institutional Trust Banner */}
            <motion.div 
              className={styles.trustBanner}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.bannerInfo}>
                <span className={styles.verifiedTag}>INSTITUTIONAL SECURITY VAULT</span>
                <h4>NON-CUSTODIAL & SEGREGATED</h4>
                <p>You maintain 100% control of your trading funds. ChronosX never holds client capital.</p>
              </div>
              <div className={styles.shieldVisual}>
                <img src="/assets/images/shield-network.svg" alt="Security Shield" />
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

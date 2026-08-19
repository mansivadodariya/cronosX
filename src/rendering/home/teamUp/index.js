"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './teamUp.module.scss';
import Textbutton from '@/components/textbutton';

const partnersData = [
  {
    icon: '/assets/icons/hex-chart.svg',
    title: 'World-Class Liquidity',
    desc: 'Access deep liquidity from top-tier providers for tighter spreads and better execution.'
  },
  {
    icon: '/assets/icons/hex-shield.svg',
    title: 'Secure & Compliant',
    desc: 'Our partners are fully regulated and comply with global standards.'
  },
  {
    icon: '/assets/icons/hex-speed.svg',
    title: 'Lightning Fast',
    desc: 'Ultra-low latency infrastructure for real-time market access.'
  },
  {
    icon: '/assets/icons/hex-users.svg',
    title: 'Trusted by Millions',
    desc: 'Built on trust. Backed by platforms used by millions worldwide.'
  }
];

export default function TeamUp() {
  return (
    <div className={styles.teamUp}>
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
      <div className='container'>
        <div className={styles.gridWrapper}>
          {/* Left Column: Heading, description and world network graphic */}
          <motion.div
            className={styles.leftContent}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className={styles.badgeWrapper}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Textbutton text="WE TEAM UP" />
            </motion.div>

            <h2>
              POWERED BY <br />
              INDUSTRY-LEADING <br />
              <span>BROKERS & PLATFORMS</span>
            </h2>

            <div className={styles.titleDivider}></div>

            <p className={styles.desc}>
              Seamless connections to top liquidity providers and platforms
              ensuring <span>speed, security & reliability</span> in every trade.
            </p>


          </motion.div>

          {/* Right Column: Feature list card with bottom strong partnerships banner */}
          <motion.div
            className={styles.rightCard}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.cardHeader}>
              WHY WE PARTNER WITH <span>THE BEST?</span>
            </div>

            <div className={styles.partnersList}>
              {partnersData.map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.partnerItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.iconWrapper}>
                    <img src={item.icon} alt={item.title} />
                  </div>
                  <div className={styles.itemText}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom banner inside card */}
            <motion.div
              className={styles.bottomBanner}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              <div className={styles.bannerText}>
                <h4>STRONG PARTNERSHIPS.</h4>
                <h5>STRONGER TRADES.</h5>
                <p>Together, we build a smarter trading future.</p>
              </div>
              <div className={styles.bannerShield}>
                <img src="/assets/images/shield-network.svg" alt="Shield Network" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './teamUp.module.scss';
import SectionHeader from '@/components/sectionHeader';

const pillars = [
  {
    icon: '/assets/icons/hex-chart.svg?v=2',
    title: 'Tier-1 Liquidity Pool',
    stat: '< 0.1 PIP SPREADS',
    desc: 'Access deep institutional order books from Tier-1 liquidity providers with zero spread markups.'
  },
  {
    icon: '/assets/icons/hex-shield.svg?v=2',
    title: 'Segregated Security',
    stat: 'FCA · ASIC · CySEC',
    desc: 'Our connected partners are fully regulated with segregated client capital and global compliance.'
  },
  {
    icon: '/assets/icons/hex-speed.svg?v=2',
    title: 'Ultra-Low Latency',
    stat: '12MS EXECUTION',
    desc: 'High-speed fiber infrastructure co-located with London (LD4) and New York (NY4) exchange servers.'
  },
  {
    icon: '/assets/icons/hex-users.svg?v=2',
    title: 'Institutional Scale',
    stat: '$50B+ ROUTED',
    desc: 'Built on institutional trust. Backed by world-class platforms trusted by active traders worldwide.'
  }
];

export default function TeamUp() {
  return (
    <section className={styles.teamUp} aria-label="Supported Brokers and Platforms">

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
            <SectionHeader
              align="left"
              badge="WE TEAM UP"
              title1="Direct Market Access to"
              title2="World-Class Liquidity"
              description="Seamless connections to top institutional liquidity providers, futures exchanges, and charting platforms ensuring speed, security & execution reliability in every trade."
            />
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
                <img src="/assets/images/shield-network.svg?v=2" alt="Security Shield" />
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

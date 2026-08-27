"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './readytoPut.module.scss';

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function ReadytoPut() {
  const router = useRouter();

  return (
    <div className={styles.readytoPut}>
      <div className='container'>
        <motion.div 
          className={styles.bannerCard}
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top ambient glow shimmer */}
          <div className={styles.cardShimmerTop} />

          {/* Background candlestick & wave ambient graphic */}
          <motion.div 
            className={styles.bgGraphic}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img 
              src="/assets/images/chart-wave-right.svg" 
              alt="Trading Wave Chart"
              animate={{
                y: [0, -12, 0],
                opacity: [0.65, 0.95, 0.65]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <div className={styles.content}>
            <div className={styles.eyebrowBadge}>
              <span className={styles.pulseDot} />
              <span>INSTANT INSTITUTIONAL ACCESS</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Ready to Put <span className={styles.goldText}>AI</span> in <br />
              <span className={styles.goldGradient}>Your Trading Desk?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Experience institutional-grade AI chart intelligence, pattern detection, and quantitative strategies in just a few minutes.
            </motion.p>

            <motion.div 
              className={styles.btnWrapper}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <button 
                type="button"
                className={styles.ctaGoldBtn}
                onClick={() => authNavigate(router, '/dashboard')}
              >
                <span>GET STARTED NOW</span>
                <ArrowRightIcon />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

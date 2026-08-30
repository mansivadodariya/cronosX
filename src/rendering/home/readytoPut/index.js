"use client";
import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    glowOpacity.set(0);
  };

  const pointerGlowBg = useMotionTemplate`radial-gradient(550px circle at ${mouseX}px ${mouseY}px, rgba(24, 201, 139, 0.24) 0%, rgba(24, 201, 139, 0.08) 45%, transparent 80%)`;

  return (
    <section className={styles.readytoPutSection}>
      <motion.div 
        className={styles.bannerCardFull}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top ambient glow shimmer line */}
        <div className={styles.cardShimmerTop} />

        {/* Dynamic Pointer Following Radial Glow */}
        <motion.div 
          className={styles.pointerGlow}
          style={{
            opacity: glowOpacity,
            background: pointerGlowBg
          }}
        />

        <div className="container">
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
        </div>
      </motion.div>
    </section>
  );
}

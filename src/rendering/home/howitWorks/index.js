"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './howitWorks.module.scss';
import Textbutton from '@/components/textbutton';

const steps = [
  {
    step: '01',
    icon: '/assets/icons/user.svg',
    title: 'Create Your Account',
    desc: 'Sign up and create your AI Trading Signal account.'
  },
  {
    step: '02',
    icon: '/assets/icons/link.svg',
    title: 'Link AI Trading Signal Account',
    desc: 'Connect your trading account and access AI-powered insights.'
  },
  {
    step: '03',
    icon: '/assets/icons/brain.svg',
    title: 'Ask the AI',
    desc: 'Ask AI about markets, setups, signals, and strategies.'
  },
  {
    step: '04',
    icon: '/assets/icons/chart-growth.svg',
    title: 'Trade & Replenish',
    desc: 'Use AI insights to make smarter trading decisions and manage your trades.'
  }
];

export default function HowitWorks() {
  return (
    <div className={styles.howitWorks}>
      <div className={styles.bgLeftWave}></div>
      <div className={styles.bgRightWave}></div>
      <div className={styles.bgFloorGrid}></div>

      <div className='container'>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            <Textbutton text="HOW IT WORKS" />
          </motion.div>

          <h2>
            ONE PLATFORM. EVERY <br />
            <span>TRADING TOOL</span> YOU NEED
          </h2>
        </motion.div>

        <div className={styles.stepsContainer}>
          {steps.map((item, index) => (
            <React.Fragment key={index}>
              <motion.div 
                className={styles.cardWrapper}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className={styles.card}>
                  <div className={styles.numberBadge}>{item.step}</div>
                  <div className={styles.iconBox}>
                    <img src={item.icon} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                
                {/* 3D Glowing Futuristic Pedestal */}
                <div className={styles.pedestal}>
                  <div className={styles.pedestalLight}></div>
                  <div className={styles.pedestalRingOuter}></div>
                  <div className={styles.pedestalRingInner}></div>
                  <div className={styles.pedestalGlow}></div>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div 
                  className={styles.arrowDivider}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                >
                  <img src="/assets/icons/step-arrow.svg" alt="arrow" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

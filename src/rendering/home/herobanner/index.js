"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './herobanner.module.scss';
import Button from '../../../components/button';
import RightIcon from '@/icons/rightIcon';
import SideRays from '@/components/sideRays';

const SparkleIcon = '/assets/icons/sparkle.svg';
const RightArrow = '/assets/icons/right.svg';
const UsersIcon = '/assets/icons/users.svg';
const Video = '/assets/video/video.mp4';

const gridData = [
  {
    icon: '/assets/icons/analysis.svg',
    title: 'AI Market Analysis',
    desc: 'Real-time AI-powered market insights and analysis.'
  },
  {
    icon: '/assets/icons/signals.svg',
    title: 'Smart Trade Signals',
    desc: 'Get intelligent AI-generated signals and trading opportunities.'
  },
  {
    icon: '/assets/icons/risk.svg',
    title: 'Risk Management',
    desc: 'Make smarter decisions with intelligent risk management tools.'
  }
];

export default function Herobanner() {
  const router = useRouter();

  return (
    <div className={styles.herobanner}>
      <video
        className={styles.bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/assets/video/video.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoOverlay}></div>
      <SideRays
        rayColor1="#c1902e"
        rayColor2="#f4d17a"
        origin="top-left"
        spread={3}
        tilt={43}
        blend={0.52}
        speed={2.5}
        intensity={2}
      />
      <motion.div
        className={styles.contentstyle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className='container'>
          <motion.div
            className={styles.badge}
            variants={{
              hidden: { opacity: 0, y: -20, scale: 0.9 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
            }}
          >
            <img src={SparkleIcon} alt="Sparkle" />
            <span>AI FOREX INTELLIGENCE</span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
              }
            }}
          >
            TRADE SMARTER WITH <br />
            <span>AI THAT NEVER SLEEPS</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
              }
            }}
          >
            Get real-time AI trading signals, instant insights, and market<br />
            recommendations from AI-powered tools designed<br />
            for smarter trading.
          </motion.p>

          <motion.div
            className={styles.actionRow}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }
              }
            }}
          >
            <Button
              text="GET STARTED"
              icon={RightArrow}
              onClick={() => authNavigate(router, '/dashboard')}
            />
            <div className={styles.trusted}>
              <img src={UsersIcon} alt="Users" />
              <span>Trusted by 20K+ Traders</span>
            </div>
          </motion.div>
        </div>
      </motion.div>


    </div >
  );
}

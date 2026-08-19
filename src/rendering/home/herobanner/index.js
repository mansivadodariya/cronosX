"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './herobanner.module.scss';
import Button from '../../../components/button';
import RightIcon from '@/icons/rightIcon';

const SparkleIcon = '/assets/icons/sparkle.svg';
const RightArrow = '/assets/icons/right.svg';
const UsersIcon = '/assets/icons/users.svg';

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
      <div className='container'>
        <motion.div 
          className={styles.contentstyle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
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
        </motion.div>

        <div className={styles.grid}>
          {gridData.map((item, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: 0.3 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              onClick={() => authNavigate(router, '/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.iconWrapper}>
                <img src={item.icon} alt={item.title} />
              </div>
              <div className={styles.cardInfo}>
                <h3>{item.title}</h3>
                <div className={styles.line}></div>
                <p>{item.desc}</p>
              </div>
              <button className={styles.arrowBtn} onClick={(e) => { e.stopPropagation(); authNavigate(router, '/dashboard'); }}>
                <RightIcon />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

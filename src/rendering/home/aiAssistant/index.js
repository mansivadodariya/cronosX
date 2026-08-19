"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './aiAssistant.module.scss';
import Textbutton from '@/components/textbutton';

const AiAssistantImg = '/assets/images/ai-assistant.png';

const features = [
  {
    icon: '/assets/icons/lightning.svg',
    title: 'Instant Trading Insights',
    desc: 'Get real-time market data, charts, trends, and actionable insights.'
  },
  {
    icon: '/assets/icons/robot.svg',
    title: 'Smarter & Automated Analysis',
    desc: 'Let AI analyze market conditions, indicators, and potential opportunities.'
  },
  {
    icon: '/assets/icons/gauge.svg',
    title: 'Real-Time Decision Support',
    desc: 'Make confident trading decisions with AI-powered market intelligence.'
  }
];

export default function AiAssistant() {
  return (
    <div className={styles.aiAssistant}>
      <div className='container'>
        <div className={styles.gridWrapper}>
          {/* Left Column Content with On-Scroll Reveal */}
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
              <Textbutton text="AI ASSISTANT" />
            </motion.div>

            <h2>
              YOUR PERSONAL AI <br />
              <span>TRADING</span> ASSISTANT
            </h2>

            <p className={styles.subtext}>
              Analyze the markets, identify trading setups, and receive AI-powered insights with
              confidence. Your personal AI trading assistant is available 24/7 to help you trade
              smarter.
            </p>

            <div className={styles.featuresList}>
              {features.map((item, index) => (
                <motion.div 
                  key={index} 
                  className={styles.featureItem}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2 + index * 0.15,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.iconCircle}>
                    <img src={item.icon} alt={item.title} />
                  </div>
                  <div className={styles.featureText}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 3D Sphere Image Card */}
          <motion.div 
            className={styles.rightImage}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className={styles.imageCard}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <img src={AiAssistantImg} alt="AI Trading Assistant" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

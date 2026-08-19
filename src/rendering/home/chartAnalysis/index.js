"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './chartAnalysis.module.scss';
import Textbutton from '@/components/textbutton';

const stepData = [
  {
    image: '/assets/images/step-upload.svg',
    title: 'Upload Your Chart',
    desc: 'Upload your trading chart and let AI analyze the market structure.',
    hasPedestal: true
  },
  {
    image: '/assets/images/step-analysis.svg',
    title: 'AI Market Analysis',
    desc: 'AI analyzes trends, indicators, price action, and market conditions.',
    hasPedestal: false
  },
  {
    image: '/assets/images/step-target.svg',
    title: 'Get Your Trade Plan',
    desc: 'Receive an AI-powered trade setup with entry, target, and risk information.',
    hasPedestal: true
  }
];

export default function ChartAnalysis() {
  return (
    <div className={styles.chartAnalysis}>
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
            <Textbutton text="CHART ANALYSIS" />
          </motion.div>

          <h2>
            ANALYZE ANY TRADE <br />
            SETUP IN <span>3 SIMPLE STEPS</span>
          </h2>

          <p className={styles.subtext}>
            Upload a chart and let AI uncover the potential trade opportunities.
          </p>
        </motion.div>

        <div className={styles.stepsFlow}>
          {/* Connector Badge 01 between card 1 and 2 */}
          <motion.div 
            className={styles.connectorBadgeOne}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            01
          </motion.div>
          
          {/* Connector Badge 03 between card 2 and 3 */}
          <motion.div 
            className={styles.connectorBadgeTwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            03
          </motion.div>

          <div className={styles.stepsGrid}>
            {stepData.map((item, index) => (
              <motion.div 
                key={index} 
                className={styles.stepCard}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.18,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className={styles.graphicArea}>
                  <div className={styles.graphicImg}>
                    <img src={item.image} alt={item.title} />
                  </div>
                  {item.hasPedestal && (
                    <div className={styles.pedestal}>
                      <div className={styles.pedestalLight}></div>
                      <div className={styles.pedestalRingOuter}></div>
                      <div className={styles.pedestalRingInner}></div>
                      <div className={styles.pedestalGlow}></div>
                    </div>
                  )}
                </div>

                <div className={styles.cardBox}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

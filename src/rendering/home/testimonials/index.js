"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './testimonials.module.scss';
import Textbutton from '@/components/textbutton';

const testimonialsData = [
  {
    rating: 5,
    quote: '"The signals are sharp and the AI analysis explains the reasoning behind every setup. My entries have never been cleaner."',
    initials: 'DM',
    name: 'Daniel Mercer',
    role: 'Full-Time Forex Trader'
  },
  {
    rating: 5,
    quote: '"I upload a chart, get a full trade plan with entry, target and risk in seconds. It replaced hours of manual work."',
    initials: 'AR',
    name: 'Aisha Rahman',
    role: 'Swing Trader'
  },
  {
    rating: 5,
    quote: '"Risk management tools alone are worth it. The AI keeps me disciplined and out of low-quality trades."',
    initials: 'MV',
    name: 'Marcus Vela',
    role: 'Prop Firm Trader'
  }
];

export default function Testimonials() {
  return (
    <div className={styles.testimonials}>
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
            <Textbutton text="TESTIMONIALS" />
          </motion.div>

          <h2>
            USED BY SERIOUS <br />
            <span>FOREX TRADERS</span>
          </h2>

          <p className={styles.subtext}>
            Real reviews from active traders using ChronosX.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {testimonialsData.map((item, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.16,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className={styles.stars}>
                {[...Array(item.rating)].map((_, i) => (
                  <img key={i} src="/assets/icons/star.svg" alt="star" />
                ))}
              </div>

              <p className={styles.quote}>{item.quote}</p>

              <div className={styles.author}>
                <div className={styles.avatar}>{item.initials}</div>
                <div className={styles.authorInfo}>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './readytoPut.module.scss';
import Button from '@/components/button';

const Logo = '/assets/logo/logo.png';
const RightArrow = '/assets/icons/right.svg';

export default function ReadytoPut() {
  const router = useRouter();

  return (
    <div className={styles.readytoPut}>
      <div className='container'>
        <motion.div 
          className={styles.bannerCard}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
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
                y: [0, -14, 0],
                x: [0, 6, 0],
                scale: [1, 1.04, 1],
                opacity: [0.55, 0.85, 0.55]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <div className={styles.content}>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              READY TO PUT <span>AI</span> IN <br />
              YOUR TRADING DESK?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Claim smarter, and start using AI Trading Signal in just a few minutes.
            </motion.p>

            <motion.div 
              className={styles.btnWrapper}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                text="GET STARTED NOW" 
                icon={RightArrow} 
                onClick={() => authNavigate(router, '/dashboard')} 
              />
            </motion.div>
          </div>

          {/* Logo on bottom left */}
          <motion.div 
            className={styles.brandLogo}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <img src={Logo} alt="ChronosX" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

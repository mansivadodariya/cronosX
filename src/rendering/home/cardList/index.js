"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './cardList.module.scss';
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
export default function CardList() {
    return (
        <div className={styles.cardList}>
            <div className='container'>
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

                        >
                            <div className={styles.iconWrapper}>
                                <img src={item.icon} alt={item.title} />
                            </div>
                            <div className={styles.cardInfo}>
                                <h3>{item.title}</h3>
                                <div className={styles.line}></div>
                                <p>{item.desc}</p>
                            </div>
                            <button className={styles.arrowBtn} >
                                <RightIcon />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

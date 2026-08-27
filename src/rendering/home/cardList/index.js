"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './cardList.module.scss';
import RightIcon from '@/icons/rightIcon';

const gridData = [
    {
        icon: '/assets/icons/signals.svg',
        title: 'AI TRADE',
        desc: 'AI-powered market analysis and trading signals.',
        target: '/trade-snap'
    },
    {
        icon: '/assets/icons/chat-square.svg',
        title: 'AI CHAT',
        desc: 'Ask AI about markets, strategies, signals, and trading decisions.',
        target: '/ai-assistant'
    },
    {
        icon: '/assets/icons/strategy-builder.svg',
        title: 'AI STRATEGY',
        desc: 'Build and analyze smarter trading strategies with AI.',
        target: '/ai-strategy/live'
    },
    {
        icon: '/assets/icons/analysis.svg',
        title: 'AI TRADE ANALYSIS',
        desc: 'Deep algorithmic trade breakdown, liquidity tracking, and risk metrics.',
        target: '/ai-past-trade-analyzer',
        isPublic: true
    }
];

export default function CardList() {
    const router = useRouter();

    const handleCardClick = (item) => {
        if (item.isPublic) {
            router.push(item.target);
        } else {
            authNavigate(router, item.target);
        }
    };

    return (
        <div className={styles.cardList}>
            <div className='container'>
                <div className={styles.grid}>
                    {gridData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            onClick={() => handleCardClick(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCardClick(item);
                                }
                            }}
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
                            <button 
                                type="button"
                                className={styles.arrowBtn}
                                aria-label={`Navigate to ${item.title}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(item);
                                }}
                            >
                                <RightIcon />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

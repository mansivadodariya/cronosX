"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './platform.module.scss';
import Textbutton from '@/components/textbutton';

const AiChat = '/assets/images/ai-chat.png';
const AiTrade = '/assets/images/ai-trade.png';
const AiStrategy = '/assets/images/ai-strategy.png';

const platformData = [
    {
        topIcon: '/assets/icons/chart-square.svg',
        image: AiTrade,
        title: 'AI TRADE',
        desc: 'AI-powered market analysis\nand trading signals.',
        features: [
            { icon: '/assets/icons/market-analysis.svg', text: 'Market\nAnalysis' },
            { icon: '/assets/icons/smart-signals.svg', text: 'Smart Trade\nSignals' },
            { icon: '/assets/icons/real-time.svg', text: 'Real-time\nInsights' },
        ]
    },
    {
        topIcon: '/assets/icons/chat-square.svg',
        image: AiChat,
        title: 'AI CHAT',
        desc: 'Ask AI about markets, strategies,\nsignals, and trading decisions.',
        features: [
            { icon: '/assets/icons/ai-conv.svg', text: 'AI-Powered\nConversations' },
            { icon: '/assets/icons/market-knowledge.svg', text: 'Market\nKnowledge' },
            { icon: '/assets/icons/instant-answers.svg', text: 'Instant\nAnswers' },
        ]
    },
    {
        topIcon: '/assets/icons/shield-square.svg',
        image: AiStrategy,
        title: 'AI STRATEGY',
        desc: 'Build and analyze smarter trading\nstrategies with AI.',
        features: [
            { icon: '/assets/icons/strategy-builder.svg', text: 'Strategy\nBuilder' },
            { icon: '/assets/icons/performance.svg', text: 'Performance\nAnalysis' },
            { icon: '/assets/icons/risk-mgt.svg', text: 'Risk\nManagement' },
        ]
    }
];

export default function Platform() {
    return (
        <div className={styles.platform}>
            <div className='container'>
                <motion.div 
                    className={styles.header}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div 
                        className={styles.badge}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Textbutton text="THE PLATFORM" />
                    </motion.div>

                    <h2>
                        ONE PLATFORM. EVERY <br />
                        <span>TRADING TOOL</span> YOU NEED
                    </h2>

                    <p>
                        Everything from AI trading signals and market intelligence to strategy creation,<br />
                        risk analysis, and more — all in one powerful platform.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {platformData.map((card, index) => (
                        <motion.div 
                            key={index} 
                            className={styles.card}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.2 + index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={{ 
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        >
                            <div className={styles.topIcon}>
                                <img src={card.topIcon} alt="Icon" />
                            </div>

                            <motion.div 
                                className={styles.mainImage}
                                whileHover={{ scale: 1.04 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <img src={card.image} alt={card.title} />
                            </motion.div>

                            <div className={styles.cardContent}>
                                <h3>{card.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: card.desc.replace(/\n/g, '<br />') }}></p>

                                <div className={styles.features}>
                                    {card.features.map((feat, i) => (
                                        <React.Fragment key={i}>
                                            <div className={styles.featureItem}>
                                                <img src={feat.icon} alt="Feature" />
                                                <span dangerouslySetInnerHTML={{ __html: feat.text.replace(/\n/g, '<br />') }}></span>
                                            </div>
                                            {i < card.features.length - 1 && <div className={styles.divider}></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

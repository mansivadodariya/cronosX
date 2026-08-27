'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './not-found.module.scss';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className={styles.notFoundContainer}>
            <Header />

            <main className={styles.mainContent}>
                {/* Background Atmosphere */}
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowCenter} aria-hidden="true" />
                <div className={styles.gridOverlay} aria-hidden="true" />

                <div className="container">
                    <motion.div 
                        className={styles.contentWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Status Tag */}
                        <div className={styles.statusTag}>
                            <span className={styles.pulseDot} />
                            <span>SIGNAL DISCONNECTED • ERROR 404</span>
                        </div>

                        {/* Giant 404 Visual */}
                        <div className={styles.visual404Wrap}>
                            <h1 className={styles.glitch404}>404</h1>
                            <div className={styles.radarRing} />
                        </div>

                        {/* Title & Description */}
                        <h2 className={styles.heading}>
                            Lost in the <span className={styles.goldGradient}>Market Telemetry?</span>
                        </h2>

                        <p className={styles.description}>
                            The coordinates you requested do not exist in our neural routing engine. The page may have been moved, archived, or recalibrated.
                        </p>

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            <Link href="/" className={`${styles.btn} ${styles.primaryBtn}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>RETURN TO HOME</span>
                            </Link>

                            <button 
                                type="button" 
                                onClick={() => router.back()} 
                                className={`${styles.btn} ${styles.secondaryBtn}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                <span>GO PREVIOUS PAGE</span>
                            </button>
                        </div>

                        {/* Quick Navigation Directory */}
                        <div className={styles.quickLinksCard}>
                            <span className={styles.quickLinksHeader}>POPULAR DESTINATIONS</span>
                            <div className={styles.linksGrid}>
                                <Link href="/ai-trade" className={styles.quickLinkItem}>
                                    <span className={styles.linkDot} />
                                    <span>AI Trade Analysis</span>
                                </Link>
                                <Link href="/ai-chat" className={styles.quickLinkItem}>
                                    <span className={styles.linkDot} />
                                    <span>AI Chat Analysis</span>
                                </Link>
                                <Link href="/plans" className={styles.quickLinkItem}>
                                    <span className={styles.linkDot} />
                                    <span>Pricing Plans</span>
                                </Link>
                                <Link href="/economic-calendar" className={styles.quickLinkItem}>
                                    <span className={styles.linkDot} />
                                    <span>Economic Calendar</span>
                                </Link>
                                <Link href="/contact-us" className={styles.quickLinkItem}>
                                    <span className={styles.linkDot} />
                                    <span>Contact Desk</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

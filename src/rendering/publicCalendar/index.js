'use client';

import React from 'react';
import Link from 'next/link';
import styles from './publicCalendar.module.scss';
import EconomicCalendar from '@/rendering/economicCalendar';

export default function PublicEconomicCalendar() {
    return (
        <div className={styles.publicCalendarWrapper}>
            <div className={styles.container}>
                {/* Embedded TradingView Economic Calendar Core Component */}
                <EconomicCalendar />

                {/* Public Conversion CTA Banner */}
                <div className={styles.heroCtaBanner}>
                    <div className={styles.ctaContent}>
                        <h3>Automate Your Trading Strategy Around High-Impact News</h3>
                        <p>Analyze pre-news chart patterns with AI TradeSnap Vision, track central bank rates, and trade with algorithmic edge.</p>
                    </div>
                    <Link href="/signup" className={styles.ctaBtn}>
                        <span>Get Started Free</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

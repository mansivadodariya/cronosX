'use client';

import React from 'react';
import Link from 'next/link';
import styles from './publicCalculator.module.scss';
import ForexCalculator from '@/rendering/calculator';

export default function PublicForexCalculator() {
    return (
        <div className={styles.publicCalculatorWrapper}>
            <div className={styles.container}>
                {/* Embedded Core Institutional Calculator Suite */}
                <ForexCalculator />

                {/* Public Conversion CTA Banner */}
                <div className={styles.heroCtaBanner}>
                    <div className={styles.ctaContent}>
                        <h3>Ready for Institutional AI Execution?</h3>
                        <p>Analyze charts with AI TradeSnap Vision, backtest algorithmic strategies & automate your trading workflow.</p>
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

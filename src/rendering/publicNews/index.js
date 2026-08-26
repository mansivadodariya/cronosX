'use client';

import React from 'react';
import styles from './publicNews.module.scss';
import MarketNews from '@/rendering/news';

export default function PublicMarketNews() {
    return (
        <div className={styles.publicNewsWrapper}>
            <div className={styles.container}>
                <MarketNews />
            </div>
        </div>
    );
}

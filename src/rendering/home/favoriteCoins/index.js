"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './favoriteCoins.module.scss';
import SectionHeader from '@/components/sectionHeader';

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// TradingView Symbol Logo Component with Fallback
function TradingViewLogo({ logoUrl, name, color, fallbackChar }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.iconWrapper}>
      {!imgError && logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} TradingView Symbol`}
          className={styles.logoImg}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.fallbackChar} style={{ color: color || '#6EE7B7' }}>
          {fallbackChar || name.charAt(0)}
        </span>
      )}
    </div>
  );
}

// Mini Sparkline Curve Component
function SparklineCurve({ isUp }) {
  const strokeColor = isUp ? '#34D399' : '#F87171';
  const pathD = isUp
    ? 'M 2 15 Q 12 16, 22 10 T 42 3'
    : 'M 2 3 Q 12 5, 22 12 T 42 17';

  return (
    <div className={styles.sparklineGraph}>
      <svg viewBox="0 0 44 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={pathD} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Row 1 Assets (Scrolling Left) - Official TradingView Symbol Logos & Truth Details
const row1Assets = [
  {
    name: 'Bitcoin',
    symbol: 'BTCUSD',
    price: '$74,064.50',
    change: '+1.61%',
    isUp: true,
    signal: 'BULLISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg',
    fallbackChar: '₿',
    color: '#F7931A'
  },
  {
    name: 'Ethereum',
    symbol: 'ETHUSD',
    price: '$3,842.10',
    change: '+2.81%',
    isUp: true,
    signal: 'CONVICTION',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCETH.svg',
    fallbackChar: 'Ξ',
    color: '#627EEA'
  },
  {
    name: 'Solana',
    symbol: 'SOLUSD',
    price: '$194.85',
    change: '+5.34%',
    isUp: true,
    signal: 'BREAKOUT',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCSOL.svg',
    fallbackChar: '◎',
    color: '#14F195'
  },
  {
    name: 'Binance',
    symbol: 'BNBUSD',
    price: '$615.20',
    change: '+1.15%',
    isUp: true,
    signal: 'ACCUMULATE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCBNB.svg',
    fallbackChar: '⬡',
    color: '#F3BA2F'
  },
  {
    name: 'Gold',
    symbol: 'XAUUSD',
    price: '$2,748.90',
    change: '+0.95%',
    isUp: true,
    signal: 'SAFE HAVEN',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/metal/gold.svg',
    fallbackChar: 'Au',
    color: '#18C98B'
  },
  {
    name: 'NVIDIA',
    symbol: 'NVDA',
    price: '$138.50',
    change: '+4.20%',
    isUp: true,
    signal: 'SURGE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/nvidia.svg',
    fallbackChar: 'N',
    color: '#76B900'
  },
  {
    name: 'Apple',
    symbol: 'AAPL',
    price: '$228.40',
    change: '+1.65%',
    isUp: true,
    signal: 'STABLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/apple.svg',
    fallbackChar: '',
    color: '#A2AAAD'
  },
  {
    name: 'XRP',
    symbol: 'XRPUSD',
    price: '$0.5840',
    change: '+3.12%',
    isUp: true,
    signal: 'MOMENTUM',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCXRP.svg',
    fallbackChar: '✕',
    color: '#23292F'
  },
];

// Row 2 Assets (Scrolling Right) - Official TradingView Symbol Logos & Truth Details
const row2Assets = [
  {
    name: 'Avalanche',
    symbol: 'AVAXUSD',
    price: '$38.60',
    change: '+4.15%',
    isUp: true,
    signal: 'SURGE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCAVAX.svg',
    fallbackChar: '▲',
    color: '#E84142'
  },
  {
    name: 'Cardano',
    symbol: 'ADAUSD',
    price: '$0.4520',
    change: '+2.10%',
    isUp: true,
    signal: 'CONFLUENCE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCADA.svg',
    fallbackChar: '₳',
    color: '#0033AD'
  },
  {
    name: 'Euro / USD',
    symbol: 'EURUSD',
    price: '1.0854',
    change: '+0.25%',
    isUp: true,
    signal: 'MACRO',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'S&P 500',
    symbol: 'SPX',
    price: '5,864.20',
    change: '+0.88%',
    isUp: true,
    signal: 'INDEX',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/indices/s-and-p-500.svg',
    fallbackChar: 'S',
    color: '#34D399'
  },
  {
    name: 'Chainlink',
    symbol: 'LINKUSD',
    price: '$16.40',
    change: '+6.12%',
    isUp: true,
    signal: 'ORACLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCLINK.svg',
    fallbackChar: '⬢',
    color: '#375BD2'
  },
  {
    name: 'Tesla',
    symbol: 'TSLA',
    price: '$242.80',
    change: '+2.45%',
    isUp: true,
    signal: 'VOLATILE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/tesla.svg',
    fallbackChar: 'T',
    color: '#E82127'
  },
  {
    name: 'Near',
    symbol: 'NEARUSD',
    price: '$5.90',
    change: '+4.80%',
    isUp: true,
    signal: 'AI PROTOCOL',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCNEAR.svg',
    fallbackChar: 'N',
    color: '#000000'
  },
  {
    name: 'Polkadot',
    symbol: 'DOTUSD',
    price: '$6.85',
    change: '+1.95%',
    isUp: true,
    signal: 'MULTI-CHAIN',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCDOT.svg',
    fallbackChar: '●',
    color: '#E6007A'
  },
];

export default function FavoriteCoins() {
  const router = useRouter();

  // Duplicate arrays 3x for seamless infinite marquee loop
  const marqueeRow1 = [...row1Assets, ...row1Assets, ...row1Assets];
  const marqueeRow2 = [...row2Assets, ...row2Assets, ...row2Assets];

  return (
    <section className={styles.favoriteCoinsSection} aria-label="TradingView Verified Asset Markets">
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          badge="TRADINGVIEW VERIFIED SYMBOLS · 100+ MARKETS"
          title1="Trade your"
          title2="favorite coins & assets"
          breakLine={false}
          description="Sub-second real-time neural telemetry across Crypto, Forex, Indices, and Commodities with institutional AI signals."
        />
      </div>

      {/* Infinite Continuous Looping Marquee */}
      <div className={styles.marqueeContainer}>
        {/* Row 1: Scrolling Left */}
        <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
          {marqueeRow1.map((item, idx) => (
            <div key={`row1-${idx}`} className={styles.assetCard} onClick={() => authNavigate(router, '/trade-snap')}>
              <TradingViewLogo
                logoUrl={item.logoUrl}
                name={item.name}
                color={item.color}
                fallbackChar={item.fallbackChar}
              />
              <div className={styles.assetContent}>
                <div className={styles.topRow}>
                  <div className={styles.nameGroup}>
                    <span className={styles.assetName}>{item.name}</span>
                    <span className={styles.tvSymbol}>{item.symbol}</span>
                  </div>
                  <span className={styles.signalTag}>{item.signal}</span>
                </div>
                <div className={styles.bottomRow}>
                  <div className={styles.priceGroup}>
                    <span className={styles.priceText}>{item.price}</span>
                    <span className={`${styles.changeBadge} ${item.isUp ? styles.green : styles.red}`}>
                      {item.change}
                    </span>
                  </div>
                  <SparklineCurve isUp={item.isUp} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
          {marqueeRow2.map((item, idx) => (
            <div key={`row2-${idx}`} className={styles.assetCard} onClick={() => authNavigate(router, '/trade-snap')}>
              <TradingViewLogo
                logoUrl={item.logoUrl}
                name={item.name}
                color={item.color}
                fallbackChar={item.fallbackChar}
              />
              <div className={styles.assetContent}>
                <div className={styles.topRow}>
                  <div className={styles.nameGroup}>
                    <span className={styles.assetName}>{item.name}</span>
                    <span className={styles.tvSymbol}>{item.symbol}</span>
                  </div>
                  <span className={styles.signalTag}>{item.signal}</span>
                </div>
                <div className={styles.bottomRow}>
                  <div className={styles.priceGroup}>
                    <span className={styles.priceText}>{item.price}</span>
                    <span className={`${styles.changeBadge} ${item.isUp ? styles.green : styles.red}`}>
                      {item.change}
                    </span>
                  </div>
                  <SparklineCurve isUp={item.isUp} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="container">
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            type="button" 
            className={styles.ctaBtn}
            onClick={() => authNavigate(router, '/trade-snap')}
          >
            <span>SIGN UP &amp; START SCANNING</span>
            <ArrowRightIcon />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

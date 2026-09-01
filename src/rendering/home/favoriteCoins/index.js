"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate, navigateFeature } from '@/lib/authRedirect';
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

// Row 1 Assets (Forex Majors & Gold) - Official TradingView Symbol Logos & Truth Details
const row1Assets = [
  {
    name: 'Gold',
    symbol: 'XAUUSD',
    price: '$2,748.50',
    change: '+0.95%',
    isUp: true,
    signal: 'SAFE HAVEN',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/metal/gold.svg',
    fallbackChar: 'Au',
    color: '#18C98B'
  },
  {
    name: 'Euro / USD',
    symbol: 'EURUSD',
    price: '1.0854',
    change: '+0.25%',
    isUp: true,
    signal: 'BULLISH',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'GBP / USD',
    symbol: 'GBPUSD',
    price: '1.2945',
    change: '+0.42%',
    isUp: true,
    signal: 'BREAKOUT',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  },
  {
    name: 'USD / JPY',
    symbol: 'USDJPY',
    price: '152.840',
    change: '+0.34%',
    isUp: true,
    signal: 'MOMENTUM',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/JP.svg',
    fallbackChar: '¥',
    color: '#BC002D'
  },
  {
    name: 'AUD / USD',
    symbol: 'AUDUSD',
    price: '0.6580',
    change: '+0.38%',
    isUp: true,
    signal: 'ACCUMULATE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/AU.svg',
    fallbackChar: 'A$',
    color: '#00008B'
  },
  {
    name: 'USD / CAD',
    symbol: 'USDCAD',
    price: '1.3850',
    change: '-0.18%',
    isUp: false,
    signal: 'CONFLUENCE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/CA.svg',
    fallbackChar: 'C$',
    color: '#FF0000'
  },
  {
    name: 'USD / CHF',
    symbol: 'USDCHF',
    price: '0.8650',
    change: '+0.12%',
    isUp: true,
    signal: 'STABLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/CH.svg',
    fallbackChar: 'Fr',
    color: '#D52B1E'
  },
  {
    name: 'Silver',
    symbol: 'XAGUSD',
    price: '$33.80',
    change: '+1.45%',
    isUp: true,
    signal: 'SURGE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/metal/silver.svg',
    fallbackChar: 'Ag',
    color: '#C0C0C0'
  }
];

// Row 2 Assets (Cross Currency Pairs & Global Benchmarks) - Official TradingView Symbol Logos & Truth Details
const row2Assets = [
  {
    name: 'GBP / JPY',
    symbol: 'GBPJPY',
    price: '197.800',
    change: '+0.65%',
    isUp: true,
    signal: 'BREAKOUT',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/GB.svg',
    fallbackChar: '£',
    color: '#C8102E'
  },
  {
    name: 'EUR / JPY',
    symbol: 'EURJPY',
    price: '165.750',
    change: '+0.45%',
    isUp: true,
    signal: 'TREND',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'EUR / GBP',
    symbol: 'EURGBP',
    price: '0.8385',
    change: '-0.15%',
    isUp: false,
    signal: 'RANGE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/EU.svg',
    fallbackChar: '€',
    color: '#003399'
  },
  {
    name: 'NZD / USD',
    symbol: 'NZDUSD',
    price: '0.5975',
    change: '+0.28%',
    isUp: true,
    signal: 'SWING',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/country/NZ.svg',
    fallbackChar: 'NZ$',
    color: '#00247D'
  },
  {
    name: 'Crude Oil',
    symbol: 'USOIL',
    price: '$71.40',
    change: '+1.15%',
    isUp: true,
    signal: 'ENERGY',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/crude-oil.svg',
    fallbackChar: '🛢',
    color: '#E056FD'
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
    name: 'Apple',
    symbol: 'AAPL',
    price: '$228.40',
    change: '+1.65%',
    isUp: true,
    signal: 'STABLE',
    logoUrl: 'https://s3-symbol-logo.tradingview.com/apple.svg',
    fallbackChar: '',
    color: '#A2AAAD'
  }
];

export default function FavoriteCoins() {
  const router = useRouter();
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchLiveTickers = async () => {
      try {
        const res = await fetch('/api/v1/market/tickers');
        if (res.ok) {
          const json = await res.json();
          if (json?.data && isMounted) {
            setLivePrices(json.data);
          }
        }
      } catch {
        // Fallback silently to baseline prices
      }
    };

    fetchLiveTickers();
    const interval = setInterval(fetchLiveTickers, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Duplicate arrays 3x for seamless infinite marquee loop
  const marqueeRow1 = [...row1Assets, ...row1Assets, ...row1Assets];
  const marqueeRow2 = [...row2Assets, ...row2Assets, ...row2Assets];

  const getAssetData = (item) => {
    const live = livePrices[item.symbol];
    return {
      price: live?.price || item.price,
      change: live?.change || item.change,
      isUp: live !== undefined ? live.isUp : item.isUp,
      signal: live?.signal || item.signal
    };
  };

  return (
    <section className={styles.favoriteCoinsSection} aria-label="TradingView Verified Asset Markets">
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          badge="TRADINGVIEW VERIFIED SYMBOLS · LIVE MARKETS"
          title1="Trade your"
          title2="favorite pairs & assets"
          breakLine={false}
          description="Sub-second real-time neural telemetry across Forex, Indices, and Commodities with institutional AI signals."
        />
      </div>

      {/* Infinite Continuous Looping Marquee */}
      <div className={styles.marqueeContainer}>
        {/* Row 1: Scrolling Left */}
        <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
          {marqueeRow1.map((item, idx) => {
            const data = getAssetData(item);
            return (
              <div key={`row1-${idx}`} className={styles.assetCard} onClick={() => navigateFeature(router, '/ai-trade', '/trade-snap')}>
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
                    <span className={styles.signalTag}>{data.signal}</span>
                  </div>
                  <div className={styles.bottomRow}>
                    <div className={styles.priceGroup}>
                      <span className={styles.priceText}>{data.price}</span>
                      <span className={`${styles.changeBadge} ${data.isUp ? styles.green : styles.red}`}>
                        {data.change}
                      </span>
                    </div>
                    <SparklineCurve isUp={data.isUp} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
          {marqueeRow2.map((item, idx) => {
            const data = getAssetData(item);
            return (
              <div key={`row2-${idx}`} className={styles.assetCard} onClick={() => navigateFeature(router, '/ai-trade', '/trade-snap')}>
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
                    <span className={styles.signalTag}>{data.signal}</span>
                  </div>
                  <div className={styles.bottomRow}>
                    <div className={styles.priceGroup}>
                      <span className={styles.priceText}>{data.price}</span>
                      <span className={`${styles.changeBadge} ${data.isUp ? styles.green : styles.red}`}>
                        {data.change}
                      </span>
                    </div>
                    <SparklineCurve isUp={data.isUp} />
                  </div>
                </div>
              </div>
            );
          })}
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

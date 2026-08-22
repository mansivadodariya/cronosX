"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Textbutton from '@/components/textbutton';
import styles from './aiCockpit.module.scss';


const strategyTabs = [
  { id: 'trendCloud', label: 'AI Trend Cloud', icon: 'cloud' },
  { id: 'liquidity', label: 'Liquidity Sweeps', icon: 'waves' },
  { id: 'volumetric', label: 'Volumetric Pulse', icon: 'pulse' },
  { id: 'signals', label: 'AI Signals Pro', icon: 'sparkle' }
];

// Fallback generator for realistic XAU/USD gold candles
function generateFallbackGoldCandles(count = 38, base = 2934.50) {
  const candles = [];
  let price = base * 0.985;
  for (let i = 0; i < count; i++) {
    const cycle = (i / count) * Math.PI * 2.2;
    const wave = Math.sin(cycle) * 6.5;
    const trend = i > count * 0.4 ? 0.8 : -0.3;
    const delta = wave * 0.4 + trend + (Math.random() - 0.48) * 4.2;
    
    const open = price;
    const close = Math.max(open * 0.98, open + delta);
    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + Math.random() * (spread * 0.8 + 2.5);
    const low = Math.min(open, close) - Math.random() * (spread * 0.8 + 2.5);
    const volume = Math.floor(Math.random() * 65 + 35);
    
    price = close;
    candles.push({
      time: Date.now() - (count - i) * 3600 * 1000,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      isBullish: close >= open
    });
  }
  return candles;
}

export default function AiCockpit() {
  const [activeStrategy, setActiveStrategy] = useState('trendCloud');
  const [activeTimeframe, setActiveTimeframe] = useState('1H');
  const [livePrice, setLivePrice] = useState(2934.50);
  const [priceChangeText, setPriceChangeText] = useState('+$38.20 (+1.32%)');
  const [isPositiveChange, setIsPositiveChange] = useState(true);
  const [priceFlash, setPriceFlash] = useState(null);
  const [candles, setCandles] = useState(() => generateFallbackGoldCandles(38, 2934.50));
  const [volume24h, setVolume24h] = useState('$24.85B');
  const [lastUpdatedSec, setLastUpdatedSec] = useState(1.1);
  const [cockpitSubTab, setCockpitSubTab] = useState('overview');
  const [hoveredIntelCard, setHoveredIntelCard] = useState(null);
  const [currentTimeET, setCurrentTimeET] = useState('');

  const tickCounterRef = useRef(0);
  const sparklineData = [22, 26, 25, 32, 36, 40, 44, 48, 52, 58, 65, 72, 76, 82, 88, 96];

  // ET Clock Timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeET(`${hours}:${minutes}:${seconds} ET`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Real Live XAU/USD (Gold) Market Data
  useEffect(() => {
    let isMounted = true;

    const fetchLiveGoldData = async () => {
      try {
        const tickerRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT', { cache: 'no-store' });
        if (tickerRes.ok) {
          const tickerData = await tickerRes.json();
          const current = parseFloat(tickerData.lastPrice);
          const changeVal = parseFloat(tickerData.priceChange);
          const changePct = parseFloat(tickerData.priceChangePercent);

          if (isMounted && current > 0) {
            setLivePrice(current);
            setIsPositiveChange(changeVal >= 0);
            setPriceChangeText(`${changeVal >= 0 ? '+' : ''}$${Math.abs(changeVal).toFixed(2)} (${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%)`);
            setVolume24h(`$${((parseFloat(tickerData.quoteVolume) * 2.8) / 1e9).toFixed(2)}B`);
          }
        }

        const klineRes = await fetch('https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=1h&limit=38', { cache: 'no-store' });
        if (klineRes.ok) {
          const klineData = await klineRes.json();
          if (Array.isArray(klineData) && klineData.length > 0 && isMounted) {
            const parsedCandles = klineData.map((k) => {
              const open = parseFloat(k[1]);
              const high = parseFloat(k[2]);
              const low = parseFloat(k[3]);
              const close = parseFloat(k[4]);
              const vol = parseFloat(k[5]);
              return {
                time: k[0],
                open,
                high,
                low,
                close,
                volume: Math.min(100, Math.max(30, vol * 1.5)),
                isBullish: close >= open
              };
            });
            setCandles(parsedCandles);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };

    fetchLiveGoldData();
    const pollInterval = setInterval(fetchLiveGoldData, 5000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [activeTimeframe]);

  // Continuous Live Candle Formation & Real-Time Ticking Engine
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setLivePrice((prev) => {
        const delta = (Math.random() - 0.47) * 0.55;
        const next = Number((prev + delta).toFixed(2));
        
        setPriceFlash(delta >= 0 ? 'up' : 'down');
        setTimeout(() => setPriceFlash(null), 380);

        setCandles((prevCandles) => {
          if (!prevCandles || prevCandles.length === 0) return prevCandles;
          
          tickCounterRef.current += 1;
          
          // Every 12 ticks, close the active candle and create a brand NEW live candle!
          if (tickCounterRef.current >= 12) {
            tickCounterRef.current = 0;
            const newCandle = {
              time: Date.now(),
              open: next,
              close: next,
              high: next,
              low: next,
              volume: Math.floor(Math.random() * 40 + 35),
              isBullish: true
            };
            return [...prevCandles.slice(1), newCandle];
          }

          const updated = [...prevCandles];
          const lastIdx = updated.length - 1;
          const last = { ...updated[lastIdx] };
          last.close = next;
          last.high = Math.max(last.high, next);
          last.low = Math.min(last.low, next);
          last.isBullish = last.close >= last.open;
          last.volume = Math.min(100, (last.volume || 40) + Math.floor(Math.random() * 3 + 1));
          updated[lastIdx] = last;
          return updated;
        });

        setLastUpdatedSec(Number((Math.random() * 0.6 + 0.5).toFixed(1)));
        return next;
      });
    }, 850);

    return () => clearInterval(tickInterval);
  }, []);

  // Scaled Coordinates & Trend Cloud Calculations
  const { minPrice, maxPrice, priceRange, svgWidth, svgHeight, chartPadding, candleSpacing, ema9Points, ema21Points } = useMemo(() => {
    const width = 640;
    const height = 460;
    const padding = { top: 34, bottom: 44, left: 16, right: 72 };
    
    const lows = candles.map(c => c.low);
    const highs = candles.map(c => c.high);
    
    let min = Math.min(...lows);
    let max = Math.max(...highs);
    const rawRange = max - min || 1;
    min -= rawRange * 0.08;
    max += rawRange * 0.08;
    const range = max - min || 1;

    const availableWidth = width - padding.left - padding.right;
    const spacing = availableWidth / Math.max(1, candles.length);

    // Fast EMA (9 period)
    const k9 = 2 / (9 + 1);
    let ema9 = candles[0]?.close || min;
    const pts9 = candles.map((c, i) => {
      ema9 = c.close * k9 + ema9 * (1 - k9);
      const x = padding.left + i * spacing + spacing / 2;
      const y = height - padding.bottom - ((ema9 - min) / range) * (height - padding.top - padding.bottom);
      return { x, y };
    });

    // Slow EMA (21 period)
    const k21 = 2 / (21 + 1);
    let ema21 = (candles[0]?.close || min) * 0.995;
    const pts21 = candles.map((c, i) => {
      ema21 = c.close * k21 + ema21 * (1 - k21);
      const x = padding.left + i * spacing + spacing / 2;
      const y = height - padding.bottom - ((ema21 - min) / range) * (height - padding.top - padding.bottom);
      return { x, y };
    });

    return {
      minPrice: min,
      maxPrice: max,
      priceRange: range,
      svgWidth: width,
      svgHeight: height,
      chartPadding: padding,
      candleSpacing: spacing,
      ema9Points: pts9,
      ema21Points: pts21
    };
  }, [candles]);

  const priceToY = (price) => {
    const usableHeight = svgHeight - chartPadding.top - chartPadding.bottom;
    const y = svgHeight - chartPadding.bottom - ((price - minPrice) / priceRange) * usableHeight;
    return Math.max(chartPadding.top - 8, Math.min(svgHeight - chartPadding.bottom + 8, y));
  };

  const currentPriceY = priceToY(livePrice);

  // Active Candle Direction Color (Emerald Green or Crimson Red)
  const isLastCandleBullish = candles[candles.length - 1]?.isBullish ?? true;
  const currentLiveColor = isLastCandleBullish ? '#10B981' : '#F43F5E';
  const liveCandleX = chartPadding.left + (candles.length - 1) * candleSpacing + candleSpacing / 2;

  // Trend Cloud Polygon
  const trendCloudPolygon = useMemo(() => {
    if (ema9Points.length < 2 || ema21Points.length < 2) return '';
    const forward = ema9Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const backward = [...ema21Points].reverse().map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    return `${forward} ${backward} Z`;
  }, [ema9Points, ema21Points]);

  return (
    <section className={styles.cockpitSection} aria-label="XAUUSD AI Trading Intelligence Terminal">
      <div className={styles.ambientBackdropGlow} aria-hidden="true" />

      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badgeWrapper}>
            <Textbutton text="AI INTELLIGENCE COCKPIT" />
          </div>
          <h2>
            REAL-TIME LIVE TERMINAL. <br />
            <span>PREDICTIVE COCKPIT.</span>
          </h2>
          <p>
            Institutional-grade real-time market engine. Stream live gold tick candles, track composite AI conviction scores, and monitor volume flows in one unified terminal.
          </p>
        </div>

        {/* ONE MASTER UNIFIED BOX */}
        <div className={styles.masterTerminalBox}>

          
          {/* Top Strategy Selector Bar */}
          <div className={styles.topStrategyBar}>
            {strategyTabs.map((tab) => {
              const isActive = activeStrategy === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.strategyBtn} ${isActive ? styles.strategyActive : ''}`}
                  onClick={() => setActiveStrategy(tab.id)}
                >
                  {tab.icon === 'cloud' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    </svg>
                  )}
                  {tab.icon === 'waves' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                    </svg>
                  )}
                  {tab.icon === 'pulse' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  )}
                  {tab.icon === 'sparkle' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
                    </svg>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2-Part Grid Layout */}
          <div className={styles.twoPartLayout}>
            
            {/* ------------------------------------------------------------
                PART 1 (LEFT): Real-Time Continuously Forming Gold Candlesticks
                ------------------------------------------------------------ */}
            <div className={styles.partOneChart}>
              
              {/* Header */}
              <div className={styles.partHeader}>
                <div className={styles.headerLeftCluster}>
                  <div className={styles.macDots} aria-hidden="true">
                    <span className={styles.dotRed} />
                    <span className={styles.dotYellow} />
                    <span className={styles.dotGreen} />
                  </div>

                  {/* Fixed XAU/USD Gold Pill */}
                  <div className={styles.goldAssetPill}>
                    <span className={styles.cryptoIconLetter}>G</span>
                    <span className={styles.dropdownSymbol}>XAU/USD</span>
                  </div>

                  {/* Timeframe Pills */}
                  <div className={styles.timeframeGroup}>
                    {['1m', '5m', '15m', '1H', '1D'].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        className={`${styles.tfBtn} ${activeTimeframe === tf ? styles.tfBtnActive : ''}`}
                        onClick={() => setActiveTimeframe(tf)}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.strategyBadge}>
                  <span className={styles.beaconDot} />
                  <span>AI TREND CLOUD</span>
                </div>
              </div>

              {/* Chart Canvas with Visible Mesh Grid & Continuous Moving Candles */}
              <div className={styles.svgChartContainer}>
                
                {/* Clearly Visible Horizontal & Vertical Mesh Grid */}
                <div className={styles.visibleGridOverlay} aria-hidden="true">
                  <div className={styles.gridRow} />
                  <div className={styles.gridRow} />
                  <div className={styles.gridRow} />
                  <div className={styles.gridRow} />
                  <div className={styles.gridRow} />
                  <div className={styles.gridCol} style={{ left: '20%' }} />
                  <div className={styles.gridCol} style={{ left: '40%' }} />
                  <div className={styles.gridCol} style={{ left: '60%' }} />
                  <div className={styles.gridCol} style={{ left: '80%' }} />
                </div>

                {/* Right Y-Axis Scale Gutter */}
                <div className={styles.yAxisScaleGutter} aria-hidden="true">
                  <span>{maxPrice.toFixed(1)}</span>
                  <span>{(maxPrice * 0.75 + minPrice * 0.25).toFixed(1)}</span>
                  <span>{((maxPrice + minPrice) / 2).toFixed(1)}</span>
                  <span>{(maxPrice * 0.25 + minPrice * 0.75).toFixed(1)}</span>
                  <span>{minPrice.toFixed(1)}</span>
                </div>

                <svg 
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                  className={styles.chartSvg}
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Shaded Trend Cloud Channel Gradient in Theme Gold */}
                    <linearGradient id="cloudFillGradGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFE693" stopOpacity="0.32" />
                      <stop offset="50%" stopColor="#D8A23B" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#9E6B17" stopOpacity="0.05" />
                    </linearGradient>

                    {/* Volume Gradients */}
                    <linearGradient id="volBullGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.12" />
                    </linearGradient>
                    <linearGradient id="volBearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.12" />
                    </linearGradient>

                    {/* Theme Gold Glow Filters for Both Thin EMA Lines */}
                    <filter id="goldLineGlowBright" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFE693" floodOpacity="0.65" />
                    </filter>
                    <filter id="goldLineGlowDeep" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#D8A23B" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* 2. Volume Profile Histogram Bars */}
                  {candles.map((candle, idx) => {
                    const x = chartPadding.left + idx * candleSpacing + candleSpacing * 0.15;
                    const barWidth = Math.max(3.5, candleSpacing * 0.65);
                    const maxVolHeight = 46;
                    const volHeight = (candle.volume / 100) * maxVolHeight;
                    const y = svgHeight - chartPadding.bottom - volHeight;

                    return (
                      <rect
                        key={`vol-${idx}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={volHeight}
                        fill={candle.isBullish ? 'url(#volBullGrad)' : 'url(#volBearGrad)'}
                        rx="1"
                      />
                    );
                  })}

                  {/* 3. Candlesticks (Wicks & Bodies) */}
                  {candles.map((candle, idx) => {
                    const xCenter = chartPadding.left + idx * candleSpacing + candleSpacing / 2;
                    const bodyWidth = Math.max(4.8, candleSpacing * 0.64);
                    const xLeft = xCenter - bodyWidth / 2;

                    const wickTop = priceToY(candle.high);
                    const wickBottom = priceToY(candle.low);
                    const bodyTop = priceToY(Math.max(candle.open, candle.close));
                    const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                    const bodyHeight = Math.max(2.5, bodyBottom - bodyTop);

                    const color = candle.isBullish ? '#10B981' : '#F43F5E';
                    const isLast = idx === candles.length - 1;

                    return (
                      <g key={`c-${idx}`}>
                        <line
                          x1={xCenter}
                          y1={wickTop}
                          x2={xCenter}
                          y2={wickBottom}
                          stroke={color}
                          strokeWidth="1.2"
                        />
                        <rect
                          x={xLeft}
                          y={bodyTop}
                          width={bodyWidth}
                          height={bodyHeight}
                          fill={color}
                          stroke={color}
                          strokeWidth="0.5"
                          rx="1"
                        />
                        {/* Live pulsating beacon dot at the head of the forming candle */}
                        {isLast && (
                          <g transform={`translate(${xCenter}, ${currentPriceY})`}>
                            <circle r="3.5" fill={color} />
                            <circle r="7.5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.75" />
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* 4. Fast EMA Line (Thin Bright Gold) */}
                  {ema9Points.length > 1 && (
                    <path
                      d={ema9Points.reduce((acc, pt, i, arr) => {
                        if (i === 0) return `M ${pt.x} ${pt.y}`;
                        const prev = arr[i - 1];
                        const cx = (prev.x + pt.x) / 2;
                        return `${acc} Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + pt.y) / 2} T ${pt.x} ${pt.y}`;
                      }, '')}
                      fill="none"
                      stroke="#FFE693"
                      strokeWidth="1.3"
                      filter="url(#goldLineGlowBright)"
                    />
                  )}

                  {/* 5. Slow EMA Line (Thin Deep Amber Gold) */}
                  {ema21Points.length > 1 && (
                    <path
                      d={ema21Points.reduce((acc, pt, i, arr) => {
                        if (i === 0) return `M ${pt.x} ${pt.y}`;
                        const prev = arr[i - 1];
                        const cx = (prev.x + pt.x) / 2;
                        return `${acc} Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + pt.y) / 2} T ${pt.x} ${pt.y}`;
                      }, '')}
                      fill="none"
                      stroke="#D8A23B"
                      strokeWidth="1.1"
                      filter="url(#goldLineGlowDeep)"
                    />
                  )}



                  {/* 6. Dashed Laser Price Line (Color-Matched to Bullish Green / Bearish Red) */}
                  <line
                    x1={chartPadding.left}
                    y1={currentPriceY}
                    x2={svgWidth - chartPadding.right}
                    y2={currentPriceY}
                    stroke={currentLiveColor}
                    strokeDasharray="4 4"
                    strokeWidth="1.4"
                    opacity="0.9"
                  />
                </svg>

                {/* Right Gutter Live Price Badge (Dynamically Red or Green) */}
                <div 
                  className={`${styles.liveRightPricePill} ${isLastCandleBullish ? styles.pillGreen : styles.pillRed}`}
                  style={{ top: `${(currentPriceY / svgHeight) * 100}%` }}
                >
                  <span className={styles.pillText}>
                    {livePrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------
                PART 2 (RIGHT): XAU/USD Gold Spot AI Intelligence Cockpit
                ------------------------------------------------------------ */}
            <div className={styles.partTwoCockpit}>
              
              {/* Breadcrumb Top Bar */}
              <div className={styles.cockpitTopBreadcrumb}>
                <div className={styles.breadcrumbTitle}>
                  <span className={styles.arrowLeft}>‹</span>
                  <span className={styles.parentName}>HEAT LIST</span>
                  <span className={styles.slash}>/</span>
                  <span className={styles.activeAssetTicker}>XAUUSD</span>
                </div>

                <div className={styles.watchlistTag}>
                  <span className={styles.starIcon}>★</span>
                  <span>IN WATCHLIST</span>
                </div>
              </div>

              {/* Asset Identity Header */}
              <div className={styles.assetHeaderRow}>
                <div className={styles.identityLeft}>
                  <div className={styles.logoGold}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFE693">
                      <path d="M12 2L3 8l9 6 9-6-9-6zm0 8.3L6.1 6.5 12 2.6l5.9 3.9L12 10.3zm0 3.7l-9-6v3.2l9 6 9-6v-3.2l-9 6zm0 5l-9-6v3.2l9 6 9-6v-3.2l-9 6z"/>
                    </svg>
                  </div>
                  
                  <div className={styles.titleAndSub}>
                    <div className={styles.tickerBadgeLine}>
                      <h3 className={styles.assetTickerText}>XAUUSD</h3>
                      <span className={styles.liveStatusPill}>
                        <span className={styles.liveGreenBeacon} />
                        LIVE
                      </span>
                    </div>
                    <p className={styles.assetSubDetails}>Gold Spot · Commodities · Precious Metals</p>
                  </div>
                </div>
              </div>

              {/* Massive Live Price Row */}
              <div className={styles.hugePriceRow}>
                <span className={`${styles.mainPriceNumber} ${isPositiveChange ? styles.priceGreen : styles.priceRed} ${priceFlash === 'up' ? styles.flashUp : priceFlash === 'down' ? styles.flashDown : ''}`}>
                  ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>


                <div className={styles.priceChangeAndClock}>
                  <span className={`${styles.changePercentTag} ${!isPositiveChange ? styles.changeNegative : ''}`}>
                    <span className={styles.upArrow}>{isPositiveChange ? '↑' : '↓'}</span>
                    {priceChangeText}
                  </span>
                  <span className={styles.liveClockET}>{currentTimeET}</span>
                </div>
              </div>

              {/* Cockpit Mode Sub-Tabs with Interactive Luxury Hover */}
              <div className={styles.cockpitSubTabs}>
                <button 
                  type="button" 
                  className={`${styles.tabLink} ${cockpitSubTab === 'overview' ? styles.tabLinkActive : ''}`}
                  onClick={() => setCockpitSubTab('overview')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18M7 16l4-4 4 4 5-6"/>
                  </svg>
                  <span>Overview</span>
                </button>

                <button 
                  type="button" 
                  className={`${styles.tabLink} ${cockpitSubTab === 'deep' ? styles.tabLinkActive : ''}`}
                  onClick={() => setCockpitSubTab('deep')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  <span>Deep Analysis</span>
                </button>

                <button 
                  type="button" 
                  className={`${styles.tabLink} ${cockpitSubTab === 'tools' ? styles.tabLinkActive : ''}`}
                  onClick={() => setCockpitSubTab('tools')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  <span>Trading Tools</span>
                </button>

              </div>


              {/* Two High-Impact Intelligence Cards with Mutual Dimming & Respective Hover Animations */}
              <div className={styles.cardsPairGrid}>
                
                {/* Card 1: AI Score Analysis (Same as Capabilities Heat List Conviction) */}
                <div 
                  className={`${styles.intelCard} ${styles.scoreCard} ${hoveredIntelCard === 'score' ? styles.cardActiveScore : ''} ${hoveredIntelCard === 'rank' ? styles.cardDimmed : ''}`}
                  onMouseEnter={() => setHoveredIntelCard('score')}
                  onMouseLeave={() => setHoveredIntelCard(null)}
                >
                  <div className={styles.cardTopMeta}>
                    <div className={styles.cardHeaderWithIcon}>
                      <div className={styles.radarIconBox}>
                        <span className={styles.radarDot} />
                        <span className={styles.radarRing} />
                      </div>
                      <div>
                        <h4 className={styles.cardTitle}>AI Score</h4>
                        <p className={styles.cardSub}>Composite analysis</p>
                      </div>
                    </div>
                    <span className={styles.deltaPillGreen}>↑ +3.1</span>
                  </div>

                  <div className={styles.scoreNumberBlock}>
                    <div className={styles.scoreLargeNum}>
                      <span className={`${styles.scoreDigits} ${hoveredIntelCard === 'score' ? styles.scoreActiveText : ''}`}>96</span>
                      <span className={styles.scoreCurrentBadge}>CURRENT</span>
                    </div>

                    <div className={styles.scoreVerdict}>
                      <span className={styles.verdictText}>Strong Buy</span>
                      <span className={styles.confidenceBadge}>97% CONFIDENCE</span>
                    </div>
                  </div>

                  <div className={styles.sliderTrackWrapper}>
                    <div className={styles.sliderRangeHeader}>
                      <span>0</span>
                      <span className={styles.rangeCenterText}>SCORE RANGE</span>
                      <span>100</span>
                    </div>
                    <div className={styles.sliderTrack}>
                      <motion.div 
                        className={styles.sliderFill} 
                        animate={{ 
                          width: hoveredIntelCard === 'score' ? '96%' : '84%',
                          background: hoveredIntelCard === 'score' 
                            ? 'linear-gradient(90deg, #10B981 0%, #34D399 65%, #FFE693 100%)' 
                            : 'rgba(255, 255, 255, 0.18)',
                          boxShadow: hoveredIntelCard === 'score' ? '0 0 16px rgba(52, 211, 153, 0.85)' : 'none'
                        }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      >
                        <motion.span 
                          className={styles.sliderKnob} 
                          animate={{ 
                            scale: hoveredIntelCard === 'score' ? 1.35 : 1,
                            borderColor: hoveredIntelCard === 'score' ? '#FFE693' : '#10B981',
                            boxShadow: hoveredIntelCard === 'score' ? '0 0 12px #FFE693' : '0 0 8px #34D399'
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Universe Rank & Sparkline (Same as Capabilities Backtesting Equity Curve) */}
                <div 
                  className={`${styles.intelCard} ${styles.rankCard} ${hoveredIntelCard === 'rank' ? styles.cardActiveRank : ''} ${hoveredIntelCard === 'score' ? styles.cardDimmed : ''}`}
                  onMouseEnter={() => setHoveredIntelCard('rank')}
                  onMouseLeave={() => setHoveredIntelCard(null)}
                >
                  <div className={styles.cardTopMeta}>
                    <div className={styles.cardHeaderWithIcon}>
                      <div className={styles.trophyIconBox}>
                        🏆
                      </div>
                      <div>
                        <h4 className={styles.cardTitle}>Universe Rank</h4>
                        <p className={styles.cardSub}>Of 1,000 assets</p>
                      </div>
                    </div>
                    <span className={styles.deltaPillGold}>↑ +2</span>
                  </div>

                  <div className={styles.rankNumberBlock}>
                    <div className={styles.rankNumText}>
                      <span className={`${styles.rankGoldDigit} ${hoveredIntelCard === 'rank' ? styles.rankActiveText : ''}`}>#1</span>
                      <span className={styles.rankOutOf}>/ 1,000</span>
                    </div>
                    <span className={styles.topPerformerBadge}>★ TOP 0.1% PERFORMER</span>
                  </div>

                  <div className={styles.sparklineContainer}>
                    <svg viewBox="0 0 220 54" className={styles.sparklineSvg} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="eqGlowGradGoldCockpit" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D8A23B" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#9E6B17" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#D8A23B" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {hoveredIntelCard === 'rank' ? (
                        <g>
                          {/* Luminous Area Under Upward Equity Curve in Gold */}
                          <motion.path
                            d="M 6 46 Q 40 44 80 38 T 130 26 T 175 18 T 205 12 L 205 50 L 6 50 Z"
                            fill="url(#eqGlowGradGoldCockpit)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                          />

                          {/* Moving Upward Equity Surge Curve in Gold */}
                          <motion.path
                            d="M 6 46 Q 40 44 80 38 T 130 26 T 175 18 T 205 12"
                            fill="none"
                            stroke="#FFE693"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                            filter="drop-shadow(0 0 10px rgba(255, 230, 147, 0.95))"
                          />

                          {/* Peak Tip Dot at Top */}
                          <motion.circle 
                            cx="205" 
                            cy="12" 
                            r="5" 
                            fill="#FFFFFF"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.55 }}
                            filter="drop-shadow(0 0 8px #FFE693)"
                          />

                          {/* Pulsating Ping Radar Ring */}
                          <motion.circle 
                            cx="205" 
                            cy="12" 
                            r="8" 
                            fill="none"
                            stroke="#FFE693"
                            strokeWidth="1.5"
                            initial={{ scale: 0.8, opacity: 0.9 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.1, ease: "easeOut", delay: 0.6 }}
                          />
                        </g>
                      ) : (
                        <g>
                          <path
                            d="M 6 46 Q 40 44 80 38 T 130 26"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.22)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="130" cy="26" r="3" fill="rgba(255, 255, 255, 0.4)" />
                        </g>
                      )}
                    </svg>
                  </div>

                </div>

              </div>




              {/* Bottom 3-Column Luxury Intelligence Matrix - Clean Single-Line Layout */}
              <div className={styles.metaMatrixGrid}>
                <div className={styles.metaCol}>
                  <div className={styles.metaTopRow}>
                    <span className={styles.metaLabel}>MARKET CAP</span>
                    <span className={styles.metaBadgeGold}>#1 ASSET</span>
                  </div>
                  <span className={styles.metaVal}>$17.8T</span>
                  <span className={styles.metaSub}>World Valuation</span>
                </div>

                <div className={styles.metaCol}>
                  <div className={styles.metaTopRow}>
                    <span className={styles.metaLabel}>24H VOLUME</span>
                    <span className={styles.metaBadgeGreen}>+27.4%</span>
                  </div>
                  <span className={styles.metaVal}>$24.85B</span>
                  <span className={styles.metaSub}>Avg $19.50B</span>
                </div>

                <div className={styles.metaCol}>
                  <div className={styles.metaTopRow}>
                    <span className={styles.metaLabel}>AI SIGNAL</span>
                    <span className={styles.metaBadgeLive}>97% CONF.</span>
                  </div>
                  <div className={styles.signalBadgeGreen}>
                    <span className={styles.signalDot} />
                    <span>Strong Buy</span>
                  </div>
                  <span className={styles.metaSub}>Trend Confirmed</span>
                </div>
              </div>



              {/* Live WebSocket Footer */}
              <div className={styles.cockpitFooterBar}>
                <div className={styles.footerLeft}>
                  <span className={styles.liveGreenDotSmall} />
                  <span>UPDATED {lastUpdatedSec}S AGO · WEBSOCKET LIVE</span>
                </div>
                <div className={styles.footerRight}>
                  <span>CHRONOSX AI LIVE FEED · 12MS LATENCY</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

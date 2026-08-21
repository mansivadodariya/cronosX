"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './aiAssistant.module.scss';
import Textbutton from '@/components/textbutton';

// Helper to generate dynamic live candlesticks for simulator
function generateCandles(base = 2650, count = 35) {
  const candles = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    const delta = (Math.random() - 0.47) * (base * 0.0035);
    const open = price;
    const close = open + delta;
    const high = Math.max(open, close) + Math.random() * (base * 0.0018);
    const low = Math.min(open, close) - Math.random() * (base * 0.0018);
    price = close;
    candles.push({ open, close, high, low });
  }
  return candles;
}

const features = [
  {
    id: 0,
    symbol: 'XAU/USD',
    icon: '/assets/icons/lightning.svg',
    title: 'Instant Trading Insights',
    desc: 'Get real-time market data, charts, trends, and actionable insights.',
    badge: 'LIVE SIGNALS'
  },
  {
    id: 1,
    symbol: 'NVDA',
    icon: '/assets/icons/robot.svg',
    title: 'Smarter & Automated Analysis',
    desc: 'Let AI analyze market conditions, indicators, and potential opportunities.',
    badge: 'AUTO STRUCTURE'
  },
  {
    id: 2,
    symbol: 'BTC/USD',
    icon: '/assets/icons/gauge.svg',
    title: 'Real-Time Decision Support',
    desc: 'Make confident trading decisions with AI-powered market intelligence.',
    badge: 'DECISION COPILOT'
  }
];

const symbolConfig = {
  'XAU/USD': { base: 2654.80, name: 'Gold Spot', change: '+1.42%', tf: '15m', signal: 'STRONG BUY (94%)', tp: '2,668.00', sl: '2,647.00', rr: '1 : 3.4' },
  'NVDA': { base: 145.20, name: 'NVIDIA Corp', change: '+2.85%', tf: '1H', signal: 'BREAKOUT LONG', tp: '152.00', sl: '141.50', rr: '1 : 2.9' },
  'BTC/USD': { base: 94850.00, name: 'Bitcoin', change: '+3.15%', tf: '4H', signal: 'BULLISH MOMENTUM', tp: '98,200.00', sl: '92,400.00', rr: '1 : 3.8' }
};

export default function AiAssistant() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTf, setActiveTf] = useState('15m');
  const [activeSymbol, setActiveSymbol] = useState('XAU/USD');
  const [candles, setCandles] = useState(() => generateCandles(2654, 32));
  const [livePrice, setLivePrice] = useState(2654.80);
  const [isPaused, setIsPaused] = useState(false);

  // Sync symbol when activeTab changes
  useEffect(() => {
    const sym = features[activeTab].symbol;
    setActiveSymbol(sym);
    setActiveTf(symbolConfig[sym].tf);
    const cfg = symbolConfig[sym];
    setLivePrice(cfg.base);
    setCandles(generateCandles(cfg.base, 32));
  }, [activeTab]);

  // Real-time live tick simulator for chart
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice((prev) => {
        const delta = (Math.random() - 0.485) * (prev * 0.0006);
        const nextPrice = Number((prev + delta).toFixed(activeSymbol.includes('BTC') || activeSymbol.includes('XAU') ? 2 : 2));
        
        setCandles((prevCandles) => {
          if (prevCandles.length === 0) return prevCandles;
          const last = { ...prevCandles[prevCandles.length - 1] };
          last.close = nextPrice;
          last.high = Math.max(last.high, nextPrice);
          last.low = Math.min(last.low, nextPrice);
          return [...prevCandles.slice(0, -1), last];
        });

        return nextPrice;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [activeSymbol]);

  // Auto-cycle through the 3 tabs when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const cfg = symbolConfig[activeSymbol] || symbolConfig['XAU/USD'];

  // Min/Max for SVG chart scaling
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 560;
  const svgHeight = 240;
  const candleSpacing = svgWidth / candles.length;

  return (
    <div 
      className={styles.aiAssistant}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className='container'>
        <div className={styles.gridWrapper}>
          
          {/* Left Column: Interactive Feature Selection Tabs */}
          <motion.div 
            className={styles.leftContent}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className={styles.badgeWrapper}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Textbutton text="AI ASSISTANT" />
            </motion.div>

            <h2>
              YOUR PERSONAL AI <br />
              <span>TRADING</span> ASSISTANT
            </h2>

            <p className={styles.subtext}>
              Analyze the markets, identify trading setups, and receive AI-powered insights with
              confidence. Your personal AI trading assistant is available 24/7 to help you trade
              smarter.
            </p>

            {/* Interactive Feature Tabs */}
            <div className={styles.featuresList}>
              {features.map((item, index) => {
                const isActive = activeTab === index;
                return (
                  <div
                    key={index}
                    className={`${styles.featureItem} ${isActive ? styles.featureActive : ''}`}
                    onClick={() => {
                      setActiveTab(index);
                      setIsPaused(true);
                    }}
                  >
                    <div className={styles.featureHeaderRow}>
                      <div className={styles.iconCircle}>
                        <img src={item.icon} alt={item.title} />
                      </div>
                      <div className={styles.featureText}>
                        <div className={styles.titleMetaRow}>
                          <h3>{item.title}</h3>
                          <span className={styles.miniBadge}>{item.badge}</span>
                        </div>
                        <p>{item.desc}</p>
                      </div>
                    </div>

                    {/* Progress Bar for Active Tab */}
                    {isActive && (
                      <div className={styles.progressBarTrack}>
                        <motion.div
                          className={styles.progressBarFill}
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: isPaused ? 0 : 7,
                            ease: 'linear'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Ultra-Clean Live TradingView Chart Simulator */}
          <motion.div 
            className={styles.rightImage}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.chartTerminalCard}>
              
              {/* Terminal Top Control Bar */}
              <div className={styles.terminalHeader}>
                <div className={styles.symbolSelectorGroup}>
                  <div className={styles.activeSymbolBadge}>
                    <span className={styles.liveBeacon}></span>
                    <span className={styles.symTicker}>{activeSymbol}</span>
                    <span className={styles.symSubName}>{cfg.name}</span>
                  </div>

                  {/* Symbol Switcher Buttons */}
                  <div className={styles.quickSymTabs}>
                    {['XAU/USD', 'NVDA', 'BTC/USD'].map((s) => (
                      <button
                        key={s}
                        className={`${styles.symBtn} ${activeSymbol === s ? styles.symBtnActive : ''}`}
                        onClick={() => {
                          setActiveSymbol(s);
                          const idx = features.findIndex(f => f.symbol === s);
                          if (idx !== -1) setActiveTab(idx);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeframe Selector Pills */}
                <div className={styles.timeframeGroup}>
                  {['5m', '15m', '1H', '4H', '1D'].map((tf) => (
                    <button
                      key={tf}
                      className={`${styles.tfBtn} ${activeTf === tf ? styles.tfBtnActive : ''}`}
                      onClick={() => setActiveTf(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Price & AI Telemetry Banner */}
              <div className={styles.priceTelemetryBar}>
                <div className={styles.priceLiveBlock}>
                  <span className={styles.priceNum}>${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={styles.changePercent}>{cfg.change}</span>
                </div>

                <div className={styles.aiSignalBadge}>
                  <span className={styles.aiIcon}>⚡</span>
                  <span>AI: {cfg.signal}</span>
                </div>
              </div>

              {/* Main SVG Candlestick Chart Canvas */}
              <div className={styles.chartCanvas}>
                {/* Horizontal Grid Levels */}
                <div className={styles.gridLines}>
                  <div className={styles.gridLine}><span>${maxPrice.toFixed(1)}</span></div>
                  <div className={styles.gridLine}><span>${((maxPrice + minPrice) / 2).toFixed(1)}</span></div>
                  <div className={styles.gridLine}><span>${minPrice.toFixed(1)}</span></div>
                </div>

                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svgChart}>
                  <defs>
                    <linearGradient id="chartAreaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFE693" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#FFE693" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area under trend */}
                  <path
                    d={`M 0 ${svgHeight} ` + candles.map((c, i) => {
                      const x = i * candleSpacing + candleSpacing / 2;
                      const y = svgHeight - ((c.close - minPrice) / priceRange) * (svgHeight - 40) - 20;
                      return `L ${x} ${y}`;
                    }).join(' ') + ` L ${svgWidth} ${svgHeight} Z`}
                    fill="url(#chartAreaGlow)"
                  />

                  {/* Trendline Curve */}
                  <path
                    d={candles.map((c, i) => {
                      const x = i * candleSpacing + candleSpacing / 2;
                      const y = svgHeight - ((c.close - minPrice) / priceRange) * (svgHeight - 40) - 20;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#FFE693"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 8px rgba(255, 230, 147, 0.7))"
                  />

                  {/* Candlesticks (Wicks & Bodies) */}
                  {candles.map((candle, idx) => {
                    const isBullish = candle.close >= candle.open;
                    const x = idx * candleSpacing + candleSpacing / 2;
                    const wickTop = svgHeight - ((candle.high - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const wickBottom = svgHeight - ((candle.low - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const bodyTop = svgHeight - ((Math.max(candle.open, candle.close) - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const bodyHeight = Math.max(3, ((Math.abs(candle.close - candle.open)) / priceRange) * (svgHeight - 40));

                    const candleColor = isBullish ? '#34D399' : '#EF4444';

                    return (
                      <g key={idx}>
                        {/* High/Low Wick */}
                        <line
                          x1={x}
                          y1={wickTop}
                          x2={x}
                          y2={wickBottom}
                          stroke={candleColor}
                          strokeWidth="1.4"
                        />
                        {/* Candle Body */}
                        <rect
                          x={x - 4.5}
                          y={bodyTop}
                          width="9"
                          height={bodyHeight}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })}

                  {/* Target Take-Profit Dotted Line */}
                  <line x1="0" y1="35" x2={svgWidth} y2="35" stroke="#34D399" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
                  
                  {/* Stop-Loss Dotted Line */}
                  <line x1="0" y1={svgHeight - 30} x2={svgWidth} y2={svgHeight - 30} stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1.2" opacity="0.8" />
                </svg>

                {/* Floating Signal Label Overlays */}
                <div className={styles.tpOverlayBadge}>
                  <span>TP TARGET: {cfg.tp}</span>
                </div>

                <div className={styles.slOverlayBadge}>
                  <span>STOP LOSS: {cfg.sl}</span>
                </div>

                {/* Live Current Price Marker Pulse */}
                <div className={styles.liveCurrentMarker}>
                  <span className={styles.pulseDot}></span>
                  <span className={styles.markerText}>${livePrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Terminal Bottom Telemetry HUD */}
              <div className={styles.terminalFooter}>
                <div className={styles.metricPill}>
                  <span className={styles.mLabel}>RISK/REWARD</span>
                  <span className={styles.mValue}>{cfg.rr}</span>
                </div>
                <div className={styles.metricPill}>
                  <span className={styles.mLabel}>ORDER FLOW</span>
                  <span className={styles.mValue}>INSTITUTIONAL</span>
                </div>
                <div className={styles.metricPill}>
                  <span className={styles.mLabel}>AI ACCURACY</span>
                  <span className={styles.mValue}>94.2%</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './herobanner.module.scss';
import Button from '@/components/button';
import SideRays from '@/components/sideRays';

const SparkleIcon = '/assets/icons/sparkle.svg';
const RightArrow = '/assets/icons/right.svg';

// Interactive Pairs Data for Hero Terminal
const terminalPairs = [
  {
    symbol: 'XAU/USD',
    name: 'Gold / US Dollar',
    category: 'COMMODITY',
    price: 2934.50,
    change: '+1.42%',
    isUp: true,
    signal: 'STRONG BUY',
    confidence: 98.4,
    tf: 'M15',
    pattern: 'Bullish Flag Breakout',
    tp1: '2,965.00 (+305 pips)',
    tp2: '2,990.00 (+555 pips)',
    sl: '2,918.00 (-165 pips)',
    rr: '1:3.4',
    candles: [
      { o: 40, h: 58, l: 36, c: 52, up: true },
      { o: 52, h: 65, l: 48, c: 60, up: true },
      { o: 60, h: 64, l: 45, c: 48, up: false },
      { o: 48, h: 55, l: 42, c: 54, up: true },
      { o: 54, h: 72, l: 50, c: 68, up: true },
      { o: 68, h: 75, l: 62, c: 64, up: false },
      { o: 64, h: 80, l: 60, c: 78, up: true },
      { o: 78, h: 92, l: 74, c: 88, up: true },
      { o: 88, h: 96, l: 82, c: 94, up: true },
      { o: 94, h: 110, l: 90, c: 106, up: true },
      { o: 106, h: 115, l: 100, c: 112, up: true },
      { o: 112, h: 128, l: 108, c: 125, up: true },
    ]
  },
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin / Tether',
    category: 'CRYPTO',
    price: 96420.00,
    change: '+3.18%',
    isUp: true,
    signal: 'STRONG BUY',
    confidence: 97.2,
    tf: 'H1',
    pattern: 'Cup & Handle Continuation',
    tp1: '99,500.00 (+3.2%)',
    tp2: '104,000.00 (+7.8%)',
    sl: '94,200.00 (-2.3%)',
    rr: '1:3.8',
    candles: [
      { o: 35, h: 48, l: 30, c: 44, up: true },
      { o: 44, h: 52, l: 38, c: 40, up: false },
      { o: 40, h: 56, l: 36, c: 50, up: true },
      { o: 50, h: 62, l: 46, c: 58, up: true },
      { o: 58, h: 70, l: 54, c: 66, up: true },
      { o: 66, h: 72, l: 58, c: 62, up: false },
      { o: 62, h: 84, l: 60, c: 80, up: true },
      { o: 80, h: 94, l: 76, c: 90, up: true },
      { o: 90, h: 105, l: 86, c: 100, up: true },
      { o: 100, h: 114, l: 95, c: 110, up: true },
      { o: 110, h: 122, l: 104, c: 118, up: true },
      { o: 118, h: 132, l: 114, c: 128, up: true },
    ]
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'FOREX',
    price: 1.0842,
    change: '+0.35%',
    isUp: true,
    signal: 'BULLISH REVERSAL',
    confidence: 91.5,
    tf: 'M30',
    pattern: 'Double Bottom Liquidity Sweep',
    tp1: '1.0910 (+68 pips)',
    tp2: '1.0965 (+123 pips)',
    sl: '1.0805 (-37 pips)',
    rr: '1:2.9',
    candles: [
      { o: 70, h: 76, l: 55, c: 58, up: false },
      { o: 58, h: 62, l: 44, c: 46, up: false },
      { o: 46, h: 54, l: 40, c: 50, up: true },
      { o: 50, h: 56, l: 42, c: 45, up: false },
      { o: 45, h: 60, l: 42, c: 58, up: true },
      { o: 58, h: 72, l: 54, c: 68, up: true },
      { o: 68, h: 78, l: 62, c: 75, up: true },
      { o: 75, h: 88, l: 70, c: 84, up: true },
      { o: 84, h: 92, l: 80, c: 90, up: true },
      { o: 90, h: 102, l: 86, c: 98, up: true },
      { o: 98, h: 108, l: 94, c: 104, up: true },
      { o: 104, h: 118, l: 100, c: 114, up: true },
    ]
  },
  {
    symbol: 'NAS100',
    name: 'Nasdaq 100 Index',
    category: 'INDICES',
    price: 21450.00,
    change: '+1.15%',
    isUp: true,
    signal: 'BREAKOUT',
    confidence: 94.0,
    tf: 'H4',
    pattern: 'All-Time High Range Expansion',
    tp1: '21,750 (+300 pts)',
    tp2: '22,100 (+650 pts)',
    sl: '21,280 (-170 pts)',
    rr: '1:3.2',
    candles: [
      { o: 50, h: 62, l: 45, c: 58, up: true },
      { o: 58, h: 65, l: 52, c: 55, up: false },
      { o: 55, h: 68, l: 50, c: 64, up: true },
      { o: 64, h: 74, l: 60, c: 70, up: true },
      { o: 70, h: 80, l: 66, c: 76, up: true },
      { o: 76, h: 84, l: 70, c: 82, up: true },
      { o: 82, h: 90, l: 78, c: 86, up: true },
      { o: 86, h: 98, l: 82, c: 95, up: true },
      { o: 95, h: 105, l: 90, c: 102, up: true },
      { o: 102, h: 114, l: 98, c: 110, up: true },
      { o: 110, h: 120, l: 106, c: 116, up: true },
      { o: 116, h: 130, l: 112, c: 126, up: true },
    ]
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum / Tether',
    category: 'CRYPTO',
    price: 2780.40,
    change: '+2.40%',
    isUp: true,
    signal: 'STRONG BUY',
    confidence: 95.8,
    tf: 'H1',
    pattern: 'Ascending Triangle Compression',
    tp1: '2,920.00 (+5.0%)',
    tp2: '3,100.00 (+11.5%)',
    sl: '2,690.00 (-3.2%)',
    rr: '1:3.6',
    candles: [
      { o: 42, h: 50, l: 38, c: 46, up: true },
      { o: 46, h: 52, l: 40, c: 42, up: false },
      { o: 42, h: 55, l: 38, c: 50, up: true },
      { o: 50, h: 60, l: 46, c: 56, up: true },
      { o: 56, h: 68, l: 52, c: 64, up: true },
      { o: 64, h: 72, l: 60, c: 68, up: true },
      { o: 68, h: 80, l: 64, c: 76, up: true },
      { o: 76, h: 86, l: 72, c: 84, up: true },
      { o: 84, h: 96, l: 80, c: 92, up: true },
      { o: 92, h: 104, l: 88, c: 100, up: true },
      { o: 100, h: 112, l: 96, c: 108, up: true },
      { o: 108, h: 122, l: 102, c: 118, up: true },
    ]
  }
];

const metrics = [
  { value: '25,000+', label: 'Active Quant Traders', sub: 'Across 140+ Countries' },
  { value: '< 12ms', label: 'AI Inference Speed', sub: 'Sub-second real-time execution' },
  { value: '98.6%', label: 'Pattern Precision', sub: 'Multi-timeframe institutional accuracy' },
  { value: '$4.8B+', label: 'Volume Analyzed', sub: 'Daily market telemetry scanned' }
];

export default function Herobanner() {
  const router = useRouter();
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('M15');
  const [liveTickOffset, setLiveTickOffset] = useState(0);
  const [isTickActive, setIsTickActive] = useState(false);

  const currentPair = terminalPairs[selectedPairIndex];

  // Micro live tick simulation for realism
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() * 0.4 - 0.18);
      setLiveTickOffset((prev) => Number((prev + delta).toFixed(2)));
      setIsTickActive(true);
      setTimeout(() => setIsTickActive(false), 600);
    }, 2400);

    return () => clearInterval(interval);
  }, [selectedPairIndex]);

  const handleScrollToCockpit = () => {
    const cockpitEl = document.querySelector('section[aria-label*="Cockpit"]') || document.querySelector('section');
    if (cockpitEl) {
      cockpitEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      authNavigate(router, '/trade-snap');
    }
  };

  const displayedPrice = (currentPair.price + liveTickOffset).toLocaleString('en-US', {
    minimumFractionDigits: currentPair.price < 10 ? 4 : 2,
    maximumFractionDigits: currentPair.price < 10 ? 4 : 2
  });

  return (
    <section className={styles.herobanner}>
      {/* High-Tech Ambient Atmosphere & Glow Layers */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowCenter} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.radialVignette} aria-hidden="true" />

      {/* SideRays for Desktop/Laptop View */}
      <div className={styles.sideRaysWrapper}>
        <SideRays
          rayColor1="#C1902E"
          rayColor2="#F4D17A"
          origin="top-left"
          spread={3.4}
          tilt={40}
          blend={0.5}
          speed={2.0}
          intensity={2.2}
        />
      </div>

      {/* Modern High-Tech Ambient Atmosphere & Animations for Mobile */}
      <div className={styles.mobileTechAtmosphere} aria-hidden="true">
        <div className={styles.mobileQuantumHalo} />
        <div className={styles.mobileLaserScan} />
        <div className={styles.mobileConstellation}>
          <span className={`${styles.particleDot} ${styles.pDot1}`} />
          <span className={`${styles.particleDot} ${styles.pDot2}`} />
          <span className={`${styles.particleDot} ${styles.pDot3}`} />
          <span className={`${styles.particleDot} ${styles.pDot4}`} />
          <span className={`${styles.particleDot} ${styles.pDot5}`} />
        </div>
      </div>

      <div className="container">
        <div className={styles.heroWrapper}>

          {/* 1. Futuristic Pill Badge */}
          <motion.div
            className={styles.topBadgeRow}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.badge} onClick={() => authNavigate(router, '/trade-snap')}>
              <span className={styles.pulseDot}>
                <span className={styles.pulseRing} />
              </span>
              <span className={styles.badgeTag}>CHRONOSX 3.2</span>
              <span className={styles.badgeDivider}>•</span>
              <span className={styles.badgeText}>Next-Gen AI Algorithmic Trading Terminal</span>
              <span className={styles.badgeGlowPill}>LIVE ALPHA</span>
              <span className={styles.badgeArrow}>→</span>
            </div>
          </motion.div>

          {/* 2. Bold High-Impact Headline */}
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Trade Smarter With <br />
            <span className={styles.goldGradient}>AI That Never Sleeps</span>
          </motion.h1>

          {/* 3. Subheadline */}
          <motion.p
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Real-time institutional-grade AI signals, multi-timeframe pattern recognition, and sniper trade setups engineered for elite Forex &amp; Crypto traders.
          </motion.p>

          {/* 4. Action Buttons */}
          <motion.div
            className={styles.actionsGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.primaryBtnWrapper}>
              <Button
                text="LAUNCH AI TERMINAL FREE"
                icon={RightArrow}
                onClick={() => authNavigate(router, '/dashboard')}
              />
              <span className={styles.btnGlow} />
            </div>

            <motion.button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleScrollToCockpit}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.playIconCircle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#040300">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              </span>
              <span>EXPLORE LIVE SCANNER</span>
            </motion.button>
          </motion.div>

          {/* 5. Social Proof Strip */}
          <motion.div
            className={styles.socialProofBar}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.avatarGroup}>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #FFE693 0%, #C1902E 100%)' }}>JD</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}>MK</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>AL</div>
              <div className={styles.avatarCircle} style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}>SR</div>
              <div className={`${styles.avatarCircle} ${styles.avatarCount}`}>+25K</div>
            </div>

            <div className={styles.proofText}>
              <div className={styles.starCluster}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.scoreText}>4.9/5 Rating</span>
              </div>
              <span className={styles.verifiedSub}>Verified by 25,000+ Institutional &amp; Prop Traders</span>
            </div>

            <div className={styles.proofDivider} />

            <div className={styles.proofSpeed}>
              <div className={styles.speedHeader}>
                <span className={styles.speedDot} />
                <span className={styles.speedLabel}>Neural Engine Uptime: 99.98%</span>
              </div>
              <span className={styles.speedSub}>⚡ &lt;12ms Sub-second Latency</span>
            </div>
          </motion.div>

          {/* 6. SHOWSTOPPER: Interactive AI Trading Terminal HUD */}
          <motion.div
            className={styles.terminalHudContainer}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Terminal Window Chrome */}
            <div className={styles.terminalWindow}>
              
              {/* Terminal Top Control Header */}
              <div className={styles.terminalHeader}>
                <div className={styles.windowControls}>
                  <span className={styles.controlDotRed} />
                  <span className={styles.controlDotYellow} />
                  <span className={styles.controlDotGreen} />
                  <span className={styles.terminalLabel}>CHRONOSX AI TERMINAL • v3.2 HUD</span>
                </div>

                {/* Pair Switcher Tabs */}
                <div className={styles.pairTabsList}>
                  {terminalPairs.map((pair, index) => {
                    const isSelected = index === selectedPairIndex;
                    return (
                      <button
                        key={pair.symbol}
                        type="button"
                        className={`${styles.pairTab} ${isSelected ? styles.pairTabActive : ''}`}
                        onClick={() => setSelectedPairIndex(index)}
                      >
                        <span className={styles.pairSymbol}>{pair.symbol}</span>
                        <span className={`${styles.pairChange} ${pair.isUp ? styles.changeUp : styles.changeDown}`}>
                          {pair.change}
                        </span>
                        {isSelected && <motion.div layoutId="activePairIndicator" className={styles.activeTabGlow} />}
                      </button>
                    );
                  })}
                </div>

                {/* AI Inference Status Badge */}
                <div className={styles.engineBadge}>
                  <span className={styles.enginePulse} />
                  <span>AI INFERENCE ACTIVE</span>
                </div>
              </div>

              {/* Terminal Main Intelligence Workspace */}
              <div className={styles.terminalBody}>
                
                {/* Left Live Telemetry & Candlestick Canvas */}
                <div className={styles.chartTelemetryArea}>
                  
                  {/* Pair Meta Bar */}
                  <div className={styles.pairMetaBar}>
                    <div className={styles.metaLeft}>
                      <div className={styles.metaSymbolRow}>
                        <span className={styles.mainSymbol}>{currentPair.symbol}</span>
                        <span className={styles.categoryBadge}>{currentPair.category}</span>
                        <span className={styles.patternBadge}>{currentPair.pattern}</span>
                      </div>
                      <div className={styles.metaPriceRow}>
                        <span className={`${styles.mainPrice} ${isTickActive ? styles.priceFlashing : ''}`}>
                          ${displayedPrice}
                        </span>
                        <span className={`${styles.mainChange} ${currentPair.isUp ? styles.changeUp : styles.changeDown}`}>
                          {currentPair.change}
                        </span>
                        <span className={styles.liveTickTag}>● LIVE TICK</span>
                      </div>
                    </div>

                    {/* Timeframe & Chart Controls */}
                    <div className={styles.timeframeSelectors}>
                      {['M5', 'M15', 'H1', 'H4', 'D1'].map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          className={`${styles.tfBtn} ${selectedTimeframe === tf ? styles.tfBtnActive : ''}`}
                          onClick={() => setSelectedTimeframe(tf)}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Candlestick & AI Signals Graphic Canvas */}
                  <div className={styles.interactiveChartCanvas}>
                    
                    {/* Background Grid Lines */}
                    <div className={styles.chartGridLines}>
                      <div className={styles.gridLineH} />
                      <div className={styles.gridLineH} />
                      <div className={styles.gridLineH} />
                      <div className={styles.gridLineH} />
                    </div>

                    {/* Laser Scan Line Effect */}
                    <div className={styles.laserScanLine} />

                    {/* Target Overlay Lines (TP1, TP2, SL, Entry) */}
                    <div className={styles.tradeLevelLines}>
                      {/* TP2 Line */}
                      <div className={`${styles.levelLine} ${styles.levelTp2}`}>
                        <span className={styles.levelTag}>TP2: {currentPair.tp2}</span>
                        <div className={styles.levelDashed} />
                      </div>

                      {/* TP1 Line */}
                      <div className={`${styles.levelLine} ${styles.levelTp1}`}>
                        <span className={styles.levelTag}>TP1: {currentPair.tp1}</span>
                        <div className={styles.levelDashed} />
                      </div>

                      {/* Entry Beam */}
                      <div className={`${styles.levelLine} ${styles.levelEntry}`}>
                        <span className={styles.levelTag}>AI ENTRY: ${displayedPrice}</span>
                        <div className={styles.levelSolid} />
                      </div>

                      {/* SL Line */}
                      <div className={`${styles.levelLine} ${styles.levelSl}`}>
                        <span className={styles.levelTag}>STOP LOSS: {currentPair.sl}</span>
                        <div className={styles.levelDashed} />
                      </div>
                    </div>

                    {/* Institutional AI Order Block Zone */}
                    <div className={styles.orderBlockZone}>
                      <span className={styles.orderBlockLabel}>INSTITUTIONAL LIQUIDITY BLOCK (M15 CONFLUENCE)</span>
                    </div>

                    {/* Render Dynamic Candlestick Bars */}
                    <div className={styles.candlestickStage}>
                      {currentPair.candles.map((candle, idx) => {
                        const height = Math.abs(candle.c - candle.o) * 1.8 + 8;
                        const bottom = Math.min(candle.o, candle.c) * 1.6 + 20;
                        const wickHeight = (candle.h - candle.l) * 2.2 + 14;
                        const wickBottom = candle.l * 1.6 + 18;

                        return (
                          <div key={idx} className={styles.candleItem}>
                            {/* Wick */}
                            <div
                              className={`${styles.wick} ${candle.up ? styles.wickUp : styles.wickDown}`}
                              style={{
                                height: `${wickHeight}px`,
                                bottom: `${wickBottom}px`
                              }}
                            />
                            {/* Candle Body */}
                            <motion.div
                              className={`${styles.candleBody} ${candle.up ? styles.candleUp : styles.candleDown}`}
                              style={{
                                height: `${height}px`,
                                bottom: `${bottom}px`
                              }}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.4, delay: idx * 0.03 }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Signal Callout Overlay */}
                    <motion.div
                      className={styles.chartSignalCallout}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <div className={styles.calloutHeader}>
                        <span className={styles.calloutDot} />
                        <span>AI SNIPER SIGNAL DETECTED</span>
                      </div>
                      <div className={styles.calloutBody}>
                        <strong>{currentPair.signal}</strong> on {currentPair.symbol} ({selectedTimeframe})
                      </div>
                      <div className={styles.calloutMeta}>
                        <span>Target R:R {currentPair.rr}</span>
                        <span className={styles.confidenceScore}>{currentPair.confidence}% AI Conviction</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right AI Diagnostics & Confluence Panel */}
                <div className={styles.intelDiagnosticsPanel}>
                  
                  {/* AI Conviction Gauge Card */}
                  <div className={styles.intelCard}>
                    <div className={styles.intelCardHeader}>
                      <span className={styles.intelCardTitle}>AI CONVICTION SCORE</span>
                      <span className={styles.intelCardBadge}>NEURAL V4</span>
                    </div>

                    <div className={styles.gaugeRow}>
                      <div className={styles.gaugeCircular}>
                        <svg viewBox="0 0 36 36" className={styles.circularSvg}>
                          <defs>
                            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFE693" />
                              <stop offset="100%" stopColor="#C1902E" />
                            </linearGradient>
                          </defs>
                          <path
                            className={styles.circleBg}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={styles.circleProgress}
                            stroke="url(#goldGrad)"
                            strokeDasharray={`${currentPair.confidence}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className={styles.gaugeCenterText}>
                          <span className={styles.gaugeNumber}>{currentPair.confidence}%</span>
                          <span className={styles.gaugeLabel}>PROBABILITY</span>
                        </div>
                      </div>

                      <div className={styles.gaugeBreakdown}>
                        <div className={styles.breakdownItem}>
                          <span className={styles.breakdownLabel}>Momentum</span>
                          <span className={styles.breakdownVal}>99.1% High</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.breakdownLabel}>Order Flow</span>
                          <span className={styles.breakdownVal}>Institutional Buy</span>
                        </div>
                        <div className={styles.breakdownItem}>
                          <span className={styles.breakdownLabel}>Volatility Ratio</span>
                          <span className={styles.breakdownVal}>Optimal 1.44</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Timeframe Confluence Matrix */}
                  <div className={styles.intelCard}>
                    <div className={styles.intelCardHeader}>
                      <span className={styles.intelCardTitle}>TIMEFRAME CONFLUENCE</span>
                      <span className={styles.confluenceActive}>4/4 ALIGNED</span>
                    </div>

                    <div className={styles.timeframeMatrix}>
                      <div className={styles.matrixRow}>
                        <span className={styles.tfName}>5M Scalp</span>
                        <span className={styles.tfStatusGreen}>🟢 Strong Bullish</span>
                        <span className={styles.tfConfidence}>98%</span>
                      </div>
                      <div className={styles.matrixRow}>
                        <span className={styles.tfName}>15M Trend</span>
                        <span className={styles.tfStatusGreen}>🟢 Breakout Ready</span>
                        <span className={styles.tfConfidence}>97%</span>
                      </div>
                      <div className={styles.matrixRow}>
                        <span className={styles.tfName}>1H Swing</span>
                        <span className={styles.tfStatusGreen}>🟢 Liquidity Sweep</span>
                        <span className={styles.tfConfidence}>94%</span>
                      </div>
                      <div className={styles.matrixRow}>
                        <span className={styles.tfName}>4H Macro</span>
                        <span className={styles.tfStatusGreen}>🟢 Golden Cross</span>
                        <span className={styles.tfConfidence}>96%</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Box */}
                  <div className={styles.quickExecuteCard}>
                    <div className={styles.quickExecuteHeader}>
                      <span>AUTOMATED TRADE SETUP</span>
                      <span className={styles.readyTag}>READY</span>
                    </div>
                    <div className={styles.quickParams}>
                      <div className={styles.paramCol}>
                        <span className={styles.paramK}>EST. PROFIT</span>
                        <span className={styles.paramVGreen}>+{currentPair.tp1.split(' ')[1] || '305 pips'}</span>
                      </div>
                      <div className={styles.paramCol}>
                        <span className={styles.paramK}>RISK : REWARD</span>
                        <span className={styles.paramVGold}>{currentPair.rr}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.executeTerminalBtn}
                      onClick={() => authNavigate(router, '/trade-snap')}
                    >
                      <span>SCAN CHART IN TRADE-SNAP</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                </div>
              </div>

              {/* Terminal Bottom Telemetry Ticker */}
              <div className={styles.terminalFooter}>
                <div className={styles.footerLiveTag}>
                  <span className={styles.footerDot} />
                  <span>QUANT TELEMETRY FEED:</span>
                </div>
                <div className={styles.footerTickerItems}>
                  <span>⚡ XAU/USD Bullish Order Block Filled @ 2,934.20</span>
                  <span className={styles.footerDivider}>•</span>
                  <span>🔥 BTC/USDT +$2,140 Long Position Running</span>
                  <span className={styles.footerDivider}>•</span>
                  <span>✅ 14/15 AI Predictions Hit TP2 in Last 24 Hours</span>
                </div>
              </div>

            </div>

            {/* Floating Glassmorphic Satellites / Orbit Cards */}
            <motion.div
              className={`${styles.floatingOrbitCard} ${styles.orbitTopLeft}`}
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={styles.orbitIconCircle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <div className={styles.orbitContent}>
                <span className={styles.orbitSub}>AI WIN RATE</span>
                <span className={styles.orbitVal}>93.4% This Week</span>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.floatingOrbitCard} ${styles.orbitBottomRight}`}
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={styles.orbitIconCircleGold}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div className={styles.orbitContent}>
                <span className={styles.orbitSub}>INSTITUTIONAL FLOW</span>
                <span className={styles.orbitValGold}>+$14,820 Captured</span>
              </div>
            </motion.div>

          </motion.div>

          {/* 7. Key Institutional Metrics Strip */}
          <motion.div
            className={styles.metricsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {metrics.map((item) => (
              <div key={item.label} className={styles.metricItem}>
                <div className={styles.metricValue}>{item.value}</div>
                <div className={styles.metricLabel}>{item.label}</div>
                <div className={styles.metricSub}>{item.sub}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

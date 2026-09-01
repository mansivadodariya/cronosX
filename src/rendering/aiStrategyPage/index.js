"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authNavigate } from '@/lib/authRedirect';
import { toast } from '@/components/toast';
import CommonCta from '@/components/commonCta';
import styles from './aiStrategyPage.module.scss';

// Top Feature Highlights Data (4 Value Badges)
const VALUE_BADGES = [
    {
        id: 'watchlist-grid',
        title: 'Real-Time FX Live Grid',
        desc: 'Interactive 6+ pair multi-asset watchlist',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        colorClass: 'iconGold'
    },
    {
        id: 'scoring-engine',
        title: '100-Point Technical Scoring',
        desc: 'Trend, Momentum, Volume & Structure pillars',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        colorClass: 'iconAmber'
    },
    {
        id: 'strategy-selector',
        title: 'Multi-Strategy Selector',
        desc: 'EMA Pullback, Breakout & SuperTrend',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        colorClass: 'iconGreen'
    },
    {
        id: 'ai-evidence',
        title: 'AI Intelligence Evidence',
        desc: 'Transparent multi-factor trend breakdown',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        colorClass: 'iconBlue'
    }
];

// Core Features Breakdown (4 Bento Cards)
const CORE_FEATURES = [
    {
        number: "01",
        title: "Real-Time FX Watchlist & Signal Grid",
        desc: "Track 6+ major Forex pairs and commodities (XAU/USD, EUR/USD, GBP/USD, GBP/JPY, EUR/JPY, USD/CAD) in real-time. Instantly identify Market Bias (Bullish, Bearish, or Neutral) with color-coded score indicators.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        badge: "MULTI-PAIR RADAR",
        statLabel: "Covered Pairs",
        statValue: "6+ Major Assets"
    },
    {
        number: "02",
        title: "100-Point Quantitative Technical Score",
        desc: "Stop relying on single indicators. Our AI engine dynamically analyzes four core market pillars to output an aggregate Technical Score from 0 (Strong Bearish) to 100 (Strong Bullish) with individual 25-point weighted audits.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "4-PILLAR MODEL",
        statLabel: "Max Aggregate",
        statValue: "100 Points"
    },
    {
        number: "03",
        title: "Live Indicator Overlay Charting",
        desc: "Interactive charts loaded with active strategy indicators—including EMA 20, EMA 50, and SuperTrend channels—giving you a visual roadmap of active trends and key pivot zones.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        badge: "LIVE CHARTS",
        statLabel: "Indicator Suite",
        statValue: "EMAs + SuperTrend"
    },
    {
        number: "04",
        title: "AI Strategy Generator",
        desc: "Create and deploy custom quantitative trading strategies tailored to your risk tolerance and trading style. Watch active setups trigger automatically as strategy conditions align in live market data.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        badge: "AUTOMATED RULES",
        statLabel: "Trigger Latency",
        statValue: "< 15ms"
    }
];

// 6+ Pairs Live Score Simulator Data
const PAIRS_DATA = [
    {
        id: 'xauusd',
        symbol: 'XAU/USD',
        name: 'Gold / US Dollar',
        price: '2,742.50',
        score: 24,
        bias: 'STRONG BEARISH',
        biasType: 'bearish',
        confidence: '84%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 0, max: 25, note: 'SMA 10/20/50 & EMA 10/20/50 Bearish' },
            momentum: { score: 11, max: 25, note: 'Slight Bearish Divergence (RSI 42.1)' },
            volume: { score: 5, max: 25, note: 'Below Average Buyer Volume' },
            structure: { score: 8, max: 25, note: 'Testing Key Support at 2,735.00' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Bearish Alignment', state: 'bearish' },
            { name: 'SuperTrend', val: 'Red Cloud (Down)', state: 'bearish' },
            { name: 'RSI (14)', val: '42.10 (Bearish Slope)', state: 'bearish' }
        ],
        summary: 'Gold is encountering heavy resistance at 2,748.00 with multi-period moving average breakdown indicating high probability of downward expansion toward S1 support.'
    },
    {
        id: 'eurusd',
        symbol: 'EUR/USD',
        name: 'Euro / US Dollar',
        price: '1.08450',
        score: 78,
        bias: 'BULLISH',
        biasType: 'bullish',
        confidence: '86%',
        activeStrategy: 'Breakout Master',
        pillars: {
            trend: { score: 22, max: 25, note: 'Golden Cross (EMA 20 > EMA 50)' },
            momentum: { score: 20, max: 25, note: 'RSI 62.4 Expanding Bullish' },
            volume: { score: 18, max: 25, note: 'High Institutional Inflow Delta' },
            structure: { score: 18, max: 25, note: 'Holding Demand Level at 1.08200' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Bullish Crossover', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Cloud (Active)', state: 'bullish' },
            { name: 'RSI (14)', val: '62.40 (Healthy Momentum)', state: 'bullish' }
        ],
        summary: 'EUR/USD established firm baseline above 1.08200 support. Momentum surge and clean moving average fan confirm continuation toward 1.09200 resistance.'
    },
    {
        id: 'gbpusd',
        symbol: 'GBP/USD',
        name: 'British Pound / US Dollar',
        price: '1.29680',
        score: 86,
        bias: 'STRONG BULLISH',
        biasType: 'bullish',
        confidence: '91%',
        activeStrategy: 'SuperTrend Momentum',
        pillars: {
            trend: { score: 24, max: 25, note: 'Triple Moving Average Expansion' },
            momentum: { score: 22, max: 25, note: 'Strong MACD Positive Histogram' },
            volume: { score: 21, max: 25, note: 'High Buying Volume Delta (+68%)' },
            structure: { score: 19, max: 25, note: 'Breakout Above Asian Highs' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Wide Bullish Spread', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Trailing Support', state: 'bullish' },
            { name: 'Volume Profile', val: 'Institutional Accumulation', state: 'bullish' }
        ],
        summary: 'Cable displays premier quantitative confluence with multi-timeframe trend alignment and heavy institutional accumulation following European session open.'
    },
    {
        id: 'gbpjpy',
        symbol: 'GBP/JPY',
        name: 'British Pound / Japanese Yen',
        price: '192.400',
        score: 71,
        bias: 'BULLISH',
        biasType: 'bullish',
        confidence: '81%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 19, max: 25, note: 'EMA 20 Holding Support Line' },
            momentum: { score: 18, max: 25, note: 'RSI 57.8 Rising Momentum' },
            volume: { score: 16, max: 25, note: 'Moderate Buyer Inflow' },
            structure: { score: 18, max: 25, note: 'Ascending Higher-Low Series' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Upward Sloping', state: 'bullish' },
            { name: 'SuperTrend', val: 'Green Support @ 191.80', state: 'bullish' },
            { name: 'RSI (14)', val: '57.80 (Positive)', state: 'bullish' }
        ],
        summary: 'GBP/JPY pullback into the 20 EMA cleanly respected with buyers defending the 191.80 pivot, positioning for next leg toward 193.50.'
    },
    {
        id: 'eurjpy',
        symbol: 'EUR/JPY',
        name: 'Euro / Japanese Yen',
        price: '161.850',
        score: 48,
        bias: 'NEUTRAL / CONSOLIDATION',
        biasType: 'neutral',
        confidence: '75%',
        activeStrategy: 'EMA Pullback Strategy',
        pillars: {
            trend: { score: 12, max: 25, note: 'Flat Tangent on Moving Averages' },
            momentum: { score: 13, max: 25, note: 'RSI 50.2 Midpoint Neutral' },
            volume: { score: 11, max: 25, note: 'Contracting Session Volume' },
            structure: { score: 12, max: 25, note: 'Inside Daily Range Boundaries' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Intersecting (Flat)', state: 'neutral' },
            { name: 'SuperTrend', val: 'Choppy Sideways Channel', state: 'neutral' },
            { name: 'RSI (14)', val: '50.20 (No Directional Bias)', state: 'neutral' }
        ],
        summary: 'Market is in consolidation mode between 161.40 support and 162.30 resistance. Quantitative recommendation is to stay flat until directional breakout occurs.'
    },
    {
        id: 'usdcad',
        symbol: 'USD/CAD',
        name: 'US Dollar / Canadian Dollar',
        price: '1.38500',
        score: 19,
        bias: 'STRONG BEARISH',
        biasType: 'bearish',
        confidence: '87%',
        activeStrategy: 'Breakout Master',
        pillars: {
            trend: { score: 3, max: 25, note: 'All Major EMAs Sloping Downward' },
            momentum: { score: 6, max: 25, note: 'Oversold Continuation Profile' },
            volume: { score: 4, max: 25, note: 'Heavy Selling Pressure Delta' },
            structure: { score: 6, max: 25, note: 'Breakdown Below S1 Support Level' }
        },
        indicators: [
            { name: 'EMA 20/50', val: 'Severe Bearish Divergence', state: 'bearish' },
            { name: 'SuperTrend', val: 'Red Cloud Above Price', state: 'bearish' },
            { name: 'RSI (14)', val: '34.60 (Bearish Momentum)', state: 'bearish' }
        ],
        summary: 'USD/CAD broke key structural support at 1.3880 with high selling volume. Multiple timeframes indicate continuation toward 1.3780.'
    }
];

// Available Strategy Options
const STRATEGIES = [
    'EMA Pullback Strategy',
    'Breakout Master',
    'SuperTrend Momentum'
];

// Comparison Matrix Data
const COMPARISON_DATA = [
    {
        feature: "Multi-Indicator Confluence",
        manual: { status: 'warn', text: "Manual & slow calculation" },
        aiEngine: { status: 'check', text: "Instant 100-Point Algorithmic Score" },
        highlight: true
    },
    {
        feature: "Pillar Evaluation",
        manual: { status: 'warn', text: "Trend Only (Limited scope)" },
        aiEngine: { status: 'check', text: "Trend + Momentum + Volume + Structure" },
        highlight: true
    },
    {
        feature: "Strategy Multi-Pair Grid",
        manual: { status: 'cross', text: "1 Chart at a time" },
        aiEngine: { status: 'check', text: "Real-Time Watchlist Grid (6+ Pairs)" },
        highlight: true
    },
    {
        feature: "Confidence Level",
        manual: { status: 'warn', text: "Subjective emotional guesswork" },
        aiEngine: { status: 'check', text: "Calculated AI Confidence % (0-100%)" },
        highlight: true
    },
    {
        feature: "Execution Latency",
        manual: { status: 'cross', text: "10-20 Minutes delay" },
        aiEngine: { status: 'check', text: "< 15ms Zero-Delay WebSocket Feed" },
        highlight: false
    }
];

// FAQ Accordion Data
const FAQS = [
    {
        question: "How is the 100-point Technical Score calculated?",
        answer: "The score is calculated algorithmically across four weighted market pillars (Trend, Momentum, Volume, and Structure), each contributing up to 25 points. A score above 75 signals a Strong Bullish bias, while a score below 25 signals a Strong Bearish bias."
    },
    {
        question: "What strategies can I run on the Live Analysis Feed?",
        answer: "You can select pre-built institutional strategies such as EMA Pullback, Breakout Master, or SuperTrend Trend-Following, or generate custom parameters tailored to your trading style."
    },
    {
        question: "Is the chart data refreshed in real time?",
        answer: "Yes. The Live Analysis Feed connects directly to high-speed MT5 price feeds via WebSocket to stream zero-delay candlestick ticks and indicator adjustments."
    },
    {
        question: "Can I use this for commodities and indices?",
        answer: "Yes. In addition to major FX pairs, the engine computes 100-point scores and strategy setups for Gold (XAUUSD), Silver, Oil, and Global Indices."
    },
    {
        question: "How do I deploy my own custom strategy parameters?",
        answer: "Inside the Live AI Trading Desk, you can open the Strategy Builder, customize moving average lengths, RSI thresholds, and risk-to-reward targets, and deploy it across your entire watchlist."
    }
];

export default function AiStrategyPage() {
    const router = useRouter();
    const [selectedPair, setSelectedPair] = useState(PAIRS_DATA[0]);
    const [selectedStrategy, setSelectedStrategy] = useState('EMA Pullback Strategy');
    const [isRecomputing, setIsRecomputing] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const demoRef = useRef(null);

    const handleSelectPair = (pair) => {
        setIsRecomputing(true);
        setTimeout(() => {
            setSelectedPair(pair);
            setIsRecomputing(false);
            toast.success(`Loaded 100-Point Score for ${pair.symbol}!`);
        }, 220);
    };

    const handleSelectStrategy = (strat) => {
        setIsRecomputing(true);
        setSelectedStrategy(strat);
        setTimeout(() => {
            setIsRecomputing(false);
            toast.success(`Applied ${strat}!`);
        }, 200);
    };

    const handleCopyScore = () => {
        const text = `📊 LIVE STRATEGY FEED: ${selectedPair.symbol} (${selectedPair.name})
==================================================
Active Strategy: ${selectedStrategy}
Market Bias:     ${selectedPair.bias} (Score: ${selectedPair.score}/100)
AI Confidence:   ${selectedPair.confidence}
📈 PILLAR SCORE BREAKDOWN:
├── 📉 Trend Alignment:   ${selectedPair.pillars.trend.score} / 25  (${selectedPair.pillars.trend.note})
├── ⚡ Momentum Score:   ${selectedPair.pillars.momentum.score} / 25  (${selectedPair.pillars.momentum.note})
├── 📊 Volume Surge:      ${selectedPair.pillars.volume.score} / 25  (${selectedPair.pillars.volume.note})
└── 🧱 Structure Score:   ${selectedPair.pillars.structure.score} / 25  (${selectedPair.pillars.structure.note})
──────────────────────────────────────────────────
TOTAL AGGREGATE SCORE: ${selectedPair.score} / 100 [${selectedPair.bias}]
==================================================`;

        navigator.clipboard.writeText(text);
        toast.success('Technical Score & Pillar Breakdown copied!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Background Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 1. HERO SECTION */}
            {/* ========================================================================= */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroCenterWrapper}>
                        {/* Live Quantitative Telemetry Pill */}


                        {/* Main Title (H1) */}
                        <motion.h1
                            className={styles.heroMainTitle}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Live Analysis Feed &amp; Quantitative <br />
                            <span className={styles.goldGradient}>AI Strategy Generator.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Experience real-time institutional FX intelligence. Select custom algorithmic strategies, track live 100-point Technical Scores across major pairs, and execute data-backed trades with multi-factor confluence.
                        </motion.p>

                        {/* Hero CTAs */}
                        <motion.div
                            className={styles.heroCtaGroup}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            <button
                                type="button"
                                onClick={() => authNavigate(router, '/ai-strategy/live')}
                                className={styles.heroPrimaryBtn}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                <span>LAUNCH LIVE ANALYSIS FEED</span>
                            </button>

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className={styles.heroSecondaryBtn}
                            >
                                <span>EXPLORE 100-POINT SCORING</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </button>
                        </motion.div>

                        {/* ========================================================================= */}
                        {/* 2. KEY INTERFACE HIGHLIGHTS (VALUE BADGES) */}
                        {/* ========================================================================= */}
                        <motion.div
                            className={styles.highlightsGrid}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {VALUE_BADGES.map((item) => (
                                <div key={item.id} className={styles.highlightCard}>
                                    <div className={`${styles.highlightIconBox} ${styles[item.colorClass]}`}>
                                        {item.icon}
                                    </div>
                                    <div className={styles.highlightContent}>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 4. LIVE TECHNICAL SCORE PREVIEW (INTERACTIVE COCKPIT TERMINAL) */}
            {/* ========================================================================= */}
            <section ref={demoRef} id="live-scoring" className={styles.feedDemoSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ QUANTITATIVE COCKPIT PREVIEW</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            LIVE 100-POINT TECHNICAL SCORE FEED
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Select any Forex major or strategy model to inspect live aggregate scores, 4-pillar breakdowns, and market biases in real time.
                        </p>
                    </div>

                    <div className={styles.feedCockpit}>
                        {/* Top Bar: Controls & Strategy Dropdown */}
                        <div className={styles.cockpitNavHeader}>
                            <div className={styles.cockpitBrand}>
                                <span className={`${styles.dot} ${styles.dotRed}`} />
                                <span className={`${styles.dot} ${styles.dotYellow}`} />
                                <span className={`${styles.dot} ${styles.dotGreen}`} />
                                <span className={styles.brandTitle}>CHRONOSX // 100-PT QUANT ENGINE</span>
                            </div>

                            {/* Active Strategy Selector */}
                            <div className={styles.strategySelectorBar}>
                                <span className={styles.stratLabel}>STRATEGY:</span>
                                <div className={styles.stratPills}>
                                    {STRATEGIES.map((strat) => (
                                        <button
                                            key={strat}
                                            type="button"
                                            onClick={() => handleSelectStrategy(strat)}
                                            className={`${styles.stratBtn} ${selectedStrategy === strat ? styles.stratBtnActive : ''}`}
                                        >
                                            {strat}
                                        </button>
                                    ))}
                                </div>
                            </div>


                        </div>

                        {/* Pair Selector Tabs */}
                        <div className={styles.pairsTabsBar}>
                            {PAIRS_DATA.map((p) => {
                                const isSelected = selectedPair.id === p.id;
                                const isBull = p.biasType === 'bullish';
                                const isBear = p.biasType === 'bearish';

                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelectPair(p)}
                                        className={`${styles.pairTabBtn} ${isSelected ? styles.pairTabBtnActive : ''}`}
                                    >
                                        <div className={styles.pairTabTop}>
                                            <span className={styles.pairSym}>{p.symbol}</span>
                                            <span className={isBull ? styles.scoreBadgeBull : isBear ? styles.scoreBadgeBear : styles.scoreBadgeNeut}>
                                                {p.score}/100
                                            </span>
                                        </div>
                                        <span className={styles.pairPrice}>{p.price}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Main Cockpit Body: 2-Column Display */}
                        <div className={styles.cockpitBodyGrid}>
                            {/* Left Column: 100-Point Dial & Market Bias */}
                            <div className={styles.scoreDialCol}>
                                <div className={styles.dialCard}>
                                    <div className={styles.dialHeader}>
                                        <div>
                                            <span className={styles.dialSub}>ACTIVE ASSET</span>
                                            <h3 className={styles.dialPairTitle}>{selectedPair.symbol}</h3>
                                            <span className={styles.dialPairName}>{selectedPair.name}</span>
                                        </div>
                                        <div className={styles.priceTag}>
                                            <span className={styles.priceLabel}>LIVE PRICE</span>
                                            <span className={styles.priceValue}>{selectedPair.price}</span>
                                        </div>
                                    </div>

                                    {/* Central Circular / Radial Meter Simulation */}
                                    <div className={styles.meterContainer}>
                                        <div className={styles.radialDialWrap}>
                                            <svg className={styles.dialSvg} viewBox="0 0 160 160">
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="68"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.06)"
                                                    strokeWidth="12"
                                                />
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="68"
                                                    fill="none"
                                                    stroke={selectedPair.biasType === 'bullish' ? '#10B981' : selectedPair.biasType === 'bearish' ? '#EF4444' : '#38BDF8'}
                                                    strokeWidth="12"
                                                    strokeDasharray="427"
                                                    strokeDashoffset={427 - (427 * selectedPair.score) / 100}
                                                    strokeLinecap="round"
                                                    className={styles.animatedDialRing}
                                                />
                                            </svg>
                                            <div className={styles.dialScoreCenter}>
                                                <span className={styles.dialScoreNum}>{selectedPair.score}</span>
                                                <span className={styles.dialScoreMax}>/ 100 PTS</span>
                                            </div>
                                        </div>

                                        {/* Bias Callout */}
                                        <div className={selectedPair.biasType === 'bullish' ? styles.biasPillBullish : selectedPair.biasType === 'bearish' ? styles.biasPillBearish : styles.biasPillNeutral}>
                                            <span className={styles.biasDot} />
                                            <span>{selectedPair.bias}</span>
                                        </div>

                                        <div className={styles.confidenceRow}>
                                            <span>AI CONFIDENCE:</span>
                                            <strong>{selectedPair.confidence}</strong>
                                        </div>
                                    </div>

                                    {/* Indicator Confluence Tags */}
                                    <div className={styles.indicatorsRow}>
                                        {selectedPair.indicators.map((ind, i) => (
                                            <div key={i} className={styles.indPill}>
                                                <span className={styles.indName}>{ind.name}:</span>
                                                <span className={ind.state === 'bullish' ? styles.indBull : ind.state === 'bearish' ? styles.indBear : styles.indNeut}>
                                                    {ind.val}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: 4-Pillar Breakdown & Action */}
                            <div className={styles.pillarsCol}>
                                <div className={styles.pillarsHeaderRow}>
                                    <div className={styles.pillarsTitleWrap}>
                                        <div className={styles.pillarIconBox}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 3v18h18" />
                                                <path d="m19 9-5 5-4-4-3 3" />
                                                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className={styles.pillarHeaderTag}>4-PILLAR QUANTITATIVE AUDIT</span>
                                            <h4 className={styles.pillarMainTitle}>Detailed Score Breakdown</h4>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopyScore}
                                        className={styles.copyBtn}
                                        title="Copy Breakdown to Clipboard"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        <span>Copy Breakdown</span>
                                    </button>
                                </div>

                                {/* 4 Pillars Progress Meters */}
                                <div className={styles.pillarsList}>
                                    {/* 1. Trend Alignment (25 Pts) */}
                                    <div className={styles.pillarItem}>
                                        <div className={styles.pillarItemTop}>
                                            <div className={styles.pillarName}>
                                                <span className={styles.pillarIcon}>📉</span>
                                                <strong>1. Trend Alignment</strong>
                                            </div>
                                            <span className={styles.pillarScoreNum}>
                                                {selectedPair.pillars.trend.score} / {selectedPair.pillars.trend.max} Pts
                                            </span>
                                        </div>
                                        <div className={styles.pillarProgressBar}>
                                            <div
                                                className={styles.pillarProgressFill}
                                                style={{ width: `${(selectedPair.pillars.trend.score / 25) * 100}%` }}
                                            />
                                        </div>
                                        <span className={styles.pillarNote}>{selectedPair.pillars.trend.note}</span>
                                    </div>

                                    {/* 2. Momentum Metrics (25 Pts) */}
                                    <div className={styles.pillarItem}>
                                        <div className={styles.pillarItemTop}>
                                            <div className={styles.pillarName}>
                                                <span className={styles.pillarIcon}>⚡</span>
                                                <strong>2. Momentum Metrics</strong>
                                            </div>
                                            <span className={styles.pillarScoreNum}>
                                                {selectedPair.pillars.momentum.score} / {selectedPair.pillars.momentum.max} Pts
                                            </span>
                                        </div>
                                        <div className={styles.pillarProgressBar}>
                                            <div
                                                className={styles.pillarProgressFill}
                                                style={{ width: `${(selectedPair.pillars.momentum.score / 25) * 100}%` }}
                                            />
                                        </div>
                                        <span className={styles.pillarNote}>{selectedPair.pillars.momentum.note}</span>
                                    </div>

                                    {/* 3. Volume Dynamics (25 Pts) */}
                                    <div className={styles.pillarItem}>
                                        <div className={styles.pillarItemTop}>
                                            <div className={styles.pillarName}>
                                                <span className={styles.pillarIcon}>📊</span>
                                                <strong>3. Volume Dynamics</strong>
                                            </div>
                                            <span className={styles.pillarScoreNum}>
                                                {selectedPair.pillars.volume.score} / {selectedPair.pillars.volume.max} Pts
                                            </span>
                                        </div>
                                        <div className={styles.pillarProgressBar}>
                                            <div
                                                className={styles.pillarProgressFill}
                                                style={{ width: `${(selectedPair.pillars.volume.score / 25) * 100}%` }}
                                            />
                                        </div>
                                        <span className={styles.pillarNote}>{selectedPair.pillars.volume.note}</span>
                                    </div>

                                    {/* 4. Market Structure (25 Pts) */}
                                    <div className={styles.pillarItem}>
                                        <div className={styles.pillarItemTop}>
                                            <div className={styles.pillarName}>
                                                <span className={styles.pillarIcon}>🧱</span>
                                                <strong>4. Market Structure</strong>
                                            </div>
                                            <span className={styles.pillarScoreNum}>
                                                {selectedPair.pillars.structure.score} / {selectedPair.pillars.structure.max} Pts
                                            </span>
                                        </div>
                                        <div className={styles.pillarProgressBar}>
                                            <div
                                                className={styles.pillarProgressFill}
                                                style={{ width: `${(selectedPair.pillars.structure.score / 25) * 100}%` }}
                                            />
                                        </div>
                                        <span className={styles.pillarNote}>{selectedPair.pillars.structure.note}</span>
                                    </div>
                                </div>

                                {/* Summary & Rationale */}
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryTitle}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="16" x2="12" y2="12" />
                                            <line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                        <span>AI CONFLUENCE SUMMARY</span>
                                    </div>
                                    <p>{selectedPair.summary}</p>
                                </div>

                                {/* Open Desk Button */}
                                <button
                                    type="button"
                                    onClick={() => authNavigate(router, '/ai-strategy/live')}
                                    className={styles.launchDeskActionBtn}
                                >
                                    <span>Open in Live Strategy Desk</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 3. CORE FEATURES BREAKDOWN */}
            {/* ========================================================================= */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ QUANTITATIVE CAPABILITIES</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            CORE PLATFORM FEATURES
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Engineered for algorithmic accuracy, multi-timeframe confirmation, and real-time execution.
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        {CORE_FEATURES.map((feat, index) => (
                            <motion.div
                                key={feat.number}
                                className={styles.featureCard}
                                initial={{ opacity: 0, y: 35 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.12 }}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            >
                                <div className={styles.cardGlowHover} />

                                <div className={styles.cardTopRow}>
                                    <div className={styles.featureIconWrap}>
                                        {feat.icon}
                                    </div>
                                    <span className={styles.featureNum}>{feat.number}</span>
                                </div>

                                <div className={styles.featureBadgePill}>
                                    {feat.badge}
                                </div>

                                <h3 className={styles.featureCardTitle}>{feat.title}</h3>
                                <p className={styles.featureCardDesc}>{feat.desc}</p>

                                <div className={styles.featureCardStat}>
                                    <span className={styles.statLabel}>{feat.statLabel}</span>
                                    <span className={styles.statVal}>{feat.statValue}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 5. WHY TRADERS USE OUR AI STRATEGY GENERATOR (COMPARISON MATRIX) */}
            {/* ========================================================================= */}
            <section className={styles.comparisonSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ QUANTITATIVE PERFORMANCE ADVANTAGE</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            WHY TRADERS USE OUR AI STRATEGY GENERATOR
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Discover the edge of automated 100-point scoring over conventional, subjective manual charting.
                        </p>
                    </div>

                    <div className={styles.tableCard}>
                        <div className={styles.tableResponsive}>
                            <table className={styles.comparisonTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.thFeature}>CORE CAPABILITY</th>
                                        <th className={styles.thManual}>CONVENTIONAL MANUAL STRATEGY</th>
                                        <th className={styles.thAiEngine}>
                                            <div className={styles.aiEngineHeaderBadge}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#18C98B" fillOpacity="0.3" />
                                                </svg>
                                                <span>OUR QUANTITATIVE AI ENGINE</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_DATA.map((row, idx) => (
                                        <tr key={idx} className={row.highlight ? styles.rowHighlight : ''}>
                                            <td className={styles.tdFeature}>
                                                <strong>{row.feature}</strong>
                                            </td>
                                            <td className={styles.tdManual}>
                                                <div className={styles.statusRow}>
                                                    {row.manual.status === 'cross' && (
                                                        <span className={styles.statusIconCross}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    {row.manual.status === 'warn' && (
                                                        <span className={styles.statusIconWarn}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    <span className={styles.manualText}>{row.manual.text}</span>
                                                </div>
                                            </td>
                                            <td className={styles.tdAiEngine}>
                                                <div className={styles.aiEngineTextWrap}>
                                                    <span className={styles.statusIconCheck}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                    <span className={styles.aiEngineText}>{row.aiEngine.text}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ SECTION) */}
            {/* ========================================================================= */}
            <section className={styles.faqSection}>
                <div className="container-xs4">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ FREQUENTLY ASKED QUESTIONS</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            ANSWERS TO YOUR QUESTIONS
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Everything you need to know about the 100-point Technical Score, multi-pillar analytics, and automated strategies.
                        </p>
                    </div>

                    <div className={styles.faqAccordion}>
                        {FAQS.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <motion.div
                                    key={index}
                                    className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                >
                                    <button
                                        type="button"
                                        className={styles.faqQuestionBtn}
                                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={styles.qIcon}>Q:</span>
                                        <span className={styles.qText}>{faq.question}</span>
                                        <span className={styles.faqToggleIcon}>
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                className={isOpen ? styles.iconRotated : ''}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                className={styles.faqAnswerWrapper}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className={styles.faqAnswerContent}>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 7. BOTTOM CALL TO ACTION (COMMON CTA COMPONENT) */}
            {/* ========================================================================= */}
            <CommonCta
                badge="MULTI-PILLAR FX INTELLIGENCE"
                title1="Deploy Quantitative AI Strategies"
                title2="in Real Time"
                description="Stop trading blind. Access 100-point scoring, multi-pillar analytics, and instant strategy setups now."
                primaryBtnText="LAUNCH LIVE ANALYSIS FEED"
                primaryBtnAction="/ai-strategy/live"
                primaryBtnIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                }
                secondaryBtnText="SELECT STRATEGY"
                secondaryBtnAction={scrollToDemo}
            />
        </div>
    );
}

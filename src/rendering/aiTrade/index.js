"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authNavigate } from '@/lib/authRedirect';
import { toast } from '@/components/toast';
import styles from './aiTrade.module.scss';

// Top Feature Highlights Badges Data (3-4 Badges)
const TOP_HIGHLIGHTS = [
    {
        id: 'recognition',
        title: 'Instant Screenshot Recognition',
        desc: 'Upload PNG/JPG from any broker or app',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
        colorClass: 'iconGold'
    },
    {
        id: 'detection',
        title: 'Auto Ticker & Timeframe Detection',
        desc: 'Vision AI automatically reads pair & period',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v6M8 11h6" />
            </svg>
        ),
        colorClass: 'iconAmber'
    },
    {
        id: 'confluence',
        title: 'Vision AI ',
        desc: 'Harmonized patterns + live tick overlay',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        colorClass: 'iconGreen'
    },
    {
        id: 'targets',
        title: 'Calculated Entry, SL & Multi-TP',
        desc: 'Precise protection & 3 profit targets',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
        colorClass: 'iconBlue'
    }
];

// 3-Step Process Data
const STEPS = [
    {
        number: "01",
        title: "Upload Your Chart Screenshot",
        desc: "Drag and drop or upload any chart image from TradingView, MetaTrader 4/5, or your mobile broker app.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        ),
        badge: "STEP 1 // INPUT"
    },
    {
        number: "02",
        title: "Dual Vision AI & MT5 Analysis",
        desc: "Our Gemini Vision AI scans pattern structures and liquidity zones, combining them with live MT5 indicator calculations (EMAs, SuperTrend, Pivots).",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
            </svg>
        ),
        badge: "STEP 2 // DUAL ENGINE"
    },
    {
        number: "03",
        title: "Receive Execution Plan",
        desc: "Get a high-conviction trade signal complete with Action (BUY/SELL), Entry Zone, Protection Stop-Loss (SL), Take Profit Targets (TP1, TP2, TP3), and Risk-Reward Ratio.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        badge: "STEP 3 // EXECUTION"
    }
];

// Key Platform Features (4 Bento Cards)
const KEY_FEATURES = [
    {
        number: "01",
        title: "Universal Chart Compatibility",
        desc: "Supports screenshots from any broker, charting software, or mobile app. Detects major Forex pairs (XAUUSD, EURUSD, GBPUSD, USDJPY), Crypto (BTCUSD, ETHUSD), and Indices.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        badge: "ALL PLATFORMS",
        statLabel: "Supported Assets",
        statValue: "150+ Pairs"
    },
    {
        number: "02",
        title: "Dynamic Timeframe Alignment",
        desc: "Automatically identifies the active timeframe (M1, M15, H1, H4, D1). If timeframe details are missing from the chart image, the system lets you choose short-term, mid-term, or long-term horizons with one click.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        badge: "MULTI-TIMEFRAME",
        statLabel: "Timeframe Range",
        statValue: "M1 to 1D"
    },
    {
        number: "03",
        title: "Support, Resistance & Pattern Mapping",
        desc: "Identifies chart formations (Head & Shoulders, Double Top/Bottom, Breakouts, Order Blocks) and lists exact support and resistance levels extracted visually from your image.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "PATTERN VISION",
        statLabel: "Pattern Library",
        statValue: "30+ Structures"
    },
    {
        number: "04",
        title: "Quantitative Conviction Rating",
        desc: "Evaluates signal strength with a clear Conviction Score (e.g. 88% Confidence), allowing you to filter out low-probability market noise.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        badge: "CONVICTION SCORE",
        statLabel: "Analysis Precision",
        statValue: "99.2%"
    }
];

// Sample Preset Scan Trades
const SAMPLE_PRESETS = [
    {
        id: 'xauusd-gold',
        pair: 'XAUUSD (Gold)',
        timeframe: 'H1',
        confidence: '88%',
        decision: 'BUY (HIGH CONVICTION)',
        decisionType: 'buy',
        patternDetected: 'Ascending Triangle Breakout',
        entryZone: '2,741.50 - 2,743.00',
        stopLoss: '2,735.00 (Protected below S1 Support Level)',
        tp1: '2,748.50',
        tp2: '2,756.00',
        tp3: '2,765.00',
        rrr: '1 : 2.4',
        rationale: 'Vision AI detected an ascending triangle breakout above 2,740.00, confirmed by MT5 Technical Engine showing price holding firmly above the 20 & 50 EMAs with bullish SuperTrend alignment.',
        currentPrice: '2,742.50',
        resistance: 'R1 = 2,748.50 | R2 = 2,756.00',
        support: 'S1 = 2,735.00 | S2 = 2,728.00'
    },
    {
        id: 'eurusd-short',
        pair: 'EURUSD (Euro)',
        timeframe: '15M',
        confidence: '84%',
        decision: 'SELL (HIGH CONVICTION)',
        decisionType: 'sell',
        patternDetected: 'Liquidity Sweep of Asian Highs',
        entryZone: '1.08450 - 1.08520',
        stopLoss: '1.08750 (Above Asian Session High)',
        tp1: '1.08150',
        tp2: '1.07800',
        tp3: '1.07400',
        rrr: '1 : 2.8',
        rationale: 'Vision AI detected a sharp liquidity sweep into the 1H supply zone, confirmed by MT5 SuperTrend bearish flip and EMA 20 rejection.',
        currentPrice: '1.08480',
        resistance: 'R1 = 1.08750 | R2 = 1.09100',
        support: 'S1 = 1.08150 | S2 = 1.07800'
    },
    {
        id: 'btcusdt-long',
        pair: 'BTCUSD (Bitcoin)',
        timeframe: '4H',
        confidence: '91%',
        decision: 'BUY (STRONG IMPULSE)',
        decisionType: 'buy',
        patternDetected: 'Bullish Order Block Retest',
        entryZone: '$64,200 - $64,600',
        stopLoss: '$62,900 (Below 4H Demand Zone)',
        tp1: '$66,800',
        tp2: '$68,500',
        tp3: '$71,200',
        rrr: '1 : 3.1',
        rationale: 'Clean retest of institutional 4H order block with massive buy volume delta (+72%) and RSI momentum divergence confirmation.',
        currentPrice: '$64,450',
        resistance: 'R1 = $66,800 | R2 = $68,500',
        support: 'S1 = $62,900 | S2 = $61,500'
    },
    {
        id: 'gbpusd-flag',
        pair: 'GBPUSD (Cable)',
        timeframe: 'H1',
        confidence: '86%',
        decision: 'BUY (TREND CONTINUATION)',
        decisionType: 'buy',
        patternDetected: 'Bullish Flag Breakout',
        entryZone: '1.29650 - 1.29720',
        stopLoss: '1.29300 (Below Flag Channel Low)',
        tp1: '1.30200',
        tp2: '1.30650',
        tp3: '1.31200',
        rrr: '1 : 2.5',
        rationale: 'Consolidation flag breakout confirmed by Golden Cross on H1 with strong foreign exchange inflows post-London session open.',
        currentPrice: '1.29680',
        resistance: 'R1 = 1.30200 | R2 = 1.30650',
        support: 'S1 = 1.29300 | S2 = 1.28900'
    }
];

// Comparison Matrix Data
const COMPARISON_DATA = [
    {
        feature: "Analysis Speed",
        manual: { status: 'warn', text: "15 - 30 Minutes" },
        aiTrade: { status: 'check', text: "< 3 Seconds" },
        highlight: true
    },
    {
        feature: "Human Bias & Emotion",
        manual: { status: 'warn', text: "High Risk (FOMO, Revenge Trading)" },
        aiTrade: { status: 'check', text: "100% Objective & Data-Driven" },
        highlight: true
    },
    {
        feature: "Chart Upload Feature",
        manual: { status: 'cross', text: "Not Supported" },
        aiTrade: { status: 'check', text: "Instant Vision OCR Recognition" },
        highlight: true
    },
    {
        feature: "MT5 Indicator Confluence",
        manual: { status: 'warn', text: "Manual & Slow Calculation" },
        aiTrade: { status: 'check', text: "Automated Real-Time Indicator Engine" },
        highlight: true
    },
    {
        feature: "Multi-Target Profit Blueprints",
        manual: { status: 'cross', text: "Arbitrary single target estimates" },
        aiTrade: { status: 'check', text: "Calculated TP1, TP2, TP3 Targets" },
        highlight: false
    }
];

// FAQ Accordion Data
const FAQS = [
    {
        question: "What types of chart screenshots can I upload?",
        answer: "You can upload screenshots from any charting platform including TradingView, MetaTrader 4, MetaTrader 5, cTrader, or mobile broker apps in PNG, JPG, or WEBP format."
    },
    {
        question: "How does AI Trade ensure accuracy?",
        answer: "AI Trade uses a dual-engine architecture: Vision AI analyzes the visual patterns and structures on your uploaded image, while our backend cross-checks current live market tick data and MT5 indicators to confirm the signal."
    },
    {
        question: "What happens if my screenshot doesn't show a clear timeframe?",
        answer: "If the image lacks a clear timeframe label, the system automatically prompts you to choose your desired trading horizon (Short-Term, Mid-Term, or Long-Term) before generating the setup."
    },
    {
        question: "Can I upload charts from mobile broker apps?",
        answer: "Yes, absolutely. You can take a screenshot directly on your smartphone (iOS/Android) from MT4, MT5, TradingView, or proprietary broker apps and upload it directly."
    },
    {
        question: "How many targets (Take-Profits) are provided per setup?",
        answer: "Every trade analysis provides 3 distinct Take-Profit levels (TP1 for conservative scalpers, TP2 for trend followers, and TP3 for full swing runner targets) alongside a strict Stop-Loss."
    }
];

export default function AiTrade() {
    const router = useRouter();
    const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PRESETS[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [openFaq, setOpenFaq] = useState(0);
    const fileInputRef = useRef(null);
    const demoRef = useRef(null);

    const handleSelectPreset = (preset) => {
        setIsScanning(true);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setSelectedPreset(preset);
                    toast.success(`Vision AI Analyzed ${preset.pair}!`);
                    return 100;
                }
                return prev + 25;
            });
        }, 100);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
            setIsScanning(true);
            setScanProgress(0);

            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsScanning(false);
                        toast.success('Custom screenshot analyzed successfully!');
                        return 100;
                    }
                    return prev + 20;
                });
            }, 140);
        }
    };

    const handleCopyPlan = () => {
        const text = `📸 AI TRADE ANALYSIS RESULT
==================================================
Ticker: ${selectedPreset.pair} | Timeframe: ${selectedPreset.timeframe} | Signal Confidence: ${selectedPreset.confidence}
Decision: ${selectedPreset.decision}
Entry Zone: ${selectedPreset.entryZone}
Stop Loss: ${selectedPreset.stopLoss}
Target 1 (TP1): ${selectedPreset.tp1}
Target 2 (TP2): ${selectedPreset.tp2}
Target 3 (TP3): ${selectedPreset.tp3}
Risk-to-Reward Ratio: ${selectedPreset.rrr}
Trade Rationale: ${selectedPreset.rationale}
==================================================`;

        navigator.clipboard.writeText(text);
        toast.success('AI Trade Setup copied to clipboard!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Glows */}
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
                        {/* Live Status Pill */}
                        {/* Main H1 Headline */}
                        <motion.h1
                            className={styles.heroMainTitle}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Upload Any Chart. Get Instant <br />
                            <span className={styles.goldGradient}>Institutional AI Trade Signals.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Experience our Vision AI Chart Scanner. Simply snap or drag-and-drop a screenshot of any TradingView, MT4/MT5, or Crypto chart — our AI automatically detects the symbol, analyzes market structure, overlays live MT5 technical indicators, and delivers precise BUY / SELL / NO-TRADE setups in seconds.
                        </motion.p>

                        {/* Hero Action CTAs */}
                        <motion.div
                            className={styles.heroCtaGroup}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            <button
                                type="button"
                                onClick={() => authNavigate(router, '/trade-snap')}
                                className={styles.heroPrimaryBtn}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>UPLOAD CHART &amp; ANALYZE</span>
                            </button>

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className={styles.heroSecondaryBtn}
                            >
                                <span>TRY DEMO CHART</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </button>
                        </motion.div>

                        {/* ========================================================================= */}
                        {/* 2. TOP FEATURE HIGHLIGHTS (BADGES) */}
                        {/* ========================================================================= */}
                        <motion.div
                            className={styles.highlightsGrid}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {TOP_HIGHLIGHTS.map((item) => (
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
            {/* 3. HOW IT WORKS (3-STEP UI PROCESS) */}
            {/* ========================================================================= */}
            <section className={styles.howItWorksSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ 3-STEP SCANNING WORKFLOW</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            HOW AI TRADE SCANNING WORKS
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            From raw screenshot to full quantitative trade setup in 3 automated steps:
                        </p>
                    </div>

                    <div className={styles.stepsGrid}>
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={step.number}
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                            >
                                <div className={styles.stepHeader}>
                                    <div className={styles.stepNumBadge}>{step.number}</div>
                                    <span className={styles.stepTag}>{step.badge}</span>
                                </div>

                                <div className={styles.stepIconWrap}>
                                    {step.icon}
                                </div>

                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 5. LIVE AI TRADE RESULTS PREVIEW (SAMPLE ANALYSIS COCKPIT) */}
            {/* ========================================================================= */}
            <section ref={demoRef} id="live-demo" className={styles.scannerDemoSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ LIVE VISION AI SCANNER PREVIEW</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            EXPERIENCE AI TRADE IN ACTION
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Select a demo preset or test-upload your own chart to inspect instant trade setups, conviction ratings, and multi-TP targets.
                        </p>
                    </div>

                    <div className={styles.scannerCockpit}>
                        {/* Terminal Window Header */}
                        <div className={styles.cockpitNavHeader}>
                            <div className={styles.cockpitBrand}>
                                <span className={`${styles.dot} ${styles.dotRed}`} />
                                <span className={`${styles.dot} ${styles.dotYellow}`} />
                                <span className={`${styles.dot} ${styles.dotGreen}`} />
                                <span className={styles.brandTitle}>CHRONOSX // VISION AI TRADE ENGINE</span>
                            </div>

                            {/* Preset Tabs */}
                            <div className={styles.presetTabs}>
                                {SAMPLE_PRESETS.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelectPreset(p)}
                                        className={`${styles.tabBtn} ${selectedPreset.id === p.id ? styles.tabBtnActive : ''}`}
                                    >
                                        {p.pair} ({p.timeframe})
                                    </button>
                                ))}
                            </div>

                            <div className={styles.telemetryStatus}>
                                <span className={styles.pulseDot}>
                                    <span className={styles.pulseRing} />
                                </span>
                                <span>OCR V3.4 READY</span>
                            </div>
                        </div>

                        {/* Scanner Main Body: 2-Column Display */}
                        <div className={styles.cockpitBodyGrid}>
                            {/* Left Column: Annotated Visual Chart Simulation / Upload Box */}
                            <div className={styles.chartVisualCol}>
                                <div className={styles.chartFrame}>
                                    {/* Scan Progress Overlay */}
                                    <AnimatePresence>
                                        {isScanning && (
                                            <motion.div
                                                className={styles.scanningOverlay}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className={styles.scanAnimationBox}>
                                                    <div className={styles.laserScanLine} />
                                                    <div className={styles.scanSpinner} />
                                                    <h4>VISION AI SCANNING IN PROGRESS</h4>
                                                    <p>Extracting candlestick structures, order blocks &amp; S/R liquidity...</p>
                                                    <div className={styles.scanProgressBar}>
                                                        <div
                                                            className={styles.scanProgressFill}
                                                            style={{ width: `${scanProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Candlestick & Pattern SVG Simulation */}
                                    <div className={styles.candlestickStage}>
                                        <svg className={styles.chartSvg} viewBox="0 0 540 280" fill="none">
                                            {/* Grid */}
                                            <line x1="0" y1="70" x2="540" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                            <line x1="0" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                            <line x1="0" y1="210" x2="540" y2="210" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                                            {/* Take Profit Target Lines */}
                                            <line x1="280" y1="50" x2="520" y2="50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                                            <text x="440" y="42" fill="#10B981" fontSize="10" fontWeight="700">TP3: {selectedPreset.tp3}</text>

                                            <line x1="280" y1="85" x2="520" y2="85" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                                            <text x="440" y="78" fill="#10B981" fontSize="10" fontWeight="700">TP1: {selectedPreset.tp1}</text>

                                            {/* Stop Loss Line */}
                                            <line x1="280" y1="230" x2="520" y2="230" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                                            <text x="440" y="222" fill="#EF4444" fontSize="10" fontWeight="700">SL: {selectedPreset.stopLoss.split(' ')[0]}</text>

                                            {/* Pattern Bounding Box */}
                                            <rect x="180" y="90" width="220" height="110" fill="rgba(24, 201, 139, 0.05)" stroke="rgba(24, 201, 139, 0.4)" strokeDasharray="3 3" rx="6" />
                                            <text x="190" y="108" fill="#18C98B" fontSize="10" fontWeight="800">PATTERN: {selectedPreset.patternDetected.toUpperCase()}</text>

                                            {/* Candlesticks sequence */}
                                            <line x1="40" y1="160" x2="40" y2="220" stroke="#10B981" strokeWidth="2" />
                                            <rect x="34" y="170" width="12" height="35" fill="#10B981" rx="1" />

                                            <line x1="75" y1="140" x2="75" y2="200" stroke="#10B981" strokeWidth="2" />
                                            <rect x="69" y="150" width="12" height="40" fill="#10B981" rx="1" />

                                            <line x1="110" y1="110" x2="110" y2="180" stroke="#10B981" strokeWidth="2" />
                                            <rect x="104" y="120" width="12" height="45" fill="#10B981" rx="1" />

                                            <line x1="145" y1="120" x2="145" y2="190" stroke="#EF4444" strokeWidth="2" />
                                            <rect x="139" y="130" width="12" height="45" fill="#EF4444" rx="1" />

                                            <line x1="180" y1="150" x2="180" y2="215" stroke="#EF4444" strokeWidth="2" />
                                            <rect x="174" y="165" width="12" height="35" fill="#EF4444" rx="1" />

                                            <line x1="215" y1="130" x2="215" y2="205" stroke="#10B981" strokeWidth="2" />
                                            <rect x="209" y="145" width="12" height="40" fill="#10B981" rx="1" />

                                            <line x1="250" y1="100" x2="250" y2="175" stroke="#10B981" strokeWidth="2" />
                                            <rect x="244" y="115" width="12" height="45" fill="#10B981" rx="1" />

                                            <line x1="285" y1="110" x2="285" y2="195" stroke="#EF4444" strokeWidth="2" />
                                            <rect x="279" y="125" width="12" height="50" fill="#EF4444" rx="1" />

                                            <line x1="320" y1="85" x2="320" y2="165" stroke="#10B981" strokeWidth="2.5" />
                                            <rect x="314" y="100" width="12" height="45" fill="#10B981" rx="1" />

                                            <line x1="355" y1="65" x2="355" y2="145" stroke="#10B981" strokeWidth="2.5" />
                                            <rect x="349" y="80" width="12" height="45" fill="#10B981" rx="1" />
                                        </svg>

                                        {/* Floating Callout Badges */}
                                        <div className={styles.visionCallout}>
                                            <div className={styles.calloutDot} />
                                            <span>Vision AI Confirmed: {selectedPreset.patternDetected}</span>
                                        </div>
                                    </div>

                                    {/* Upload Trigger Bar */}
                                    <div className={styles.uploadTriggerBar}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={styles.uploadDropBtn}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>{uploadedFile ? `Uploaded: ${uploadedFile}` : 'Drag & Drop or Click to Test Your Chart Screenshot'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Structured AI Trade Analysis Result */}
                            <div className={styles.resultCardCol}>
                                <div className={styles.resultHeaderRow}>
                                    <div className={styles.resultTitleWrap}>
                                        <div className={styles.resultIconBox}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className={styles.resultHeaderTag}>AI TRADE ANALYSIS RESULT</span>
                                            <h3 className={styles.resultPairTitle}>
                                                {selectedPreset.pair} <span className={styles.tfBadge}>{selectedPreset.timeframe}</span>
                                            </h3>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopyPlan}
                                        className={styles.copyBtn}
                                        title="Copy Trade Setup to Clipboard"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        <span>Copy Setup</span>
                                    </button>
                                </div>

                                {/* Decision Pill & Conviction Bar */}
                                <div className={styles.decisionBanner}>
                                    <div className={styles.decisionInfo}>
                                        <span className={styles.decisionLabel}>TRADE DECISION:</span>
                                        <div className={selectedPreset.decisionType === 'buy' ? styles.decisionBuy : styles.decisionSell}>
                                            <span className={styles.statusDotGreen} />
                                            <strong>{selectedPreset.decision}</strong>
                                        </div>
                                    </div>

                                    <div className={styles.convictionBadge}>
                                        <span className={styles.convLabel}>CONFIDENCE</span>
                                        <span className={styles.convVal}>{selectedPreset.confidence}</span>
                                    </div>
                                </div>

                                {/* Execution Parameters Grid */}
                                <div className={styles.executionBox}>
                                    <div className={styles.execHeader}>
                                        <div className={styles.targetIconBox}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <circle cx="12" cy="12" r="6" />
                                                <circle cx="12" cy="12" r="2" />
                                            </svg>
                                        </div>
                                        <h5>EXECUTION BLUEPRINT</h5>
                                    </div>

                                    <div className={styles.execRows}>
                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Entry Zone:</span>
                                            <span className={styles.execValHighlight}>{selectedPreset.entryZone}</span>
                                        </div>

                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Protection Stop Loss:</span>
                                            <span className={styles.execValSl}>{selectedPreset.stopLoss}</span>
                                        </div>

                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Target 1 (TP1):</span>
                                            <span className={styles.execValTp}>{selectedPreset.tp1}</span>
                                        </div>

                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Target 2 (TP2):</span>
                                            <span className={styles.execValTp}>{selectedPreset.tp2}</span>
                                        </div>

                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Target 3 (TP3):</span>
                                            <span className={styles.execValTp}>{selectedPreset.tp3}</span>
                                        </div>

                                        <div className={styles.execRow}>
                                            <span className={styles.execKey}>Risk-to-Reward Ratio:</span>
                                            <span className={styles.execValRrr}>{selectedPreset.rrr}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trade Rationale Box */}
                                <div className={styles.rationaleBox}>
                                    <div className={styles.rationaleHeader}>
                                        <div className={styles.lightbulbIconBox}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                                            </svg>
                                        </div>
                                        <h5>TRADE RATIONALE &amp; VISION FINDINGS</h5>
                                    </div>
                                    <p className={styles.rationaleText}>
                                        {selectedPreset.rationale}
                                    </p>
                                </div>

                                {/* Launch Desk CTA */}
                                <div className={styles.deskActionRow}>
                                    <button
                                        type="button"
                                        onClick={() => authNavigate(router, '/trade-snap')}
                                        className={styles.openLiveDeskBtn}
                                    >
                                        <span>Open in Full Scanner Desk</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 4. KEY PLATFORM FEATURES */}
            {/* ========================================================================= */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ QUANTITATIVE VISION SUITE</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            KEY PLATFORM CAPABILITIES
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Engineered to extract reliable price action patterns, liquidity sweeps, and high-probability setups from raw charts.
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        {KEY_FEATURES.map((feat, index) => (
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
            {/* 6. COMPARISON TABLE (MANUAL VS AI TRADE) */}
            {/* ========================================================================= */}
            <section className={styles.comparisonSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ PERFORMANCE COMPARISON</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            AI TRADE VS. TRADITIONAL MANUAL ANALYSIS
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Why institutional traders switch from manual charting to automated Vision AI scanning.
                        </p>
                    </div>

                    <div className={styles.tableCard}>
                        <div className={styles.tableResponsive}>
                            <table className={styles.comparisonTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.thFeature}>FEATURE</th>
                                        <th className={styles.thManual}>MANUAL CHART ANALYSIS</th>
                                        <th className={styles.thAiTrade}>
                                            <div className={styles.aiTradeHeaderBadge}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#18C98B" fillOpacity="0.3" />
                                                </svg>
                                                <span>OUR AI TRADE (AI SNAP)</span>
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
                                            <td className={styles.tdAiTrade}>
                                                <div className={styles.aiTradeTextWrap}>
                                                    <span className={styles.statusIconCheck}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                    <span className={styles.aiTradeText}>{row.aiTrade.text}</span>
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
            {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ SECTION) */}
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
                            Everything you need to know about uploading charts, Vision AI OCR, and indicator confluence.
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
            {/* 8. BOTTOM CALL TO ACTION (CTA) */}
            {/* ========================================================================= */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div
                        className={styles.ctaCard}
                        initial={{ opacity: 0, scale: 0.96, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className={styles.ctaGlowBackground} />
                        <div className={styles.ctaTopBadge}>
                            <span>✦ ZERO GUESSWORK TRADING SCANNER</span>
                        </div>

                        <h2 className={styles.ctaTitle}>
                            Ready to Scan Your <br />
                            <span className={styles.goldGradient}>First Chart?</span>
                        </h2>

                        <p className={styles.ctaDesc}>
                            Stop guessing market directions. Upload your chart screenshot now and trade with AI clarity.
                        </p>

                        <div className={styles.ctaButtonsGroup}>
                            <button
                                type="button"
                                onClick={() => authNavigate(router, '/trade-snap')}
                                className={styles.ctaPrimaryBtn}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>UPLOAD CHART &amp; ANALYZE</span>
                            </button>

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className={styles.ctaSecondaryBtn}
                            >
                                <span>TRY DEMO CHART</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

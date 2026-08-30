"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { authNavigate } from '@/lib/authRedirect';
import { toast } from '@/components/toast';
import AnimatedAreaChart from '@/components/animatedAreaChart';
import SideRays from '@/components/sideRays';
import styles from './aiPastTradeAnalyzer.module.scss';

// Sample audit presets for the interactive demo
const SAMPLE_TRADES = [
    {
        id: 'eurusd-loss',
        title: 'EUR/USD Short Breakout',
        pair: 'EUR/USD',
        timeframe: '15M / 1H',
        result: 'LOSS',
        percent: '-1.42%',
        score: 62,
        rr: '1 : 1.2',
        wrongEntryPrice: '1.08420',
        betterEntryPrice: '1.08750',
        verdict: 'Premature breakout entry into 1H supply zone without confirmation.',
        mistakes: [
            'Entered before confirmation of structure break',
            'No clear trend direction on higher timeframe',
            'SL placed too tight in a volatile zone',
            'Poor risk to reward ratio'
        ],
        improvements: [
            'Wait for market confirmation before entering',
            'Follow higher timeframe trend alignment',
            'Place SL beyond key structural levels',
            'Look for setups offering a minimum 1:2.5 R:R'
        ]
    },
    {
        id: 'btcusdt-fomo',
        title: 'BTC/USDT Long Impulse',
        pair: 'BTC/USDT',
        timeframe: '5M / 4H',
        result: 'LOSS',
        percent: '-2.15%',
        score: 54,
        rr: '1 : 0.8',
        wrongEntryPrice: '$64,820',
        betterEntryPrice: '$62,900',
        verdict: 'Chased green expansion candle into 4H major liquidity resistance.',
        mistakes: [
            'Chased aggressive green candle into 4H resistance',
            'Entered on extended RSI divergence (>82)',
            'Over-leveraged position with no liquidity sweep',
            'Ignored macroeconomic high-impact news window'
        ],
        improvements: [
            'Never enter at the top of an extended impulsive leg',
            'Wait for 4H retracement into optimal order block',
            'Size position strictly according to account 1% risk rule',
            'Check economic calendar before high-impact releases'
        ]
    },
    {
        id: 'xauusd-win',
        title: 'XAU/USD Gold Retracement',
        pair: 'XAU/USD',
        timeframe: '30M / Daily',
        result: 'WIN (Premature Exit)',
        percent: '+0.85%',
        score: 78,
        rr: '1 : 1.5',
        wrongEntryPrice: '$2,318.50',
        betterEntryPrice: '$2,312.00',
        verdict: 'Solid technical direction but exited full volume prematurely before daily liquidity target.',
        mistakes: [
            'Exited full position prematurely before key liquidity pool',
            'Sub-optimal entry on minor wick pullback',
            'Cut winners short due to emotional anxiety'
        ],
        improvements: [
            'Implement partial take-profits to capture full daily target',
            'Use trailing stop-loss behind market structure',
            'Stick to pre-defined risk-reward roadmap without emotion'
        ]
    }
];

export default function AiPastTradeAnalyzer() {
    const router = useRouter();
    const [selectedTrade, setSelectedTrade] = useState(SAMPLE_TRADES[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);

    const heroSectionRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50, isHovered: false });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y, isHovered: true });
    };

    const handleMouseLeave = () => {
        setMousePos(prev => ({ ...prev, isHovered: false }));
    };

    // 3D Perspective Scroll Rotation (Rotates from 52deg back to 0deg flat on scroll)
    const { scrollYProgress } = useScroll({
        target: heroSectionRef,
        offset: ["start 98%", "center center"]
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [52, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
    const translateY = useTransform(scrollYProgress, [0, 1], [75, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.6, 0.88, 1]);

    const handleSelectPreset = (trade) => {
        setIsScanning(true);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setSelectedTrade(trade);
                    toast.success(`AI Audit generated for ${trade.title}`);
                    return 100;
                }
                return prev + 25;
            });
        }, 120);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target.result);
                setIsScanning(true);
                setScanProgress(0);

                const interval = setInterval(() => {
                    setScanProgress(prev => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            setIsScanning(false);
                            toast.success('Custom screenshot analyzed successfully!');
                            return 100;
                        }
                        return prev + 20;
                    });
                }, 180);
            };
            reader.readAsDataURL(file);
        }
    };

    const scrollToAudit = () => {
        const el = document.getElementById('audit-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Atmosphere Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />

            {/* 1. BRAND NEW HERO BANNER UI: Futuristic AI Command Cockpit */}
            <section ref={heroSectionRef} className={styles.heroSection}>
                {/* 1.1 FIRST TITLE SECTION ONLY: Background Animated Area Chart & Spotlight Grid */}
                <div
                    className={styles.heroHeaderArea}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={styles.scrollBgWrapper}>
                        <div className={styles.ambientGlowTop} aria-hidden="true" />
                        <div className={styles.ambientGlowCenter} aria-hidden="true" />

                        {/* Interactive Cursor Spotlight Glow */}
                        <div
                            className={styles.interactiveSpotlight}
                            style={{
                                left: `${mousePos.x}%`,
                                top: `${mousePos.y}%`,
                                opacity: mousePos.isHovered ? 1 : 0
                            }}
                            aria-hidden="true"
                        />

                        <div className={styles.gridOverlay} aria-hidden="true" />

                        {/* Localized Green Grid Spotlight */}
                        <div
                            className={styles.greenSpotlightGrid}
                            style={{
                                opacity: mousePos.isHovered ? 1 : 0,
                                WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, #000 0%, transparent 100%)`,
                                maskImage: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, #000 0%, transparent 100%)`
                            }}
                            aria-hidden="true"
                        />

                        <div className={styles.radialVignette} aria-hidden="true" />

                        {/* Side Rays Effect Layer */}
                   

                        {/* Background Animated Vector Area Chart Behind Title Section */}
                        <AnimatedAreaChart isBackground={true} height={360} />

                        {/* High-Tech Mobile Ambient Atmosphere */}
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
                    </div>

                    <div className="container">
                        <div className={styles.heroCenterWrapper}>
                            {/* 1.1 Top Live Status Pill */}
                            <motion.div
                                className={styles.statusPillRow}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className={styles.statusPill}>
                                    <span className={styles.pulseDot}>
                                        <span className={styles.pulseRing} />
                                    </span>
                                    <span className={styles.pillTag}>QUANT AUDIT ENGINE</span>
                                    <span className={styles.pillDivider}>|</span>
                                    <span className={styles.pillText}>Neural Past Trade Analyzer</span>
                                    <span className={styles.pillBadge}>OCR V3.2</span>
                                </div>
                            </motion.div>

                            {/* 1.2 Main Cinematic Headline */}
                            <motion.h1
                                className={styles.heroMainTitle}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                AI PAST TRADE <br />
                                <span className={styles.goldGradient}>ANALYZER</span>
                            </motion.h1>

                            {/* 1.3 Subtitle */}
                            <motion.p
                                className={styles.heroTagline}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Learn From Every Trade. Improve Every Time.
                            </motion.p>

                            {/* 1.4 Description Narrative */}
                            <motion.p
                                className={styles.heroDesc}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.25 }}
                            >
                                Upload your past trade screenshots and let our AI deeply analyze your entries, exits, risk management, and overall trade execution. Discover what worked, what didn't, and how to become a consistently profitable trader.
                            </motion.p>

                            {/* 1.5 Hero Action CTAs */}
                            <motion.div
                                className={styles.heroCtaGroup}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <button
                                    type="button"
                                    onClick={scrollToAudit}
                                    className={styles.heroPrimaryBtn}
                                >
                                    <span>START ANALYZING NOW</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => authNavigate(router, '/dashboard')}
                                    className={styles.heroSecondaryBtn}
                                >
                                    <span>EXPLORE CHRONOSX</span>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* 1.6 Centerpiece: Futuristic Holographic Trade Cockpit Stage with 3D Perspective Scroll */}
                <div className="container">
                    <div className={styles.perspectiveWrapper}>
                            <motion.div
                                className={styles.cockpitStage}
                                style={{
                                    rotateX,
                                    scale,
                                    translateY,
                                    opacity,
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "top center"
                                }}
                            >
                                <div className={styles.cockpitFrame}>
                                    <div className={styles.cockpitTopGlow} />

                                    {/* Cockpit Header Bar */}
                                    <div className={styles.cockpitNavHeader}>
                                        <div className={styles.cockpitBrand}>
                                            <span className={styles.cockpitDotGreen} />
                                            <span className={styles.cockpitTitleText}>CHRONOSX // NEURAL AUDITOR COCKPIT</span>
                                        </div>

                                        {/* Quick Preset Selector */}
                                        <div className={styles.cockpitPresetTabs}>
                                            {SAMPLE_TRADES.map((trade) => (
                                                <button
                                                    key={trade.id}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(trade)}
                                                    className={`${styles.tabBtn} ${selectedTrade.id === trade.id ? styles.tabBtnActive : ''}`}
                                                >
                                                    {trade.pair}
                                                </button>
                                            ))}
                                        </div>

                                        <div className={styles.cockpitTelemetryBadge}>
                                            <span>SPEED: <strong>1.2s</strong></span>
                                            <span className={styles.telemetryDivider}>|</span>
                                            <span>ACCURACY: <strong>99.4%</strong></span>
                                        </div>
                                    </div>

                                    {/* Cockpit Interactive 3-Column Display */}
                                    <div className={styles.cockpitBodyGrid}>
                                        {/* 1. Left Telemetry Column */}
                                        <div className={styles.telemetryColLeft}>
                                            <div className={styles.telemetryCard}>
                                                <span className={styles.telemetryLabel}>TRADE OUTCOME</span>
                                                <div className={selectedTrade.result.includes('WIN') ? styles.winBig : styles.lossBig}>
                                                    {selectedTrade.result}
                                                </div>
                                                <div className={styles.lossPct}>{selectedTrade.percent}</div>
                                            </div>

                                            <div className={styles.telemetryCard}>
                                                <span className={styles.telemetryLabel}>EXECUTION SCORE</span>
                                                <div className={styles.scoreRow}>
                                                    <span className={styles.scoreBig}>{selectedTrade.score}</span>
                                                    <span className={styles.scoreMax}>/ 100</span>
                                                </div>
                                                <div className={styles.scoreStatusPill}>
                                                    {selectedTrade.score >= 70 ? 'Grade: Solid' : 'Grade: Needs Improvement'}
                                                </div>
                                            </div>

                                            <div className={styles.telemetryCard}>
                                                <span className={styles.telemetryLabel}>RISK REWARD RATIO</span>
                                                <div className={styles.rrVal}>{selectedTrade.rr}</div>
                                            </div>
                                        </div>

                                        {/* 2. Center: 3D Holographic AI Brain Pedestal with Laser Scan */}
                                        <div className={styles.hologramCenterCol}>
                                            <div className={styles.hologramVisualWrap}>
                                                <Image
                                                    src="/assets/images/ai-past-trade-analyzer/brain-pedestal.jpg"
                                                    alt="AI Holographic Trade Pedestal"
                                                    width={480}
                                                    height={480}
                                                    priority
                                                    className={styles.brainImg}
                                                />
                                                <div className={styles.hologramLaser} />
                                                <div className={styles.hologramVignette} />

                                                {/* Floating Interactive Callout Badges */}
                                                <div className={styles.pinWrongEntry}>
                                                    <span className={styles.pinDotRed} />
                                                    <span>Wrong Entry: {selectedTrade.wrongEntryPrice}</span>
                                                </div>

                                                <div className={styles.pinBetterEntry}>
                                                    <span className={styles.pinDotGreen} />
                                                    <span>Better Entry: {selectedTrade.betterEntryPrice}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Right: Diagnostic Findings & Action Plan */}
                                        <div className={styles.diagnosticColRight}>
                                            <div className={styles.diagHeader}>
                                                <span className={styles.diagBadge}>AI DIAGNOSTIC FINDINGS</span>
                                            </div>

                                            <p className={styles.verdictText}>
                                                “{selectedTrade.verdict}”
                                            </p>

                                            {/* Primary Mistake Item */}
                                            <div className={styles.mistakeHighlightBox}>
                                                <div className={styles.boxTitleRow}>
                                                    <span className={styles.boxDotRed}>✕</span>
                                                    <h5>PRIMARY EXECUTION FLAW</h5>
                                                </div>
                                                <p>{selectedTrade.mistakes[0]}</p>
                                            </div>

                                            {/* Primary Improvement Item */}
                                            <div className={styles.improveHighlightBox}>
                                                <div className={styles.boxTitleRow}>
                                                    <span className={styles.boxDotGreen}>✓</span>
                                                    <h5>ACTIONABLE FIX</h5>
                                                </div>
                                                <p>{selectedTrade.improvements[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* 1.7 3 Value Pillar Bento Cards (Below Cockpit) */}
                        <div className={styles.heroBentoRow}>
                            <div className={styles.heroBentoCard}>
                                <div className={styles.bentoIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                </div>
                                <div className={styles.bentoContent}>
                                    <h4>Instant AI Analysis</h4>
                                    <p>Get detailed execution and risk feedback in seconds.</p>
                                </div>
                            </div>

                            <div className={styles.heroBentoCard}>
                                <div className={styles.bentoIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className={styles.bentoContent}>
                                    <h4>Spot Critical Mistakes</h4>
                                    <p>Identify timing errors, stop-loss flaws &amp; FOMO entries.</p>
                                </div>
                            </div>

                            <div className={styles.heroBentoCard}>
                                <div className={styles.bentoIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>
                                <div className={styles.bentoContent}>
                                    <h4>Improve &amp; Grow</h4>
                                    <p>Actionable insights to level up your trading consistency.</p>
                                </div>
                            </div>
                        </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 2. 3 SIMPLE STEPS */}
            <section className={styles.stepsSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ HOW IT WORKS</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            3 SIMPLE STEPS
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            How ChronosX AI Past Trade Analyzer reviews and upgrades your execution.
                        </p>
                    </div>

                    <div className={styles.stepsGrid}>
                        {/* Step 1 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>01</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>UPLOAD TRADE SCREENSHOT</h3>
                            <p className={styles.stepDesc}>
                                Upload a screenshot of your closed trade from any preferred platform. Your chart. Your execution.
                            </p>
                        </div>

                        {/* Step Connector 1 */}
                        <div className={styles.stepConnector}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Step 2 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>02</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>AI ANALYZES YOUR TRADE</h3>
                            <p className={styles.stepDesc}>
                                Our AI scans your entry, exit, risk management, market structure, and surrounding price context in seconds.
                            </p>
                        </div>

                        {/* Step Connector 2 */}
                        <div className={styles.stepConnector}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Step 3 */}
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumBadge}>03</div>
                            <div className={styles.stepIconBox}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3 className={styles.stepTitle}>GET DETAILED FEEDBACK</h3>
                            <p className={styles.stepDesc}>
                                Receive a complete breakdown with identified execution mistakes, actionable improvements, and tips.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 3. WHAT YOU'LL GET & INTERACTIVE LIVE AUDIT RESULT */}
            <section id="audit-section" className={styles.auditSection}>
                <div className="container">
                    <div className={styles.auditLayout}>
                        {/* LEFT COLUMN: WHAT YOU'LL GET */}
                        <div className={styles.pillarsCol}>
                            <div className={styles.sectionBadge}>
                                <span>✦ POWERFUL ANALYSIS</span>
                            </div>
                            <h2 className={styles.columnTitle}>WHAT YOU'LL GET</h2>
                            <p className={styles.columnSubtitle}>
                                Stop guessing why you lost. Discover exactly what ChronosX analyzes on your chart:
                            </p>

                            <div className={styles.pillarsList}>
                                {/* Pillar 1 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 3v18h18" />
                                            <path d="m19 9-5 5-4-4-3 3" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Trade Breakdown</h4>
                                        <p>Entry, exit, position size, RR, and outcome metrics.</p>
                                    </div>
                                </div>

                                {/* Pillar 2 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Mistake Identification</h4>
                                        <p>AI highlights what went wrong and why instead of just seeing WIN or LOSS.</p>
                                    </div>
                                </div>

                                {/* Pillar 3 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="2" y1="12" x2="22" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Market Context Review</h4>
                                        <p>Understand market conditions, trends, and support/resistance during your trade.</p>
                                    </div>
                                </div>

                                {/* Pillar 4 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Risk Management Check</h4>
                                        <p>Evaluate your risk, lot size, and stop-loss placement.</p>
                                    </div>
                                </div>

                                {/* Pillar 5 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Improvement Tips</h4>
                                        <p>Actionable suggestions to improve your execution on future trades.</p>
                                    </div>
                                </div>

                                {/* Pillar 6 */}
                                <div className={styles.pillarItem}>
                                    <div className={styles.itemIcon}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="6" />
                                            <circle cx="12" cy="12" r="2" />
                                        </svg>
                                    </div>
                                    <div className={styles.itemBody}>
                                        <h4>Overall Score</h4>
                                        <p>Get a performance score and consistency insights.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE INTERACTIVE AUDIT RESULT */}
                        <div className={styles.auditResultCol}>
                            {/* Preset Selector Tabs */}
                            <div className={styles.presetTabsWrap}>
                                <span className={styles.presetLabel}>TRY SAMPLE AUDITS:</span>
                                <div className={styles.presetTabs}>
                                    {SAMPLE_TRADES.map((trade) => (
                                        <button
                                            key={trade.id}
                                            type="button"
                                            onClick={() => handleSelectPreset(trade)}
                                            className={`${styles.presetBtn} ${selectedTrade.id === trade.id ? styles.presetBtnActive : ''}`}
                                        >
                                            {trade.pair}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Audit Glass Card */}
                            <div className={styles.auditCard}>
                                <div className={styles.cardGlowBorder} />

                                {/* Header */}
                                <div className={styles.auditCardHeader}>
                                    <div className={styles.auditCardTitleGroup}>
                                        <span className={styles.auditHeaderTag}>ANALYSIS RESULT</span>
                                        <h3 className={styles.auditPairTitle}>
                                            {selectedTrade.title} <span className={styles.tfBadge}>{selectedTrade.timeframe}</span>
                                        </h3>
                                    </div>
                                    <div className={styles.liveIndicator}>
                                        <span className={styles.pulseDot} />
                                        <span>AI AUDIT V3.2</span>
                                    </div>
                                </div>

                                {/* Scanning Overlay */}
                                <AnimatePresence>
                                    {isScanning && (
                                        <motion.div
                                            className={styles.scanningOverlay}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className={styles.scannerAnimationBox}>
                                                <div className={styles.scanSpinner} />
                                                <h4>AI NEURAL AUDIT IN PROGRESS</h4>
                                                <p>Analyzing candlestick wicks, order blocks &amp; risk-to-reward ratio...</p>
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

                                {/* Visual Annotated Chart Simulation Box */}
                                <div className={styles.chartVisualStage}>
                                    {/* Candlestick SVG Simulation */}
                                    <svg className={styles.candlestickSvg} viewBox="0 0 600 240" fill="none">
                                        {/* Grid Lines */}
                                        <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                        <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                        <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                                        {/* Stop Loss Red Zone */}
                                        <rect x="360" y="50" width="180" height="45" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="4 4" rx="4" />
                                        <text x="370" y="75" fill="#EF4444" fontSize="10.5" fontWeight="700">STOP LOSS TRIGGERED</text>

                                        {/* Better Take Profit Green Zone */}
                                        <rect x="360" y="140" width="180" height="70" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="4 4" rx="4" />
                                        <text x="370" y="175" fill="#10B981" fontSize="10.5" fontWeight="700">OPTIMAL TARGET ZONE</text>

                                        {/* Candlesticks sequence */}
                                        <line x1="40" y1="140" x2="40" y2="200" stroke="#10B981" strokeWidth="2" />
                                        <rect x="34" y="150" width="12" height="35" fill="#10B981" rx="1" />

                                        <line x1="75" y1="120" x2="75" y2="180" stroke="#10B981" strokeWidth="2" />
                                        <rect x="69" y="130" width="12" height="40" fill="#10B981" rx="1" />

                                        <line x1="110" y1="90" x2="110" y2="160" stroke="#10B981" strokeWidth="2" />
                                        <rect x="104" y="100" width="12" height="45" fill="#10B981" rx="1" />

                                        <line x1="145" y1="100" x2="145" y2="170" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="139" y="110" width="12" height="45" fill="#EF4444" rx="1" />

                                        <line x1="180" y1="130" x2="180" y2="195" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="174" y="145" width="12" height="35" fill="#EF4444" rx="1" />

                                        <line x1="215" y1="110" x2="215" y2="185" stroke="#10B981" strokeWidth="2" />
                                        <rect x="209" y="125" width="12" height="40" fill="#10B981" rx="1" />

                                        <line x1="250" y1="80" x2="250" y2="155" stroke="#10B981" strokeWidth="2" />
                                        <rect x="244" y="95" width="12" height="45" fill="#10B981" rx="1" />

                                        <line x1="285" y1="90" x2="285" y2="175" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="279" y="105" width="12" height="50" fill="#EF4444" rx="1" />

                                        <line x1="320" y1="130" x2="320" y2="210" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="314" y="145" width="12" height="50" fill="#EF4444" rx="1" />

                                        <line x1="355" y1="65" x2="355" y2="170" stroke="#EF4444" strokeWidth="2.5" />
                                        <rect x="349" y="80" width="12" height="40" fill="#EF4444" rx="1" />

                                        <line x1="390" y1="110" x2="390" y2="190" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="384" y="125" width="12" height="50" fill="#EF4444" rx="1" />

                                        <line x1="425" y1="140" x2="425" y2="220" stroke="#10B981" strokeWidth="2" />
                                        <rect x="419" y="155" width="12" height="45" fill="#10B981" rx="1" />
                                    </svg>

                                    {/* Annotated Badge: Wrong Entry */}
                                    <div className={styles.wrongEntryCallout}>
                                        <div className={styles.calloutPillRed}>
                                            <span>Wrong Entry</span>
                                        </div>
                                        <div className={styles.calloutPointerRed} />
                                    </div>

                                    {/* Annotated Badge: Better Entry */}
                                    <div className={styles.betterEntryCallout}>
                                        <div className={styles.calloutPointerGreen} />
                                        <div className={styles.calloutPillGreen}>
                                            <span>Better Entry</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantitative Score & Metrics Bar */}
                                <div className={styles.metricsBar}>
                                    {/* Metric 1 */}
                                    <div className={styles.metricItem}>
                                        <span className={styles.metricLabel}>RESULT</span>
                                        <span className={selectedTrade.result.includes('WIN') ? styles.winResult : styles.lossResult}>
                                            {selectedTrade.result} ({selectedTrade.percent})
                                        </span>
                                    </div>

                                    <div className={styles.metricDivider} />

                                    {/* Metric 2 */}
                                    <div className={styles.metricItem}>
                                        <span className={styles.metricLabel}>RISK REWARD</span>
                                        <span className={styles.metricVal}>{selectedTrade.rr}</span>
                                    </div>

                                    <div className={styles.metricDivider} />

                                    {/* Metric 3 */}
                                    <div className={styles.metricItem}>
                                        <span className={styles.metricLabel}>SCORE</span>
                                        <div className={styles.scoreWrap}>
                                            <span className={styles.scoreNumber}>{selectedTrade.score}</span>
                                            <span className={styles.scoreOutOf}>/ 100</span>
                                            <span className={styles.scoreTag}>
                                                {selectedTrade.score >= 70 ? 'Good' : 'Average'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bento Breakdown: What Went Wrong vs How to Improve */}
                                <div className={styles.auditBentoGrid}>
                                    {/* 1. What Went Wrong */}
                                    <div className={styles.bentoCardWrong}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoIconRed}>✕</span>
                                            <h4>WHAT WENT WRONG</h4>
                                        </div>
                                        <ul className={styles.bentoList}>
                                            {selectedTrade.mistakes.map((item, idx) => (
                                                <li key={idx}>
                                                    <span className={styles.bulletRed}>✗</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* 2. How To Improve */}
                                    <div className={styles.bentoCardImprove}>
                                        <div className={styles.bentoHeader}>
                                            <span className={styles.bentoIconGreen}>✓</span>
                                            <h4>HOW TO IMPROVE</h4>
                                        </div>
                                        <ul className={styles.bentoList}>
                                            {selectedTrade.improvements.map((item, idx) => (
                                                <li key={idx}>
                                                    <span className={styles.bulletGreen}>✓</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Coach Philosophy Note */}
                                <div className={styles.auditFooterNote}>
                                    <span className={styles.goldQuoteIcon}>“</span>
                                    <p>The goal isn't to blame the trader. It's to make the next trade better.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* 4. BOTTOM CALL TO ACTION BANNER */}
            <motion.section
                className={styles.ctaBannerSection}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaGlow} />

                        <div className={styles.ctaContent}>
                            <div className={styles.ctaRocketIcon}>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                </svg>
                            </div>
                            <div className={styles.ctaTextWrap}>
                                <h2 className={styles.ctaTitle}>
                                    TURN YOUR PAST TRADES INTO FUTURE PROFITS
                                </h2>
                                <p className={styles.ctaSubtitle}>
                                    Stop repeating the same mistakes. Let AI guide you to become a better, smarter, and more consistent trader.
                                </p>
                            </div>
                        </div>

                        <div className={styles.ctaActions}>
                            <motion.button
                                type="button"
                                onClick={scrollToAudit}
                                className={styles.ctaPrimaryBtn}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>START YOUR ANALYSIS</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authNavigate } from '@/lib/authRedirect';
import { toast } from '@/components/toast';
import styles from './aiChat.module.scss';

// Pre-built Quick Prompts Data
const QUICK_PROMPTS = [
    {
        id: 'market-analysis',
        category: 'Market Analysis',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
                <circle cx="19" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: 'H1 OUTLOOK',
        presetText: "What is the current technical outlook and key support/resistance levels for XAUUSD (Gold) on H1?",
        demoData: {
            pair: 'XAUUSD (Gold)',
            timeframe: 'H1 (1-Hour)',
            userPrompt: "What is the current technical outlook and key support/resistance levels for XAUUSD (Gold) on H1?",
            title: "XAUUSD H1 Technical Outlook & Key Levels",
            price: "2,742.50",
            trend: "Bullish (Trading above EMA 20 & 50)",
            trendType: "bullish",
            resistance: "R1 = 2,748.10 | R2 = 2,755.00",
            support: "S1 = 2,738.00 | S2 = 2,730.50",
            setup: {
                entryZone: "2,740.00 - 2,742.00 (Pullback to 20 EMA)",
                stopLoss: "2,734.50 (Below S1 support)",
                takeProfit1: "2,748.00",
                takeProfit2: "2,755.00",
                rrr: "1 : 2.3",
            },
            indicators: [
                { name: 'EMA 20/50', status: 'Golden Cross (Bullish)', val: '2,738.20 / 2,732.10' },
                { name: 'RSI (14)', status: '58.4 (Healthy Momentum)', val: 'Bullish Zone' },
                { name: 'SuperTrend', status: 'Green (Bullish Trend)', val: 'Support @ 2,735.00' }
            ],
            note: "Keep an eye on upcoming High-Impact USD Economic Data (Core PPI & Fed Speech)."
        }
    },
    {
        id: 'risk-management',
        category: 'Risk Management',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        badge: 'QUANT CALC',
        presetText: "Calculate optimal position size for EURUSD with a $10,000 account, 1.5% risk, and a 25-pip Stop Loss.",
        demoData: {
            pair: 'EURUSD (Euro)',
            timeframe: 'Position Sizing Audit',
            userPrompt: "Calculate optimal position size for EURUSD with a $10,000 account, 1.5% risk, and a 25-pip Stop Loss.",
            title: "EURUSD Institutional Risk & Position Sizing Breakdown",
            price: "1.08450",
            trend: "Neutral / Range-Bound",
            trendType: "neutral",
            resistance: "R1 = 1.08800 | R2 = 1.09250",
            support: "S1 = 1.08200 | S2 = 1.07900",
            setup: {
                entryZone: "1.08450 (Market Execution)",
                stopLoss: "1.08200 (25 Pips)",
                takeProfit1: "1.08950 (50 Pips)",
                takeProfit2: "1.09450 (100 Pips)",
                rrr: "1 : 2.0 (TP1) | 1 : 4.0 (TP2)",
            },
            calcMetrics: {
                accountBalance: "$10,000.00",
                riskPercent: "1.50%",
                dollarRisk: "$150.00",
                stopLossPips: "25 Pips",
                recommendedLots: "0.60 Lots (60,000 Units)",
                pipValue: "$6.00 / Pip"
            },
            note: "Position strictly limited to $150.00 max risk to preserve capital across multiple drawdowns."
        }
    },
    {
        id: 'indicator-signal',
        category: 'Indicator Signal',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        badge: 'SUPER TREND & EMA',
        presetText: "Are EMA 20/50 crossovers and SuperTrend aligned bullish or bearish on GBPUSD right now?",
        demoData: {
            pair: 'GBPUSD (Cable)',
            timeframe: '15M & H1 Confluence',
            userPrompt: "Are EMA 20/50 crossovers and SuperTrend aligned bullish or bearish on GBPUSD right now?",
            title: "GBPUSD Indicator Confluence & Alignment Scan",
            price: "1.29680",
            trend: "Strong Bullish Confluence (Triple Alignment)",
            trendType: "bullish",
            resistance: "R1 = 1.30150 | R2 = 1.30600",
            support: "S1 = 1.29400 | S2 = 1.29050",
            setup: {
                entryZone: "1.29650 - 1.29700 (Breakout Continuation)",
                stopLoss: "1.29350 (Below SuperTrend Line)",
                takeProfit1: "1.30150 (Key Resistance)",
                takeProfit2: "1.30600 (Daily Liquidity Pool)",
                rrr: "1 : 2.6",
            },
            indicators: [
                { name: 'EMA 20/50 (H1)', status: 'Bullish Crossover (EMA 20 > 50)', val: '1.29520 / 1.29380' },
                { name: 'SuperTrend (10,3)', status: 'BUY Signal Active (Green Cloud)', val: 'Trailing @ 1.29350' },
                { name: 'Volume Profile', status: 'High Buying Volume Delta (+64%)', val: 'Institutional Inflow' }
            ],
            note: "Confirmed momentum alignment on both 15M and H1 timeframes with low counter-trend pressure."
        }
    },
    {
        id: 'news-impact',
        category: 'News Impact',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        badge: 'MACRO EVENT',
        presetText: "How is today's US NFP data expected to impact market volatility across Forex major pairs?",
        demoData: {
            pair: 'Macro / FX Majors',
            timeframe: 'US NFP Release Analysis',
            userPrompt: "How is today's US NFP data expected to impact market volatility across Forex major pairs?",
            title: "US Non-Farm Payrolls (NFP) Macro Volatility Forecast",
            price: "DXY Index: 104.15",
            trend: "Pre-Release Consolidation / High Volatility Pending",
            trendType: "neutral",
            resistance: "DXY Resistance: 104.80",
            support: "DXY Support: 103.60",
            setup: {
                entryZone: "Wait 15 mins post-release for initial spread normalization",
                stopLoss: "Wider buffer required (35-40 pips)",
                takeProfit1: "Opposite liquidity pool sweep",
                takeProfit2: "Daily range expansion target",
                rrr: "1 : 3.0",
            },
            indicators: [
                { name: 'Expected NFP', status: 'Forecast: 185K (Prev: 172K)', val: 'Higher = Bullish USD' },
                { name: 'Unemployment Rate', status: 'Expected: 4.1%', val: 'Key Fed Metric' },
                { name: 'Average Hourly Earnings', status: 'MoM +0.3% Forecast', val: 'Inflation Catalyst' }
            ],
            note: "Expect 40-90 pip instantaneous spikes across EURUSD, GBPUSD, and Gold (XAUUSD) at release."
        }
    }
];

// 4 Core Key Features Data
const KEY_FEATURES = [
    {
        number: "01",
        title: "Real-Time MT5 Data Precision",
        desc: "Connected directly to MetaTrader 5 terminal feeds, our AI Chat delivers zero-delay price quotes, tick-level analytics, and live market depth without third-party delays.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        badge: "0-DELAY STREAM",
        statLabel: "Data Latency",
        statValue: "< 15ms"
    },
    {
        number: "02",
        title: "Advanced Technical Indicator Breakdown",
        desc: "Get instant multi-indicator evaluations including Exponential Moving Averages (EMA 20/50/200), SuperTrend, RSI momentum, Fibonacci retracements, and Pivot Points.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 2 5-6" />
                <circle cx="7" cy="14" r="1.5" fill="currentColor" />
                <circle cx="11" cy="10" r="1.5" fill="currentColor" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                <circle cx="20" cy="6" r="1.5" fill="currentColor" />
            </svg>
        ),
        badge: "QUANT ALGORITHMS",
        statLabel: "Indicator Library",
        statValue: "45+ Models"
    },
    {
        number: "03",
        title: "Institutional Risk Management & Calculator",
        desc: "Protect your capital with smart position sizing recommendations, dynamic Stop-Loss (SL) placing, Take-Profit (TP) target structures, and strict Risk-to-Reward (RRR) enforcement.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="3" />
            </svg>
        ),
        badge: "CAPITAL SHIELD",
        statLabel: "Math Precision",
        statValue: "100.0%"
    },
    {
        number: "04",
        title: "Pattern Recognition & Trade Setup Generator",
        desc: "Identify key candlestick structures, liquidity sweeps, order blocks, and chart breakout signals across Forex, Metals, and Crypto pairs.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        badge: "NEURAL PATTERNS",
        statLabel: "Recognition Speed",
        statValue: "0.8 Sec"
    }
];

// Comparison Matrix Data
const COMPARISON_DATA = [
    {
        feature: "Live MT5 Price Stream",
        generic: { status: 'cross', text: "No (Outdated static knowledge cutoffs)" },
        chronosx: { status: 'check', text: "Direct MT5 Integration (Real-time live tick stream)" },
        highlight: true
    },
    {
        feature: "Exact Pip & Lot Calculations",
        generic: { status: 'warn', text: "Unreliable (Frequent math hallucinations)" },
        chronosx: { status: 'check', text: "100% Precision Math (Strict broker contract sizing)" },
        highlight: true
    },
    {
        feature: "Custom FX Indicators",
        generic: { status: 'cross', text: "No (Guesses from outdated web text)" },
        chronosx: { status: 'check', text: "EMAs, SuperTrend & Pivots (Computed live on chart)" },
        highlight: true
    },
    {
        feature: "Zero Delay Execution Setup",
        generic: { status: 'cross', text: "No (No real-time market depth)" },
        chronosx: { status: 'check', text: "Real-Time Data & Precise Entry/SL/TP Structures" },
        highlight: true
    },
    {
        feature: "Institutional Risk:Reward Enforcement",
        generic: { status: 'warn', text: "Basic text advice without sizing rules" },
        chronosx: { status: 'check', text: "Strict Capital Preservation & Dynamic RRR Rules" },
        highlight: false
    },
    {
        feature: "Multi-Timeframe Confluence",
        generic: { status: 'cross', text: "Limited to single-view context" },
        chronosx: { status: 'check', text: "Simultaneous M1, M15, H1, H4 & Daily Analysis" },
        highlight: false
    }
];

// FAQ Accordion Data
const FAQS = [
    {
        question: "How does the AI Chat analyze forex markets?",
        answer: "Our AI model reads live tick and candle data directly from MT5 terminals, combining institutional technical indicators (EMAs, RSI, Pivots, SuperTrend) with quantitative risk management models to give clear, actionable insights."
    },
    {
        question: "Can the AI calculate my lot size and risk per trade?",
        answer: "Absolutely. Simply tell the AI your account balance, risk percentage (e.g., 1% or 2%), and stop-loss pips, and it will immediately calculate your exact recommended lot size and dollar risk."
    },
    {
        question: "Is the market data delayed?",
        answer: "No. Unlike standard AI models with static data cutoff dates, our AI Chat is connected live to institutional MetaTrader 5 feeds, ensuring instant price transparency."
    },
    {
        question: "What currency pairs and asset classes are supported?",
        answer: "ChronosX AI Chat supports all major, minor, and exotic Forex currency pairs (EURUSD, GBPUSD, USDJPY, AUDUSD, etc.), precious metals (XAUUSD Gold, XAGUSD Silver), energies (USOIL, UKOIL), and top cryptocurrencies (BTCUSD, ETHUSD)."
    },
    {
        question: "Do I need coding experience or manual MT5 configuration?",
        answer: "None at all. ChronosX handles all server-side MT5 terminal routing and algorithmic analysis automatically in the cloud. You interact through a clean, conversational natural-language chat interface."
    }
];

export default function AiChat() {
    const router = useRouter();
    const [selectedPrompt, setSelectedPrompt] = useState(QUICK_PROMPTS[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const demoRef = useRef(null);

    const handleSelectPrompt = (promptItem) => {
        setIsGenerating(true);
        setSelectedPrompt(promptItem);
        setCustomInput('');

        // Smooth scroll to demo section
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`Loaded ${promptItem.category} AI Setup!`);
        }, 350);
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;

        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            toast.success('Generated response for your custom prompt!');
        }, 500);
    };

    const handleCopySetup = () => {
        const text = `${selectedPrompt.demoData.title}
Pair: ${selectedPrompt.demoData.pair}
Price: ${selectedPrompt.demoData.price}
Trend: ${selectedPrompt.demoData.trend}
Resistance: ${selectedPrompt.demoData.resistance}
Support: ${selectedPrompt.demoData.support}
Entry Zone: ${selectedPrompt.demoData.setup.entryZone}
Stop Loss: ${selectedPrompt.demoData.setup.stopLoss}
Take Profit 1: ${selectedPrompt.demoData.setup.takeProfit1}
Take Profit 2: ${selectedPrompt.demoData.setup.takeProfit2}
RRR: ${selectedPrompt.demoData.setup.rrr}
Note: ${selectedPrompt.demoData.note}`;

        navigator.clipboard.writeText(text);
        toast.success('Trade setup copied to clipboard!');
    };

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Ambient Atmosphere Background Glows */}
            <div className={styles.ambientTopGlow} aria-hidden="true" />
            <div className={styles.ambientCenterGlow} aria-hidden="true" />
            <div className={styles.ambientBottomGlow} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 1. PAGE HEADER & HERO SECTION */}
            {/* ========================================================================= */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroCenterWrapper}>
                        {/* Top Telemetry Live Pill */}
                        <motion.div
                            className={styles.statusPillRow}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.statusPill}>
                                <span className={styles.pillText}>Institutional AI Trading Desk</span>
                                <span className={styles.pillBadge}>0-DELAY TICK STREAM</span>
                            </div>
                        </motion.div>

                        {/* Main Cinematic H1 */}
                        <motion.h1
                            className={styles.heroMainTitle}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Your 24/7 AI-Powered <br />
                            <span className={styles.goldGradient}>Institutional Forex &amp; Trading Copilot</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Ask questions, analyze real-time market trends, calculate precise risk management parameters, and receive instant data-driven trade setups powered by live MetaTrader 5 (MT5) market feeds.
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
                                onClick={() => authNavigate(router, '/ai-assistant')}
                                className={styles.heroPrimaryBtn}
                            >
                                <span>LAUNCH AI CHAT NOW</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className={styles.heroSecondaryBtn}
                            >
                                <span>VIEW LIVE DEMO</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </button>
                        </motion.div>

                        {/* ========================================================================= */}
                        {/* 2. TOP BANNER / VALUE PROPOSITION BADGES (3 CARDS) */}
                        {/* ========================================================================= */}
                        <motion.div
                            className={styles.valueBadgesRow}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {/* Card 1: Institutional Technical Analysis */}
                            <div className={styles.valueBadgeCard}>
                                <div className={styles.badgeIconWrap}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                        <line x1="12" y1="2" x2="12" y2="4" />
                                        <line x1="12" y1="20" x2="12" y2="22" />
                                        <line x1="2" y1="12" x2="4" y2="12" />
                                        <line x1="20" y1="12" x2="22" y2="12" />
                                    </svg>
                                </div>
                                <div className={styles.badgeContent}>
                                    <h4>Institutional Technical Analysis</h4>
                                    <p>EMAs, SuperTrend &amp; Pivot Point engines</p>
                                </div>
                            </div>

                            {/* Card 2: Automated Risk & Position Sizing */}
                            <div className={styles.valueBadgeCard}>
                                <div className={`${styles.badgeIconWrap} ${styles.iconGreen}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <polyline points="9 12 11 14 15 10" />
                                    </svg>
                                </div>
                                <div className={styles.badgeContent}>
                                    <h4>Automated Risk &amp; Position Sizing</h4>
                                    <p>Capital preservation &amp; strict RRR logic</p>
                                </div>
                            </div>

                            {/* Card 3: Multi-Timeframe Trend Insights */}
                            <div className={styles.valueBadgeCard}>
                                <div className={`${styles.badgeIconWrap} ${styles.iconAmber}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                        <path d="M4 8l4-4 4 3 6-5" />
                                    </svg>
                                </div>
                                <div className={styles.badgeContent}>
                                    <h4>Multi-Timeframe Trend Insights</h4>
                                    <p>From M1/M15 scalps to H4/Daily swing models</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 3. PRE-BUILT QUICK PROMPT CARDS (UI QUICK-STARTERS) */}
            {/* ========================================================================= */}
            <section className={styles.quickPromptsSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ INSTANT CLICKABLE PROMPTS</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            PRE-BUILT QUICK PROMPT STARTERS
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Click any institutional prompt idea below to test live in our interactive AI Copilot engine:
                        </p>
                    </div>

                    <div className={styles.promptsGrid}>
                        {QUICK_PROMPTS.map((item, index) => {
                            const isSelected = selectedPrompt.id === item.id;
                            return (
                                <motion.div
                                    key={item.id}
                                    className={`${styles.promptCard} ${isSelected ? styles.promptCardActive : ''}`}
                                    onClick={() => handleSelectPrompt(item)}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                >
                                    <div className={styles.promptCardTop}>
                                        <div className={styles.promptIconBox}>
                                            {item.icon}
                                        </div>
                                        <span className={styles.promptBadge}>{item.badge}</span>
                                    </div>

                                    <h3 className={styles.promptCategory}>{item.category}</h3>
                                    <p className={styles.promptText}>&ldquo;{item.presetText}&rdquo;</p>

                                    <div className={styles.promptCardFooter}>
                                        <span className={styles.actionPromptText}>
                                            {isSelected ? 'Currently Loaded in Demo' : 'Click to Load in AI Demo'}
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 5. LIVE INTERACTIVE CHAT DEMO (SAMPLE PREVIEW UI BOX) */}
            {/* ========================================================================= */}
            <section ref={demoRef} id="live-demo" className={styles.liveDemoSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ LIVE INTERACTIVE CHAT DEMO</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            EXPERIENCE THE AI COPILOT IN ACTION
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Inspect zero-delay price quotes, automated support/resistance levels, and calculated risk-to-reward setups.
                        </p>
                    </div>

                    {/* Interactive Cockpit Container */}
                    <div className={styles.terminalCockpit}>
                        {/* Terminal Top Window Bar */}
                        <div className={styles.terminalHeader}>
                            <div className={styles.terminalControls}>
                                <span className={`${styles.dot} ${styles.dotRed}`} />
                                <span className={`${styles.dot} ${styles.dotYellow}`} />
                                <span className={`${styles.dot} ${styles.dotGreen}`} />
                                <span className={styles.terminalBrand}>
                                    CHRONOSX // AI TRADING COPILOT TERMINAL
                                </span>
                            </div>

                            {/* Preset Tabs Switcher */}
                            <div className={styles.terminalTabs}>
                                {QUICK_PROMPTS.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelectPrompt(p)}
                                        className={`${styles.termTabBtn} ${selectedPrompt.id === p.id ? styles.termTabActive : ''}`}
                                    >
                                        {p.demoData.pair}
                                    </button>
                                ))}
                            </div>


                        </div>

                        {/* Terminal Chat Stream Area */}
                        <div className={styles.chatStreamArea}>
                            {/* 1. Trader Question Bubble */}
                            <div className={styles.traderMessageRow}>
                                <div className={styles.traderAvatar}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <div className={styles.traderBubble}>
                                    <div className={styles.bubbleSender}>Trader</div>
                                    <p className={styles.bubbleText}>
                                        &ldquo;{selectedPrompt.demoData.userPrompt}&rdquo;
                                    </p>
                                </div>
                            </div>

                            {/* 2. AI Assistant Structured Institutional Setup */}
                            <div className={styles.aiMessageRow}>
                                <div className={styles.aiAvatar}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <circle cx="12" cy="5" r="2" />
                                        <path d="M12 7v4" />
                                        <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
                                        <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
                                    </svg>
                                </div>
                                <div className={styles.aiResponseCard}>
                                    <div className={styles.aiCardHeader}>
                                        <div className={styles.aiSenderInfo}>
                                            <span className={styles.aiName}>AI Assistant</span>
                                            <span className={styles.aiTag}>QUANT COPILOT</span>
                                            <span className={styles.aiPairBadge}>{selectedPrompt.demoData.pair}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCopySetup}
                                            className={styles.copyBtn}
                                            title="Copy Trade Setup to Clipboard"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                            <span>Copy Setup</span>
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isGenerating ? (
                                            <motion.div
                                                key="loader"
                                                className={styles.aiGeneratingBox}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className={styles.typingIndicator}>
                                                    <span />
                                                    <span />
                                                    <span />
                                                </div>
                                                <p>Analyzing live MT5 tick streams &amp; computing optimal parameters...</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="content"
                                                className={styles.aiSetupContent}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* Main Setup Title */}
                                                <div className={styles.setupTitleRow}>
                                                    <div className={styles.setupTitleIconBox}>
                                                        {selectedPrompt.icon}
                                                    </div>
                                                    <h4 className={styles.setupTitle}>
                                                        {selectedPrompt.demoData.title}
                                                    </h4>
                                                </div>

                                                {/* Core Market Telemetry Grid */}
                                                <div className={styles.telemetryGrid}>
                                                    <div className={styles.telemetryItem}>
                                                        <span className={styles.telLabel}>Current Live Price</span>
                                                        <span className={styles.telPrice}>{selectedPrompt.demoData.price}</span>
                                                    </div>

                                                    <div className={styles.telemetryItem}>
                                                        <span className={styles.telLabel}>Trend Direction</span>
                                                        <span className={selectedPrompt.demoData.trendType === 'bullish' ? styles.telBullish : styles.telNeutral}>
                                                            ● {selectedPrompt.demoData.trend}
                                                        </span>
                                                    </div>

                                                    <div className={styles.telemetryItem}>
                                                        <span className={styles.telLabel}>Resistance Levels</span>
                                                        <span className={styles.telVal}>{selectedPrompt.demoData.resistance}</span>
                                                    </div>

                                                    <div className={styles.telemetryItem}>
                                                        <span className={styles.telLabel}>Support Levels</span>
                                                        <span className={styles.telVal}>{selectedPrompt.demoData.support}</span>
                                                    </div>
                                                </div>

                                                {/* Execution & Risk-to-Reward Plan Card */}
                                                <div className={styles.tradePlanBox}>
                                                    <div className={styles.planHeader}>
                                                        <div className={styles.targetIconBox}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <circle cx="12" cy="12" r="6" />
                                                                <circle cx="12" cy="12" r="2" />
                                                            </svg>
                                                        </div>
                                                        <h5>TRADE SETUP PLAN:</h5>
                                                    </div>

                                                    <div className={styles.planItemsGrid}>
                                                        <div className={styles.planRow}>
                                                            <span className={styles.planKey}>Entry Zone:</span>
                                                            <span className={styles.planValHighlight}>{selectedPrompt.demoData.setup.entryZone}</span>
                                                        </div>

                                                        <div className={styles.planRow}>
                                                            <span className={styles.planKey}>Stop Loss:</span>
                                                            <span className={styles.planValSl}>{selectedPrompt.demoData.setup.stopLoss}</span>
                                                        </div>

                                                        <div className={styles.planRow}>
                                                            <span className={styles.planKey}>Take Profit 1:</span>
                                                            <span className={styles.planValTp}>{selectedPrompt.demoData.setup.takeProfit1}</span>
                                                        </div>

                                                        <div className={styles.planRow}>
                                                            <span className={styles.planKey}>Take Profit 2:</span>
                                                            <span className={styles.planValTp}>{selectedPrompt.demoData.setup.takeProfit2}</span>
                                                        </div>

                                                        <div className={styles.planRow}>
                                                            <span className={styles.planKey}>Risk-Reward Ratio:</span>
                                                            <span className={styles.planValRrr}>{selectedPrompt.demoData.setup.rrr}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Optional Indicator or Risk Calc Breakdown */}
                                                {selectedPrompt.demoData.calcMetrics && (
                                                    <div className={styles.calcBreakdownBox}>
                                                        <div className={styles.calcHeader}>
                                                            <div className={styles.calcIconBox}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                                    <polyline points="9 12 11 14 15 10" />
                                                                </svg>
                                                            </div>
                                                            <h5>POSITION SIZING &amp; MATHEMATICAL AUDIT</h5>
                                                        </div>
                                                        <div className={styles.calcGrid}>
                                                            <div className={styles.calcItem}>
                                                                <span>Balance:</span>
                                                                <strong>{selectedPrompt.demoData.calcMetrics.accountBalance}</strong>
                                                            </div>
                                                            <div className={styles.calcItem}>
                                                                <span>Risk Allocation:</span>
                                                                <strong>{selectedPrompt.demoData.calcMetrics.riskPercent} ({selectedPrompt.demoData.calcMetrics.dollarRisk})</strong>
                                                            </div>
                                                            <div className={styles.calcItem}>
                                                                <span>Stop Loss:</span>
                                                                <strong>{selectedPrompt.demoData.calcMetrics.stopLossPips}</strong>
                                                            </div>
                                                            <div className={styles.calcItem}>
                                                                <span>Exact Lot Size:</span>
                                                                <strong className={styles.lotHighlight}>{selectedPrompt.demoData.calcMetrics.recommendedLots}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedPrompt.demoData.indicators && (
                                                    <div className={styles.indicatorsRow}>
                                                        {selectedPrompt.demoData.indicators.map((ind, i) => (
                                                            <div key={i} className={styles.indPill}>
                                                                <span className={styles.indName}>{ind.name}:</span>
                                                                <span className={styles.indStatus}>{ind.status}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Critical Economic Notice */}
                                                <div className={styles.alertNoteBox}>
                                                    <div className={styles.alertIconBox}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                            <line x1="12" y1="9" x2="12" y2="13" />
                                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                                        </svg>
                                                    </div>
                                                    <p>
                                                        <strong>Note:</strong> {selectedPrompt.demoData.note}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Input Command Bar */}
                        <div className={styles.terminalInputBar}>
                            <form onSubmit={handleCustomSubmit} className={styles.inputForm}>
                                <div className={styles.inputPrefix}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type your trading question or pair analysis request here..."
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className={styles.chatInputField}
                                />
                                <button
                                    type="button"
                                    onClick={() => authNavigate(router, '/ai-assistant')}
                                    className={styles.launchFullDeskBtn}
                                >
                                    <span>Open in Live AI Desk</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DIVIDER */}
            <div className={styles.sectionDivider} aria-hidden="true" />

            {/* ========================================================================= */}
            {/* 4. KEY FEATURES & CAPABILITIES */}
            {/* ========================================================================= */}
            <section className={styles.capabilitiesSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ QUANTITATIVE CAPABILITIES</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            ENGINEERED FOR INSTITUTIONAL ACCURACY
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Built specifically for traders who demand real-time data feeds, strict risk models, and reliable execution.
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
            {/* 6. WHY USE OUR AI TRADING ASSISTANT? (COMPARISON TABLE) */}
            {/* ========================================================================= */}
            <section className={styles.comparisonSection}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <div className={styles.sectionBadge}>
                            <span>✦ SYSTEM COMPARISON MATRIX</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            WHY USE OUR SPECIALIZED AI COPILOT?
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            See how ChronosX compares against generic, uncalibrated language models in live trading conditions.
                        </p>
                    </div>

                    <div className={styles.tableCard}>
                        <div className={styles.tableResponsive}>
                            <table className={styles.comparisonTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.thFeature}>CORE CAPABILITY</th>
                                        <th className={styles.thGeneric}>GENERIC CHATBOTS (ChatGPT / Free AI)</th>
                                        <th className={styles.thChronosX}>
                                            <div className={styles.chronosHeaderBadge}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#F4D17A" fillOpacity="0.3" />
                                                </svg>
                                                <span>OUR SPECIALIZED AI COPILOT</span>
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
                                            <td className={styles.tdGeneric}>
                                                <div className={styles.statusRow}>
                                                    {row.generic.status === 'cross' && (
                                                        <span className={styles.statusIconCross}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    {row.generic.status === 'warn' && (
                                                        <span className={styles.statusIconWarn}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    <span className={styles.genericText}>{row.generic.text}</span>
                                                </div>
                                            </td>
                                            <td className={styles.tdChronosX}>
                                                <div className={styles.chronosTextWrap}>
                                                    <span className={styles.statusIconCheck}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>
                                                    <span className={styles.chronosText}>{row.chronosx.text}</span>
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
                            Everything you need to know about ChronosX AI Chat, MT5 feeds, and risk calculation.
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
                            <span>✦ ZERO-LATENCY AI TRADING INTELLIGENCE</span>
                        </div>

                        <h2 className={styles.ctaTitle}>
                            Start Chatting with Your <br />
                            <span className={styles.goldGradient}>AI Copilot Today</span>
                        </h2>

                        <p className={styles.ctaDesc}>
                            Transform market noise into high-probability trading decisions in seconds.
                        </p>

                        <div className={styles.ctaButtonsGroup}>
                            <button
                                type="button"
                                onClick={() => authNavigate(router, '/ai-assistant')}
                                className={styles.ctaPrimaryBtn}
                            >
                                <span>LAUNCH AI CHAT NOW</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className={styles.ctaSecondaryBtn}
                            >
                                <span>VIEW LIVE DEMO</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

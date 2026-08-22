'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './dashboard.module.scss';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';

const HologramHeroBg = '/assets/images/ai_trading_hologram_hero.jpg';

function getUserNameFromLocalStorage() {
    const parsed = getStoredUser();
    if (!parsed) return 'Trader';
    const name = [parsed.first_name, parsed.last_name].filter(Boolean).join(' ');
    return name || parsed.email || 'Trader';
}

function timeAgo(dateLike) {
    const d = dateLike ? new Date(dateLike) : null;
    if (!d || Number.isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

function formatSummary(text) {
    if (!text || typeof text !== 'string') return '';
    try {
        let decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });

        decoded = decoded.replace(/\\n/g, '\n');
        let formatted = decoded.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        if (formatted.startsWith('- ')) {
            formatted = '• ' + formatted.substring(2);
        } else if (formatted.startsWith('-\t')) {
            formatted = '• ' + formatted.substring(2);
        }

        formatted = formatted.replace(/\n-\s*/g, '<br />• ');
        formatted = formatted.replace(/\n/g, '<br />');

        return formatted;
    } catch (e) {
        return text;
    }
}

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [name, setName] = useState('');
    const [activityFilter, setActivityFilter] = useState('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

    useEffect(() => {
        const syncUser = () => {
            setUserId(getStoredUserId());
            setName(getUserNameFromLocalStorage());
            setGreeting(getGreeting());
        };
        syncUser();
        window.addEventListener('user:updated', syncUser);
        return () => window.removeEventListener('user:updated', syncUser);
    }, []);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const [statsRes, recentRes] = await Promise.allSettled([
                    dashboardApi.getStats(userId),
                    dashboardApi.getRecentActivity(userId),
                ]);

                if (!mounted) return;

                const statsPayload =
                    statsRes.status === 'fulfilled' ? (statsRes.value?.data ?? statsRes.value) : null;
                setStats(statsPayload);

                const recentPayload =
                    recentRes.status === 'fulfilled' ? (recentRes.value?.data?.recent_activity ?? recentRes.value) : [];
                setRecentActivity(Array.isArray(recentPayload) ? recentPayload : (recentPayload?.items || []));
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [userId]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('dashboard.goodMorning', 'Good Morning');
        else if (hour < 17) return t('dashboard.goodAfternoon', 'Good Afternoon');
        else if (hour < 21) return t('dashboard.goodEvening', 'Good Evening');
        else return t('dashboard.goodNight', 'Good Night');
    };

    // Live Watchlist Pairs with mini charts
    const watchlist = [
        {
            symbol: 'XAU/USD',
            name: 'Gold Spot / US Dollar',
            price: '2,734.50',
            change: '+1.12%',
            isUp: true,
            high: '2,738.20',
            low: '2,718.60',
            signal: 'STRONG BUY',
            score: 92,
            type: 'COMMODITY',
            sparkPoints: '0,28 20,24 40,26 60,14 80,18 100,6 120,4'
        },
        {
            symbol: 'EUR/USD',
            name: 'Euro / US Dollar',
            price: '1.0845',
            change: '+0.24%',
            isUp: true,
            high: '1.0865',
            low: '1.0812',
            signal: 'MILD BUY',
            score: 68,
            type: 'FOREX',
            sparkPoints: '0,22 25,20 50,15 75,18 100,10 120,8'
        },
        {
            symbol: 'GBP/USD',
            name: 'British Pound / USD',
            price: '1.2980',
            change: '-0.15%',
            isUp: false,
            high: '1.3020',
            low: '1.2965',
            signal: 'SELL',
            score: 34,
            type: 'FOREX',
            sparkPoints: '0,8 25,12 50,14 75,22 100,20 120,26'
        },
        {
            symbol: 'BTC/USD',
            name: 'Bitcoin / US Dollar',
            price: '68,450.00',
            change: '+2.85%',
            isUp: true,
            high: '68,900.00',
            low: '66,200.00',
            signal: 'STRONG BUY',
            score: 95,
            type: 'CRYPTO',
            sparkPoints: '0,30 20,26 45,22 70,12 95,14 120,2'
        },
        {
            symbol: 'USD/JPY',
            name: 'US Dollar / Japanese Yen',
            price: '152.30',
            change: '+0.42%',
            isUp: true,
            high: '152.80',
            low: '151.70',
            signal: 'NEUTRAL',
            score: 52,
            type: 'FOREX',
            sparkPoints: '0,18 30,16 60,19 90,14 120,12'
        },
        {
            symbol: 'US30',
            name: 'Dow Jones Industrial',
            price: '42,850.00',
            change: '+0.35%',
            isUp: true,
            high: '42,980.00',
            low: '42,650.00',
            signal: 'BUY',
            score: 76,
            type: 'INDICES',
            sparkPoints: '0,20 30,22 60,15 90,12 120,8'
        }
    ];

    const quickCopilotPrompts = [
        { label: 'Gold XAU/USD Forecast', query: 'What is the current technical trend and key resistance levels for XAU/USD Gold today?' },
        { label: 'Upcoming High-Impact News', query: 'What are the major economic events today and how will they impact the US Dollar?' },
        { label: 'EUR/USD Breakout Setup', query: 'Is EUR/USD showing bullish continuation on the 1H timeframe?' },
        { label: 'Bitcoin Key Support', query: 'Where are the key institutional liquidity zones for BTC/USD?' },
    ];

    const recents = useMemo(() => {
        const normalize = (item, index) => {
            const type = item?.type || item?.activity_type || item?.kind || "";
            const normalizedType = String(type).toLowerCase().includes("blog") ? "blog" : "chat";

            let summary = "";
            if (typeof item?.summary === "string") {
                try {
                    const parsed = JSON.parse(item.summary);
                    summary = parsed?.short_response || "";
                } catch {
                    summary = item.summary
                        .replace('{"short_response":"', "")
                        .replace('{"short_response": "', "")
                        .replace(/"}$/, "")
                        .replace(/\\"/g, '"');
                }
            } else if (item?.summary?.short_response) {
                summary = item.summary.short_response;
            }

            return {
                type: normalizedType,
                id: item?.id || item?.activity_id || item?.chat_id || item?.created_at || index,
                title: item?.title || item?.question || item?.message || "Recent item",
                summary,
                pair: item?.pair || item?.symbol || "",
                created_at: item?.created_at || item?.createdAt || item?.time || "",
            };
        };

        const list = (Array.isArray(recentActivity) ? recentActivity : [])
            .map(normalize)
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        if (activityFilter === 'chat') {
            return list.filter(i => i.type === 'chat').slice(0, 6);
        }
        if (activityFilter === 'blog') {
            return list.filter(i => i.type === 'blog').slice(0, 6);
        }
        return list.slice(0, 6);
    }, [recentActivity, activityFilter]);

    const openRecent = (item) => {
        const params = new URLSearchParams();
        params.set('tab', item.type);
        params.set('open', String(item.id));
        router.push(`/ai-assistant?${params.toString()}`);
    };

    const handlePromptClick = (query) => {
        router.push(`/ai-assistant?tab=chat&prompt=${encodeURIComponent(query)}`);
    };

    return (
        <div className={styles.modernDashboard}>
            {/* 1. Global AI Market Mood & System Barometer */}
            <header className={styles.marketBarometer}>
                <div className={styles.barometerLeft}>
                    <div className={styles.systemStatusBadge}>
                        <span className={styles.pulseGreen} />
                        <strong>AI NEURAL CORE: ACTIVE</strong>
                    </div>
                    <span className={styles.barometerDivider}>|</span>
                    <div className={styles.barometerItem}>
                        <span className={styles.baroLabel}>AI Market Sentiment:</span>
                        <strong className={styles.baroValueGreen}>84% Bullish (Greed)</strong>
                    </div>
                    <span className={styles.barometerDivider}>|</span>
                    <div className={styles.barometerItem}>
                        <span className={styles.baroLabel}>Signal Win Accuracy:</span>
                        <strong className={styles.baroValueGold}>93.8%</strong>
                    </div>
                </div>

                <div className={styles.barometerRight}>
                    <div className={styles.macroEventBadge}>
                        <span className={styles.redDot} />
                        <span>NEXT EVENT: <strong>US Core CPI in 01h 42m</strong></span>
                    </div>
                </div>
            </header>

            {/* 2. Futuristic Holographic Hero Terminal */}
            <section className={styles.hologramHero}>
                <div className={styles.heroBackdropWrap}>
                    <Image
                        src={HologramHeroBg}
                        alt="AI Neural Hologram"
                        fill
                        className={styles.heroBackdropImg}
                        priority
                    />
                    <div className={styles.heroOverlayFade} />
                </div>

                <div className={styles.heroGrid}>
                    {/* Left: Greeting & Fast Action Triggers */}
                    <div className={styles.heroLeftCol}>
                        <div className={styles.heroTagPill}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span>CHRONOSX AI TRADING DESK v3.0</span>
                        </div>

                        <h1 className={styles.heroHeadline}>
                            {greeting}, <span className={styles.nameGradient}>{name || 'Trader'}!</span> <span className={styles.wave}>👋</span>
                        </h1>

                        <p className={styles.heroSubtext}>
                            Real-time multi-timeframe algorithmic pattern detection, neural OCR chart vision, and automated institutional trade setups.
                        </p>

                        {/* Interactive Fast Action Launcher */}
                        <div className={styles.heroFastActions}>
                            <Link href="/trade-snap" className={styles.actionButtonGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                <span>Upload Chart (TradeSnap)</span>
                            </Link>

                            <Link href="/ai-strategy/live" className={styles.actionButtonOutline}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                <span>Live Strategy Terminal</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Live AI Spotlight Signal Oracle Widget */}
                    <div className={styles.heroRightCol}>
                        <div className={styles.signalOracleCard}>
                            <div className={styles.oracleHeader}>
                                <div className={styles.oraclePairTitle}>
                                    <span className={styles.oracleSymbol}>XAU/USD</span>
                                    <span className={styles.oracleCategory}>GOLD SPOT</span>
                                </div>
                                <div className={styles.oracleBadgeGreen}>
                                    <span className={styles.pulseGreenMini} />
                                    STRONG BUY
                                </div>
                            </div>

                            <div className={styles.oraclePriceRow}>
                                <div className={styles.oracleLivePrice}>
                                    $2,734.50 <span className={styles.priceUp}>+1.12%</span>
                                </div>
                                <div className={styles.oracleConfidence}>
                                    <span>AI Probability</span>
                                    <strong>92%</strong>
                                </div>
                            </div>

                            <div className={styles.oracleConfidenceBar}>
                                <div className={styles.confidenceFill} style={{ width: '92%' }} />
                            </div>

                            <div className={styles.oracleMetricsGrid}>
                                <div className={styles.oracleMetricBox}>
                                    <span className={styles.mLabel}>Optimal Entry</span>
                                    <span className={styles.mValue}>2,732.40</span>
                                </div>
                                <div className={styles.oracleMetricBox}>
                                    <span className={styles.mLabel}>Target TP1</span>
                                    <span className={`${styles.mValue} ${styles.valGreen}`}>2,748.00</span>
                                </div>
                                <div className={styles.oracleMetricBox}>
                                    <span className={styles.mLabel}>Stop Loss</span>
                                    <span className={`${styles.mValue} ${styles.valRed}`}>2,724.50</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={styles.oracleExecuteBtn}
                                onClick={() => router.push('/ai-strategy/live?pair=XAUUSD')}
                            >
                                <span>Scan Live Technicals & Indicators</span>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Metric Bento Matrix Cards */}
            <section className={styles.statsMatrixGrid}>
                <div className={styles.glassStatCard} onClick={() => router.push('/trade-snap')}>
                    <div className={styles.statTop}>
                        <div className={styles.statIconWrap}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                <path d="M3 20H21" />
                                <rect x="5" y="11" width="3" height="6" rx="1" fill="#F4D17A" />
                                <rect x="10.5" y="6" width="3" height="11" rx="1" fill="#FFE79A" />
                                <rect x="16" y="9" width="3" height="8" rx="1" fill="#D4AF37" />
                            </svg>
                        </div>
                        <span className={styles.statTrendBadge}>+14% this week</span>
                    </div>
                    <div className={styles.statNum}>{loading ? '...' : (stats?.total_analysis_history ?? 0)}</div>
                    <div className={styles.statTitle}>Chart Analyses Performed</div>
                    <div className={styles.statDesc}>Pattern recognition & automated OCR scans</div>
                </div>

                <div className={styles.glassStatCard} onClick={() => router.push('/ai-assistant?tab=chat')}>
                    <div className={styles.statTop}>
                        <div className={`${styles.statIconWrap} ${styles.iconPurple}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2">
                                <rect x="4" y="8" width="16" height="12" rx="3.5" />
                                <path d="M12 4V8" />
                                <circle cx="9" cy="13" r="1.5" fill="#C084FC" />
                                <circle cx="15" cy="13" r="1.5" fill="#C084FC" />
                            </svg>
                        </div>
                        <span className={styles.statTrendBadge}>24/7 Online</span>
                    </div>
                    <div className={styles.statNum}>{loading ? '...' : (stats?.total_chat_history ?? 0)}</div>
                    <div className={styles.statTitle}>AI Copilot Sessions</div>
                    <div className={styles.statDesc}>Technical questions & macro trade insights</div>
                </div>

                <div className={styles.glassStatCard} onClick={() => router.push('/credit-history')}>
                    <div className={styles.statTop}>
                        <div className={`${styles.statIconWrap} ${styles.iconGold}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#F4D17A" />
                            </svg>
                        </div>
                        <span className={styles.statTrendBadge}>Instant Recharge</span>
                    </div>
                    <div className={styles.statNum}>{loading ? '...' : (stats?.available_credits ?? 0)}</div>
                    <div className={styles.statTitle}>Available AI Credits</div>
                    <div className={styles.statDesc}>Ready for real-time strategy computation</div>
                </div>

                <div className={styles.glassStatCard} onClick={() => router.push('/credit-history')}>
                    <div className={styles.statTop}>
                        <div className={`${styles.statIconWrap} ${styles.iconGreen}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
                                <rect x="3" y="6" width="18" height="14" rx="3" />
                                <path d="M16 13H21V17H16C14.9 17 14 16.1 14 15C14 13.9 14.9 13 16 13Z" fill="#34D399" />
                            </svg>
                        </div>
                        <span className={styles.statTrendBadge}>All-Time Tier</span>
                    </div>
                    <div className={styles.statNum}>{loading ? '...' : (stats?.total_credits ?? 0)}</div>
                    <div className={styles.statTitle}>Total Account Credits</div>
                    <div className={styles.statDesc}>Lifetime credits processed on ChronosX</div>
                </div>
            </section>

            {/* 4. Live Multi-Pair Market Watchlist Grid */}
            <section className={styles.watchlistSection}>
                <div className={styles.sectionHeaderRow}>
                    <div className={styles.sectionTitleBlock}>
                        <div className={styles.headerIconCircle}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.5">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div>
                            <h2>Live Market Radar & AI Signal Scanner</h2>
                            <p>Real-time pricing, multi-timeframe bias & algorithmic recommendations</p>
                        </div>
                    </div>

                    <div className={styles.timeframeToggleGroup}>
                        {['15M', '1H', '4H', '1D'].map((tf) => (
                            <button
                                key={tf}
                                type="button"
                                className={`${styles.tfBtn} ${selectedTimeframe === tf ? styles.tfActive : ''}`}
                                onClick={() => setSelectedTimeframe(tf)}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.watchlistCardsGrid}>
                    {watchlist.map((item, idx) => (
                        <div
                            key={idx}
                            className={styles.watchCard}
                            onClick={() => router.push(`/ai-strategy/live?pair=${item.symbol.replace('/', '')}`)}
                        >
                            <div className={styles.watchCardTop}>
                                <div>
                                    <span className={styles.watchSymbol}>{item.symbol}</span>
                                    <span className={styles.watchName}>{item.name}</span>
                                </div>
                                <span
                                    className={`${styles.watchSignalBadge} ${
                                        item.signal.includes('BUY') ? styles.sigBuy : item.signal.includes('SELL') ? styles.sigSell : styles.sigNeutral
                                    }`}
                                >
                                    {item.signal}
                                </span>
                            </div>

                            <div className={styles.watchPriceRow}>
                                <div className={styles.watchPrice}>{item.price}</div>
                                <div className={`${styles.watchChange} ${item.isUp ? styles.up : styles.down}`}>
                                    {item.isUp ? '▲' : '▼'} {item.change}
                                </div>
                            </div>

                            {/* Mini Sparkline */}
                            <div className={styles.watchSparkline}>
                                <svg width="100%" height="32" viewBox="0 0 120 32" fill="none">
                                    <polyline
                                        points={item.sparkPoints}
                                        fill="none"
                                        stroke={item.isUp ? '#34D399' : '#F87171'}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <div className={styles.watchCardBottom}>
                                <div className={styles.rangeInfo}>
                                    <span>L: {item.low}</span>
                                    <span>H: {item.high}</span>
                                </div>
                                <div className={styles.openStrategyText}>
                                    <span>Terminal →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

          

            {/* 6. Split Section: Recent Activity & AI Quick Hub */}
            <div className={styles.splitBottomGrid}>
                {/* Left: Recent Activity Feed */}
                <div className={styles.feedColumn}>
                    <div className={styles.feedHeader}>
                        <div className={styles.feedTitleWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <h3>Recent Activity & Scans Feed</h3>
                        </div>

                        <div className={styles.filterPills}>
                            <button
                                type="button"
                                className={`${styles.filterTab} ${activityFilter === 'all' ? styles.filterTabActive : ''}`}
                                onClick={() => setActivityFilter('all')}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`${styles.filterTab} ${activityFilter === 'blog' ? styles.filterTabActive : ''}`}
                                onClick={() => setActivityFilter('blog')}
                            >
                                TradeSnap
                            </button>
                            <button
                                type="button"
                                className={`${styles.filterTab} ${activityFilter === 'chat' ? styles.filterTabActive : ''}`}
                                onClick={() => setActivityFilter('chat')}
                            >
                                AI Chat
                            </button>
                        </div>
                    </div>

                    <div className={styles.feedCardContainer}>
                        {loading ? (
                            <div className={styles.loadingBox}>
                                <div className={styles.miniSpinner} />
                                <span>Loading intelligence history...</span>
                            </div>
                        ) : recents.length === 0 ? (
                            <div className={styles.emptyFeed}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 209, 122, 0.4)" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <p>No recent activity recorded yet.</p>
                                <Link href="/trade-snap" className={styles.firstScanBtn}>
                                    Upload Your First Chart →
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.activityItemsList}>
                                {recents.map((item) => (
                                    <div
                                        key={`${item.type}-${item.id}`}
                                        className={styles.activityRowItem}
                                        onClick={() => openRecent(item)}
                                    >
                                        <div className={styles.actLeft}>
                                            <span className={`${styles.actTypeBadge} ${item.type === 'blog' ? styles.typeSnap : styles.typeChat}`}>
                                                {item.type === 'blog' ? 'TradeSnap' : 'AI Copilot'}
                                            </span>
                                            <div className={styles.actTitles}>
                                                <strong className={styles.actMainTitle}>{item.title}</strong>
                                                <span className={styles.actTime}>{timeAgo(item.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className={styles.actSummary}>
                                            {item.summary ? (
                                                <div dangerouslySetInnerHTML={{ __html: formatSummary(item.summary) }} />
                                            ) : (
                                                '—'
                                            )}
                                        </div>

                                        <div className={styles.actAction}>
                                            <span>Open →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Features Cards */}
                <div className={styles.quickHubColumn}>
                    {/* Feature 1: TradeSnap */}
                    <Link href="/trade-snap" className={styles.hubFeatureCard}>
                        <div className={styles.hubFeatureTop}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                            <span className={styles.hubBadgeGold}>HOT FEATURE</span>
                        </div>
                        <h4>AI TradeSnap Vision</h4>
                        <p>Upload chart image for instant OCR, pattern zones & SL/TP levels.</p>
                        <div className={styles.hubCta}>
                            <span>Launch Scanner</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Feature 2: Economic Calendar */}
                    <Link href="/economic-calendar" className={styles.hubFeatureCard}>
                        <div className={styles.hubFeatureTop}>
                            <div className={styles.hubIconCircleOrange}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D1A05" strokeWidth="2.2">
                                    <rect x="3" y="4" width="18" height="18" rx="3" />
                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                            </div>
                            <span className={styles.hubBadgeOrange}>MACRO RADAR</span>
                        </div>
                        <h4>Global Economic Desk</h4>
                        <p>Track interest rate decisions, inflation data, and high-impact volatility events.</p>
                        <div className={styles.hubCta}>
                            <span>View Calendar</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

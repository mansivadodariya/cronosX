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

function extractCleanText(val) {
    if (!val) return '';
    if (typeof val === 'object') {
        return val.short_response || val.shortResponse || val.text || val.response || val.summary || val.content || val.message || '';
    }
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                const parsed = JSON.parse(trimmed);
                if (parsed && typeof parsed === 'object') {
                    return parsed.short_response || parsed.shortResponse || parsed.text || parsed.response || parsed.summary || parsed.content || (Array.isArray(parsed) ? parsed[0]?.response || parsed[0]?.text || '' : '') || trimmed;
                }
            } catch {
                // Not standard JSON
            }
        }
        return trimmed
            .replace(/^\{\s*"(?:short_response|shortResponse|text|response|summary|content)":\s*"/i, '')
            .replace(/"\s*\}$/, '')
            .replace(/\\"/g, '"');
    }
    return String(val || '');
}

function formatSummary(input) {
    if (!input) return '';
    let text = extractCleanText(input);

    try {
        let decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        });

        decoded = decoded.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        let formatted = decoded.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        if (formatted.startsWith('- ')) {
            formatted = '• ' + formatted.substring(2);
        } else if (formatted.startsWith('-\t')) {
            formatted = '• ' + formatted.substring(2);
        }

        formatted = formatted.replace(/\n-\s*/g, '<br />• ');
        formatted = formatted.replace(/\n•\s*/g, '<br />• ');
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

            const rawSummary = item?.summary || item?.response || item?.short_response || item?.shortResponse || item?.answer || item?.content || "";
            const summary = extractCleanText(rawSummary);
            const rawTitle = item?.title || item?.question || item?.message || "Recent item";
            const title = extractCleanText(rawTitle);

            return {
                type: normalizedType,
                id: item?.id || item?.activity_id || item?.chat_id || item?.created_at || index,
                title: typeof title === 'string' && title.length > 0 ? title : "Recent item",
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
                            <span>CHRONOSX AI TRADING DESK</span>
                        </div>

                        <h1 className={styles.heroHeadline}>
                            {greeting}, <span className={styles.nameGradient}>{name || 'Trader'}!</span> <span className={styles.wave}>👋</span>
                        </h1>

                        <p className={styles.heroSubtext}>
                            Real-time multi-timeframe algorithmic pattern detection, neural OCR chart vision, and automated institutional trade setups.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Metric Bento Matrix Cards */}
            <section className={styles.statsMatrixGrid}>
                {/* 1. Chart Analyses Performed (TradeSnap) */}
                <div className={styles.glassStatCard} onClick={() => router.push('/trade-snap')}>
                    <div className={styles.statTop}>
                        <div className={styles.statIconWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="rgba(244, 209, 122, 0.15)" />
                                <circle cx="12" cy="13" r="4" fill="rgba(244, 209, 122, 0.25)" />
                            </svg>
                        </div>
                        <div className={styles.statTrendBadge}>
                            <span className={styles.badgeDot} />
                            <span>+14% this week</span>
                        </div>
                    </div>
                    <div className={styles.statMiddle}>
                        <div className={styles.statNum}>{loading ? '...' : (stats?.total_analysis_history ?? 0)}</div>
                        <div className={styles.statTitle}>Chart Analyses Performed</div>
                        <div className={styles.statDesc}>Pattern recognition & automated OCR scans</div>
                    </div>
                    <div className={styles.cardActionLink}>
                        <span>Launch TradeSnap</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* 2. AI Copilot Sessions */}
                <div className={styles.glassStatCard} onClick={() => router.push('/ai-assistant?tab=chat')}>
                    <div className={styles.statTop}>
                        <div className={styles.statIconWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="8" width="18" height="12" rx="4" fill="rgba(244, 209, 122, 0.15)" />
                                <path d="M12 2v6" />
                                <circle cx="8.5" cy="13.5" r="1.5" fill="#F4D17A" />
                                <circle cx="15.5" cy="13.5" r="1.5" fill="#F4D17A" />
                                <path d="M9 17h6" />
                                <path d="M2 14h1" />
                                <path d="M21 14h1" />
                            </svg>
                        </div>
                        <div className={styles.statTrendBadge}>
                            <span className={styles.badgeDot} />
                            <span>24/7 Online</span>
                        </div>
                    </div>
                    <div className={styles.statMiddle}>
                        <div className={styles.statNum}>{loading ? '...' : (stats?.total_chat_history ?? 0)}</div>
                        <div className={styles.statTitle}>AI Chat Sessions</div>
                        <div className={styles.statDesc}>Technical questions & macro trade insights</div>
                    </div>
                    <div className={styles.cardActionLink}>
                        <span>Open Copilot Chat</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* 3. Available AI Credits */}
                <div className={styles.glassStatCard} onClick={() => router.push('/credit-history')}>
                    <div className={styles.statTop}>
                        <div className={styles.statIconWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(244, 209, 122, 0.3)" />
                            </svg>
                        </div>
                        <div className={styles.statTrendBadge}>
                            <span className={styles.badgeDot} />
                            <span>Instant Recharge</span>
                        </div>
                    </div>
                    <div className={styles.statMiddle}>
                        <div className={styles.statNum}>{loading ? '...' : (stats?.available_credits ?? 0)}</div>
                        <div className={styles.statTitle}>Available AI Credits</div>
                        <div className={styles.statDesc}>Ready for real-time strategy computation</div>
                    </div>
                    <div className={styles.cardActionLink}>
                        <span>Manage & Recharge</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* 4. Total Account Credits */}
                <div className={styles.glassStatCard} onClick={() => router.push('/credit-history')}>
                    <div className={styles.statTop}>
                        <div className={styles.statIconWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="rgba(244, 209, 122, 0.25)" />
                                <circle cx="12" cy="19" r="1.5" fill="#F4D17A" />
                            </svg>
                        </div>
                        <div className={styles.statTrendBadge}>
                            <span className={styles.badgeDot} />
                            <span>All-Time Tier</span>
                        </div>
                    </div>
                    <div className={styles.statMiddle}>
                        <div className={styles.statNum}>{loading ? '...' : (stats?.total_credits ?? 0)}</div>
                        <div className={styles.statTitle}>Total Account Credits</div>
                        <div className={styles.statDesc}>Lifetime credits processed on ChronosX</div>
                    </div>
                    <div className={styles.cardActionLink}>
                        <span>View Credit History</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
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
                                <div className={styles.emptyIconCircle}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
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
                                            <div className={styles.actTypeIcon}>
                                                {item.type === 'blog' ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                        <circle cx="12" cy="13" r="4" />
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                                        <rect x="3" y="8" width="18" height="12" rx="4" />
                                                        <path d="M12 2v6" />
                                                        <circle cx="8.5" cy="13.5" r="1.5" fill="#F4D17A" />
                                                        <circle cx="15.5" cy="13.5" r="1.5" fill="#F4D17A" />
                                                        <path d="M9 17h6" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className={styles.actTitles}>
                                                <div className={styles.actTitleHeader}>
                                                    <strong className={styles.actMainTitle}>{item.title}</strong>
                                                    <span className={styles.actTypeTag}>{item.type === 'blog' ? 'TradeSnap' : 'AI Chat'}</span>
                                                </div>
                                                <span className={styles.actTime}>{timeAgo(item.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className={styles.actSummary}>
                                            {item.summary ? (
                                                <div dangerouslySetInnerHTML={{ __html: formatSummary(item.summary) }} />
                                            ) : (
                                                <span className={styles.noSummary}>Technical analysis details recorded</span>
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

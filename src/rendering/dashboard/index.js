'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './dashboard.module.scss';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedAreaChart from '@/components/animatedAreaChart';

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
    const [chartTimeframe, setChartTimeframe] = useState('7D');

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

    const handleExportPdf = async () => {
        try {
            const jspdfModule = await import('jspdf');
            const jsPDF = jspdfModule.default || jspdfModule.jsPDF;
            const doc = new jsPDF();

            // Dark base background
            doc.setFillColor(18, 21, 20);
            doc.rect(0, 0, 210, 297, 'F');

            // Header Title
            doc.setTextColor(24, 201, 139);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('CHRONOSX AI TRADING DESK', 15, 20);

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.text('AI Telemetry & Usage Report', 15, 30);

            doc.setFontSize(10);
            doc.setTextColor(180, 180, 180);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated for: ${name || 'Trader'}`, 15, 38);
            doc.text(`Timestamp: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 44);

            // Divider
            doc.setDrawColor(24, 201, 139);
            doc.setLineWidth(0.5);
            doc.line(15, 48, 195, 48);

            // Metrics Cards
            let y = 58;
            const items = [
                { label: 'Chart Analyses Performed (TradeSnap)', value: String(stats?.total_analysis_history ?? 0), desc: 'Automated pattern recognition & OCR scans' },
                { label: 'AI Chat Copilot Sessions', value: String(stats?.total_chat_history ?? 0), desc: '24/7 neural market & trade assistant' },
                { label: 'Available AI Credits', value: String(stats?.available_credits ?? 0), desc: 'Ready for real-time AI strategy execution' },
                { label: 'Total Account Credits', value: String(stats?.total_credits ?? 100), desc: 'Total lifetime credits processed on platform' },
            ];

            items.forEach((item) => {
                doc.setFillColor(28, 33, 31);
                doc.roundedRect(15, y, 180, 32, 3, 3, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text(item.label, 22, y + 12);

                doc.setTextColor(160, 160, 160);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(item.desc, 22, y + 22);

                doc.setTextColor(24, 201, 139);
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text(item.value, 185, y + 18, { align: 'right' });

                y += 38;
            });

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text('ChronosX AI Quantitative Intelligence Platform • Confidential Export', 105, 285, { align: 'center' });

            doc.save(`ChronosX_AI_Telemetry_${(name || 'Trader').replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('Failed to export PDF report:', err);
        }
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
            return list.filter(i => i.type === 'chat').slice(0, 4);
        }
        if (activityFilter === 'blog') {
            return list.filter(i => i.type === 'blog').slice(0, 4);
        }
        return list.slice(0, 4);
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

    const [activeHoverPoint, setActiveHoverPoint] = useState(null);

    const dailyCreditChartData = useMemo(() => {
        const today = new Date();
        const rawPoints = [];

        // Aggregate actual user activity by date key (YYYY-MM-DD)
        const usageByDate = {};
        if (Array.isArray(recentActivity)) {
            recentActivity.forEach((item) => {
                const rawDate = item?.created_at || item?.createdAt || item?.time;
                if (rawDate) {
                    const d = new Date(rawDate);
                    if (!isNaN(d.getTime())) {
                        const key = d.toISOString().split('T')[0];
                        const cost = (item?.type === 'blog' || item?.type === 'analysis') ? 5 : 2;
                        usageByDate[key] = (usageByDate[key] || 0) + cost;
                    }
                }
            });
        }

        // Calculate real Today usage from user stats
        const todayChat = stats?.total_chat_history ?? 0;
        const todayAnalysis = stats?.total_analysis_history ?? 0;
        const todayTotalRealCredits = (todayAnalysis * 5) + (todayChat * 2);

        const todayKey = today.toISOString().split('T')[0];
        if (todayTotalRealCredits > 0) {
            usageByDate[todayKey] = Math.max(usageByDate[todayKey] || 0, todayTotalRealCredits);
        }

        // Build past 7 calendar days strictly using 100% REAL database activity
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            const dateKey = d.toISOString().split('T')[0];
            const dayNum = d.getDate();
            const monthShort = d.toLocaleString('en-US', { month: 'short' });
            const dateFormatted = i === 0 ? 'Today' : `${dayNum} ${monthShort}`;

            const recorded = usageByDate[dateKey];
            const creditsVal = typeof recorded === 'number' ? recorded : 0;

            rawPoints.push({
                dateFormatted,
                dateKey,
                credits: creditsVal,
                isToday: i === 0,
                idx: 6 - i,
            });
        }

        const maxVal = Math.max(...rawPoints.map((p) => p.credits), 10);

        const points = rawPoints.map((p, idx) => {
            const x = 30 + (idx * 105);
            const y = 115 - (p.credits / maxVal) * 85;
            return {
                ...p,
                x,
                y,
            };
        });

        let pathLine = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cx = (curr.x + next.x) / 2;
            pathLine += ` C ${cx} ${curr.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
        }

        const pathArea = `${pathLine} L ${points[points.length - 1].x} 135 L ${points[0].x} 135 Z`;
        const totalUsed = points.reduce((a, b) => a + b.credits, 0);

        return { points, pathLine, pathArea, totalUsed };
    }, [recentActivity, stats]);

    return (
        <div className={styles.modernDashboard}>
            {/* 2. Futuristic Holographic Hero Terminal & Daily Stats Side Card */}
            <div className={styles.topHeroRowGrid}>
                <section className={styles.hologramHero}>
                    <div className={styles.heroGrid}>
                        {/* Left: Greeting & Fast Action Triggers */}
                        <div className={styles.heroLeftCol}>
                            <div className={styles.heroTagPill}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5">
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

                        {/* Dynamic Daily AI Credit Consumption Graph */}
                        <div className={styles.heroChartSection}>
                            <div className={styles.chartHeaderRow}>
                                <div className={styles.chartTitleGroup}>
                                    <span className={styles.chartPulseDot} />
                                    <div className={styles.titleTextCol}>
                                        <span className={styles.chartTitle}>Daily AI Credit Consumption</span>
                                        <span className={styles.chartSubtitle}>Track credit usage per day across TradeSnap & AI Copilot</span>
                                    </div>
                                </div>

                                <div className={styles.headerRightGroup}>
                                    <div className={styles.chartSubBadge}>
                                        <span>Total: {dailyCreditChartData.totalUsed} Credits Used</span>
                                    </div>

                                    <div className={styles.timeframeFilterGroup}>
                                        {['7D', '30D', '90D'].map((tf) => (
                                            <button
                                                key={tf}
                                                type="button"
                                                className={`${styles.tfBtn} ${chartTimeframe === tf ? styles.activeTf : ''}`}
                                                onClick={() => setChartTimeframe(tf)}
                                            >
                                                {tf}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Interactive SVG Spline Canvas */}
                            <div className={styles.splineCanvasWrap}>
                                {activeHoverPoint && (
                                    <div className={styles.floatingChartTooltip} style={{ left: `${(activeHoverPoint.idx / 6) * 82 + 9}%` }}>
                                        <span className={styles.tooltipDay}>{activeHoverPoint.dateFormatted}:</span>
                                        <span className={styles.tooltipVal}>{activeHoverPoint.credits} Credits</span>
                                    </div>
                                )}

                                <svg viewBox="0 0 700 135" preserveAspectRatio="none" className={styles.splineSvg} onMouseLeave={() => setActiveHoverPoint(null)}>
                                    <defs>
                                        <linearGradient id="creditAreaGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#18C98B" stopOpacity="0.35" />
                                            <stop offset="60%" stopColor="#18C98B" stopOpacity="0.06" />
                                            <stop offset="100%" stopColor="#18C98B" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="creditLineStroke" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#00F2FE" />
                                            <stop offset="50%" stopColor="#18C98B" />
                                            <stop offset="100%" stopColor="#6EE7B7" />
                                        </linearGradient>
                                    </defs>

                                    {/* Horizontal Gridlines */}
                                    <line x1="0" y1="25" x2="700" y2="25" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                                    <line x1="0" y1="65" x2="700" y2="65" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
                                    <line x1="0" y1="105" x2="700" y2="105" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />

                                    {/* Smooth Bezier Spline Area Fill & Stroke */}
                                    <path d={dailyCreditChartData.pathArea} fill="url(#creditAreaGlow)" />
                                    <path d={dailyCreditChartData.pathLine} fill="none" stroke="url(#creditLineStroke)" strokeWidth="3.5" strokeLinecap="round" />

                                    {/* Interactive Glowing Data Nodes for Each Date */}
                                    {dailyCreditChartData.points.map((pt) => (
                                        <g key={pt.dateKey} className={styles.chartNodeGroup} onMouseEnter={() => setActiveHoverPoint(pt)}>
                                            <circle cx={pt.x} cy={pt.y} r="5" fill="#18C98B" className={styles.nodeCircle} />
                                            <circle cx={pt.x} cy={pt.y} r="10" fill="rgba(24, 201, 139, 0.3)" className={styles.nodeGlow} />
                                        </g>
                                    ))}
                                </svg>

                                {/* X-Axis Time Labels displaying Clean Dates (NO "cr") */}
                                <div className={styles.chartTimeLabels}>
                                    {dailyCreditChartData.points.map((pt) => (
                                        <div key={pt.dateKey} className={`${styles.dayLabelItem} ${pt.isToday ? styles.todayLabel : ''}`}>
                                            <span className={styles.dayName}>{pt.dateFormatted}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: Daily Stats Side Card (Matching Reference Image 2) */}
                <div className={styles.dailyStatsSideCard}>
                    <div className={styles.dailyStatsHeader}>
                        <div className={styles.headerTitleWrap}>
                            <span>AI Usage & Credits</span>
                            <button type="button" className={styles.infoBtn} title="AI Telemetry & Credit Info">i</button>
                        </div>
                        <button type="button" className={styles.shareBtn} title="Export Telemetry PDF" onClick={handleExportPdf}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                        </button>
                    </div>

                    <div className={styles.dailyStatsRows}>
                        {/* Box 1: Chart Analyses */}
                        <div className={styles.statPillRow} onClick={() => router.push('/trade-snap')}>
                            <div className={styles.rowTopHeader}>
                                <div className={styles.rowTitleWrap}>
                                    <span className={styles.rowTitle}>Chart Analyses</span>
                                    <span className={styles.rowDesc}>Automated pattern recognition & OCR scans</span>
                                </div>
                                <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" fill="currentColor" fillOpacity="0.2" />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className={styles.bigNumWrap}>
                                <span className={styles.statBigNum}>{loading ? '...' : (stats?.total_analysis_history ?? 0)}</span>
                            </div>

                            <div className={styles.rowCtaLink}>
                                <span>Launch TradeSnap</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Box 2: AI Chat Copilot */}
                        <div className={styles.statPillRow} onClick={() => router.push('/ai-assistant?tab=chat')}>
                            <div className={styles.rowTopHeader}>
                                <div className={styles.rowTitleWrap}>
                                    <span className={styles.rowTitle}>AI Chat Copilot</span>
                                    <span className={styles.rowDesc}>24/7 neural market & trade assistant</span>
                                </div>
                                <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="8" width="18" height="12" rx="4" />
                                        <path d="M12 2v6" />
                                        <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" />
                                        <circle cx="15.5" cy="13.5" r="1.5" fill="currentColor" />
                                        <path d="M9 17h6" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.bigNumWrap}>
                                <span className={styles.statBigNum}>{loading ? '...' : (stats?.total_chat_history ?? 0)}</span>
                            </div>

                            <div className={styles.rowCtaLink}>
                                <span>Open Copilot Chat</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Box 3: Available AI Credits */}
                        <div className={styles.statPillRow} onClick={() => router.push('/credit-history')}>
                            <div className={styles.rowTopHeader}>
                                <div className={styles.rowTitleWrap}>
                                    <span className={styles.rowTitle}>Available Credits</span>
                                    <span className={styles.rowDesc}>Ready for real-time AI strategy execution</span>
                                </div>
                                <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.bigNumWrap}>
                                <span className={styles.statBigNum}>{loading ? '...' : (stats?.available_credits ?? 0)}</span>
                            </div>

                            <div className={styles.rowCtaLink}>
                                <span>Manage & Recharge</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Box 4: Account Tier */}
                        <div className={styles.statPillRow} onClick={() => router.push('/credit-history')}>
                            <div className={styles.rowTopHeader}>
                                <div className={styles.rowTitleWrap}>
                                    <span className={styles.rowTitle}>Account Credits</span>
                                    <span className={styles.rowDesc}>Total lifetime credits processed on platform</span>
                                </div>
                                <div className={`${styles.rowIconWrap} ${styles.greenIcon}`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="currentColor" fillOpacity="0.25" />
                                        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.bigNumWrap}>
                                <span className={styles.statBigNum}>{loading ? '...' : (stats?.total_credits ?? 100)}</span>
                            </div>

                            <div className={styles.rowCtaLink}>
                                <span>View Credit History</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            {/* 6. Split Section: Recent Activity & AI Quick Hub */}
            <div className={styles.splitBottomGrid}>
                {/* Left: Recent Activity Feed */}
                <div className={styles.feedColumn}>
                    <div className={styles.feedHeader}>
                        <div className={styles.feedTitleWrap}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
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
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                        <circle cx="12" cy="13" r="4" />
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                                        <rect x="3" y="8" width="18" height="12" rx="4" />
                                                        <path d="M12 2v6" />
                                                        <circle cx="8.5" cy="13.5" r="1.5" fill="#18C98B" />
                                                        <circle cx="15.5" cy="13.5" r="1.5" fill="#18C98B" />
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

                {/* Right: Quick Features Cards (3x2 Tools Grid) */}
                <div className={styles.quickHubColumn}>
                    <div className={styles.hubHeader}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <h3>Quick Actions</h3>
                    </div>

                    <div className={styles.toolsGrid3x2}>
                        {/* Tool 1: TradeSnap Vision */}
                        <Link href="/trade-snap" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                            <h4>TradeSnap Vision</h4>
                            <div className={styles.hubCta}>
                                <span>Launch Scanner</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>

                        {/* Tool 2: AI Copilot Chat */}
                        <Link href="/ai-assistant" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <rect x="3" y="8" width="18" height="12" rx="4" />
                                    <path d="M12 2v6" />
                                    <circle cx="8.5" cy="13.5" r="1.5" fill="#2B1A05" />
                                    <circle cx="15.5" cy="13.5" r="1.5" fill="#2B1A05" />
                                    <path d="M9 17h6" />
                                </svg>
                            </div>
                            <h4>AI Copilot Chat</h4>
                            <div className={styles.hubCta}>
                                <span>Start Chatting</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>

                        {/* Tool 3: Live Strategy Terminal */}
                        <Link href="/ai-strategy/live" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h4>Live Strategy Desk</h4>
                            <div className={styles.hubCta}>
                                <span>Open Terminal</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>

                        {/* Tool 4: AI Trade Analysis */}
                        <Link href="/trade-analysis" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <path d="M3 3v18h18" />
                                    <path d="M7 16l4-5 4 3 6-8" />
                                    <polyline points="15 6 21 6 21 12" />
                                </svg>
                            </div>
                            <h4>AI Trade Analysis</h4>
                            <div className={styles.hubCta}>
                                <span>Audit Statements</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>

                        {/* Tool 5: Forex & Risk Calculators */}
                        <Link href="/calculator" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <rect x="4" y="2" width="16" height="20" rx="3" />
                                    <line x1="8" y1="6" x2="16" y2="6" />
                                    <line x1="8" y1="10" x2="10" y2="10" />
                                    <line x1="14" y1="10" x2="16" y2="10" />
                                    <line x1="8" y1="14" x2="10" y2="14" />
                                    <line x1="14" y1="14" x2="16" y2="14" />
                                    <line x1="8" y1="18" x2="16" y2="18" />
                                </svg>
                            </div>
                            <h4>Forex & Risk Tools</h4>
                            <div className={styles.hubCta}>
                                <span>Open Calculators</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>

                        {/* Tool 6: Economic Calendar */}
                        <Link href="/calendar" className={styles.hubFeatureCard}>
                            <div className={styles.hubIconCircleGold}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2">
                                    <rect x="3" y="4" width="18" height="17" rx="3" />
                                    <path d="M16 2v4M8 2v4M3 9h18" />
                                    <circle cx="8" cy="13" r="0.8" fill="#2B1A05" />
                                    <circle cx="12" cy="13" r="0.8" fill="#2B1A05" />
                                    <circle cx="16" cy="13" r="0.8" fill="#2B1A05" />
                                    <circle cx="8" cy="17" r="0.8" fill="#2B1A05" />
                                    <circle cx="12" cy="17" r="0.8" fill="#2B1A05" />
                                </svg>
                            </div>
                            <h4>Economic Calendar</h4>
                            <div className={styles.hubCta}>
                                <span>View Calendar</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

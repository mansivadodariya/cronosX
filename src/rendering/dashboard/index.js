'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.scss';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';

const AnalysesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 20H21" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="5" y="11" width="3" height="6" rx="1" fill="#F4D17A" />
        <rect x="10.5" y="6" width="3" height="11" rx="1" fill="#FFE79A" />
        <rect x="16" y="9" width="3" height="8" rx="1" fill="#D4AF37" />
        <path d="M6.5 8V11M12 3V6M17.5 6V9" stroke="#F4D17A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const AiBotIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="16" height="12" rx="3.5" stroke="#F4D17A" strokeWidth="1.8" />
        <path d="M12 4V8" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="3.5" r="1" fill="#F4D17A" />
        <circle cx="9" cy="13" r="1.5" fill="#F4D17A" />
        <circle cx="15" cy="13" r="1.5" fill="#F4D17A" />
        <path d="M9.5 16.5C10.5 17.5 13.5 17.5 14.5 16.5" stroke="#F4D17A" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M2 13H4M20 13H22" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const BoltIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="url(#dash-bolt-grad)" stroke="#F4D17A" strokeWidth="1.5" strokeLinejoin="round" />
        <defs>
            <linearGradient id="dash-bolt-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF2B2" />
                <stop offset="1" stopColor="#B8860B" />
            </linearGradient>
        </defs>
    </svg>
);

const WalletIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="14" rx="3" stroke="#F4D17A" strokeWidth="1.8" fill="url(#dash-wallet-grad)" />
        <path d="M16 13H21V17H16C14.9 17 14 16.1 14 15C14 13.9 14.9 13 16 13Z" stroke="#F4D17A" strokeWidth="1.5" fill="#0C0B09" />
        <circle cx="17.5" cy="15" r="1" fill="#F4D17A" />
        <defs>
            <linearGradient id="dash-wallet-grad" x1="3" y1="6" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2A2416" />
                <stop offset="1" stopColor="#15120C" />
            </linearGradient>
        </defs>
    </svg>
);

const SparklineIcon = () => (
    <svg width="64" height="32" viewBox="0 0 70 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 30L16 26L28 31L40 18L52 24L66 6" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="30" r="2" fill="#F4D17A" />
        <circle cx="16" cy="26" r="2" fill="#F4D17A" />
        <circle cx="28" cy="31" r="2" fill="#F4D17A" />
        <circle cx="40" cy="18" r="2" fill="#F4D17A" />
        <circle cx="52" cy="24" r="2" fill="#F4D17A" />
        <circle cx="66" cy="6" r="2.5" fill="#FFE79A" stroke="#F4D17A" strokeWidth="1" />
    </svg>
);

const LightningTitleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#F4D17A" stroke="#F4D17A" strokeWidth="1" style={{ flexShrink: 0 }}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

const CtaArrowIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const RecentPulseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CloudUploadBadge = () => (
    <div className={`${styles.qaRoundBadge} ${styles.qaBadgeGold}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2B1A05" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#2B1A05" />
            <path d="M12 11v6m0-6-2.5 2.5M12 11l2.5 2.5" stroke="#F6D285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

const TargetBadge = () => (
    <div className={`${styles.qaRoundBadge} ${styles.qaBadgeGreen}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#063818" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" fill="#063818" />
            <circle cx="12" cy="12" r="2" fill="#6EE7B7" />
        </svg>
    </div>
);

const ChatBadge = () => (
    <div className={`${styles.qaRoundBadge} ${styles.qaBadgePink}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D0B28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="#3D0B28" />
            <circle cx="9" cy="12" r="1" fill="#F472B6" />
            <circle cx="15" cy="12" r="1" fill="#F472B6" />
        </svg>
    </div>
);

const CalendarBadge = () => (
    <div className={`${styles.qaRoundBadge} ${styles.qaBadgeOrange}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D1A05" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" fill="#3D1A05" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="14" r="1" fill="#FB923C" />
            <circle cx="12" cy="14" r="1" fill="#FB923C" />
            <circle cx="16" cy="14" r="1" fill="#FB923C" />
            <circle cx="8" cy="18" r="1" fill="#FB923C" />
            <circle cx="12" cy="18" r="1" fill="#FB923C" />
        </svg>
    </div>
);

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
        console.error("Error formatting summary:", e);
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

    const quickActions = useMemo(
        () => [
            {
                id: 'upload',
                title: t('dashboard.snapChart', 'Upload Trade Screenshot'),
                desc: t('tradeSnap.dropzoneText', 'Drag & drop your chart here or click to browse'),
                cta: t('common.uploadNow', 'Upload Now'),
                href: '/trade-snap',
                badge: CloudUploadBadge,
                image: '/assets/images/qa-phone.png',
                themeClass: styles.cardGold,
            },
            {
                id: 'strategy',
                title: t('nav.aiStrategy', 'AI Strategy'),
                desc: t('nav.aiStrategyDesc', 'Build, test & optimize AI-powered trading strategies.'),
                cta: t('common.exploreNow', 'Explore Now'),
                href: '/ai-strategy',
                badge: TargetBadge,
                image: '/assets/images/qa-knight.png',
                themeClass: styles.cardGreen,
            },
            {
                id: 'chat',
                title: t('dashboard.askAssistant', 'Ask AI Chat'),
                desc: t('aiChat.subtitle', 'Ask anything about markets, currency pairs, setups, news & more.'),
                cta: t('common.startChat', 'Start Chat'),
                href: '/ai-assistant?tab=chat',
                badge: ChatBadge,
                image: '/assets/images/qa-robot.png',
                themeClass: styles.cardPurple,
            },
            {
                id: 'calendar',
                title: t('nav.economicCalendar', 'Economic Calendar'),
                desc: t('home.tradingDeskSubtitle', 'Track important events and market moving economic news.'),
                cta: t('common.viewCalendar', 'View Calendar'),
                href: '/economic-calendar',
                badge: CalendarBadge,
                image: '/assets/images/qa-calendar.png',
                themeClass: styles.cardOrange,
            },
        ],
        [t]
    );

    const recents = useMemo(() => {
        const normalize = (item, index) => {
            const type = item?.type || item?.activity_type || item?.kind || "";
            const normalizedType = String(type)
                .toLowerCase()
                .includes("blog")
                ? "blog"
                : "chat";

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

        return (Array.isArray(recentActivity) ? recentActivity : [])
            .map(normalize)
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 8);
    }, [recentActivity]);

    const openRecent = (item) => {
        const params = new URLSearchParams();
        params.set('tab', item.type);
        params.set('open', String(item.id));
        router.push(`/ai-assistant?${params.toString()}`);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('dashboard.goodMorning', 'Good Morning');
        else if (hour < 17) return t('dashboard.goodAfternoon', 'Good Afternoon');
        else if (hour < 21) return t('dashboard.goodEvening', 'Good Evening');
        else return t('dashboard.goodNight', 'Good Night');
    };

    const statsData = [
        {
            id: 1,
            label: t('dashboard.recentAnalyses', 'Recent Analyses'),
            value: stats?.total_analysis_history ?? 0,
            sub: t('dashboard.recentAnalysesSub', 'View your latest insights'),
            icon: AnalysesIcon,
        },
        {
            id: 2,
            label: t('dashboard.aiChatConversations', 'AI Chat Conversations'),
            value: stats?.total_chat_history ?? 0,
            sub: t('dashboard.aiChatSub', 'Chats with AI assistant'),
            icon: AiBotIcon,
        },
        {
            id: 3,
            label: t('dashboard.availableCredits', 'Available AI Credits'),
            value: stats?.available_credits ?? 0,
            sub: t('dashboard.availableCreditsSub', 'Credits available'),
            icon: BoltIcon,
        },
        {
            id: 4,
            label: t('dashboard.totalCredits', 'Total Credits'),
            value: stats?.total_credits ?? 0,
            sub: t('dashboard.totalCreditsSub', 'All time credits'),
            icon: WalletIcon,
        },
    ];

    return (
        <div className={styles.dashboard}>
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <div className={styles.heroKicker}>
                        {t('home.heroTitle', 'Trade Smarter With AI-Powered Forex Intelligence')}
                    </div>
                    <h1>
                        {greeting}, <span>{name || 'Trader'}!</span> <span className={styles.waveEmoji}>👋</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        {t('home.heroDesc', 'Leverage AI-powered insights and real-time market data to make smarter, faster and more confident trading decisions.')}
                    </p>
                </div>
                <div className={styles.heroGraphic}>
                    <img src="/assets/images/dashboard-bull.png" alt="Forex Bull Market" className={styles.bullImg} />
                </div>
            </section>

            <section className={styles.statsGrid}>
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div className={`${styles.statCard} ${styles.skeletonCard}`} key={i}>
                            <div className={`${styles.skeletonIcon} ${styles.shimmer}`} />
                            <div className={styles.statContent}>
                                <div className={`${styles.skeletonLabel} ${styles.shimmer}`} />
                                <div className={`${styles.skeletonValue} ${styles.shimmer}`} />
                            </div>
                        </div>
                    ))
                ) : (
                    statsData.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div className={styles.statCard} key={item.id}>
                                <div className={styles.statIconBadge}>
                                    <IconComponent />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statLabel}>{item.label}</div>
                                    <div className={styles.statValue}>{item.value}</div>
                                    <div className={styles.statSubtitle}>{item.sub}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleWrap}>
                        <LightningTitleIcon />
                        <h2>{t('dashboard.quickActions', 'Quick Actions')}</h2>
                    </div>
                </div>
                <div className={styles.quickGrid}>
                    {quickActions.map((qa) => {
                        const BadgeComponent = qa.badge;
                        return (
                            <Link href={qa.href} key={qa.id} className={`${styles.qaCard} ${qa.themeClass}`}>
                                <div className={styles.qaContent}>
                                    <div className={styles.qaCardHeader}>
                                        <BadgeComponent />
                                        <h3>{qa.title}</h3>
                                    </div>
                                    <p>{qa.desc}</p>
                                    <div className={styles.qaCtaRow}>
                                        <span>{qa.cta}</span>
                                        <CtaArrowIcon />
                                    </div>
                                </div>
                                <div className={styles.qaVisual}>
                                    <img src={qa.image} alt={qa.title} className={styles.qaImg} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleWrap}>
                        <RecentPulseIcon />
                        <h2>{t('dashboard.recentAnalyses', 'Recent Activity')}</h2>
                    </div>
                </div>

                <div className={styles.recentCard}>
                    {loading ? (
                        <div className={styles.tableWrapper}>
                            <table className={styles.recentTable}>
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.time', 'Time')}</th>
                                        <th>{t('dashboard.type', 'Type')}</th>
                                        <th>{t('dashboard.title', 'Title')}</th>
                                        <th>{t('dashboard.summary', 'Summary')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className={styles.skeletonRow}>
                                            <td><div className={`${styles.skeletonBadge} ${styles.shimmer}`} /></td>
                                            <td><div className={`${styles.skeletonText} ${styles.shimmer}`} /></td>
                                            <td><div className={`${styles.skeletonTextWide} ${styles.shimmer}`} /></td>
                                            <td><div className={`${styles.skeletonTextShort} ${styles.shimmer}`} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : recents.length === 0 ? (
                        <div className={styles.recentEmpty}>
                            {t('dashboard.noRecentActivity', 'No recent chats or blogs yet.')}
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.recentTable}>
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.time', 'Time')}</th>
                                        <th>{t('dashboard.title', 'Title')}</th>
                                        <th>{t('dashboard.summary', 'Summary')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recents.map((item) => (
                                        <tr
                                            key={`${item.type}-${item.id}`}
                                            onClick={() => openRecent(item)}
                                            className={styles.tableRow}
                                        >
                                            <td>
                                                <div className={styles.recentTime}>
                                                    {timeAgo(item.created_at)}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={styles.recentTitle}
                                                    title={item.title}
                                                >
                                                    {item.title}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.recentSummary}>
                                                    {item.summary ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: formatSummary(item.summary),
                                                            }}
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


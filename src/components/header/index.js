"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authNavigate, getAuthHref } from '@/lib/authRedirect';
import styles from './header.module.scss';
import Button from '../button';

const Logo = '/assets/logo/logo.png';
const RightIcon = '/assets/icons/right.svg';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setOpenMobileDropdown(null);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setMobileMenuOpen(false);
                setOpenMobileDropdown(null);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileDropdown = (label) => {
        setOpenMobileDropdown(prev => (prev === label ? null : label));
    };

    const productDropdownItems = [
        {
            label: 'AI Chat Analysis',
            desc: 'Real-time conversational market intelligence & instant insights',
            href: getAuthHref('/'),
            badge: 'LIVE AI',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 9h8" />
                    <path d="M8 13h6" />
                </svg>
            )
        },
        {
            label: 'AI Chart Analysis',
            desc: 'Automated multi-timeframe pattern detection & key price levels',
            href: getAuthHref('/'),
            badge: 'POPULAR',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                </svg>
            )
        },
        {
            label: 'AI Strategies / Indicators Analysis',
            desc: 'Algorithmic backtesting, momentum breakout & strategy signals',
            href: getAuthHref('/'),
            badge: 'QUANT',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            )
        }
    ];

    const tradingToolsDropdownItems = [
        {
            label: 'AI Past Trade Analyzer',
            desc: 'Review your historical trading data to evaluate performance, pinpoint mistakes, and track win rates.',
            href: getAuthHref('/'),
            badge: 'AI AUDIT',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            )
        },
        {
            label: 'Strategy (Create New)',
            desc: 'Custom algorithmic trading logic, parameter tuning & rule engines',
            href: getAuthHref('/'),
            badge: 'BUILDER',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )
        },
        {
            label: 'Backtesting',
            desc: 'High-speed historical simulation, win-rate metrics & Sharpe ratio',
            href: getAuthHref('/'),
            badge: 'QUANT SIM',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 8 14" />
                </svg>
            )
        },
        {
            label: 'Paper Trading',
            desc: 'Risk-free simulated trading environment with live real-time feeds',
            href: getAuthHref('/'),
            badge: 'DEMO $100K',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                </svg>
            )
        }
    ];

    const companyDropdownItems = [
        {
            label: 'About Us',
            desc: 'Our mission, institutional AI infrastructure & executive leadership',
            href: '/',
            badge: 'VISION',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        {
            label: 'Economic Calendar',
            desc: 'Real-time global macro events, central bank rates & high-impact releases',
            href: getAuthHref('/economic-calendar'),
            badge: 'LIVE CALENDAR',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        },
        {
            label: 'News',
            desc: 'Curated financial headlines, crypto updates & breaking market catalysts',
            href: '/market-news',
            badge: 'DAILY',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                </svg>
            )
        },
        {
            label: 'Forex Calculator',
            desc: 'Precision pip value, position sizing, lot size & risk calculator',
            href: '/forex-calculator',
            badge: 'UTILITY',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="16" y1="14" x2="16" y2="18" />
                    <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
                </svg>
            )
        },
        {
            label: 'Blog',
            desc: 'In-depth quant trading strategies, technical breakdowns & research',
            href: '/blogs',
            badge: 'INSIGHTS',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            )
        }
    ];

    const navItems = [
        { label: 'Home', href: '/' },
        {
            label: 'Products',
            href: getAuthHref('/'),
            hasDropdown: true,
            dropdownTag: 'AI TRADING ECOSYSTEM',
            dropdownFooter: 'Powered by ChronosX Real-Time Neural Engines',
            dropdownItems: productDropdownItems
        },
        {
            label: 'Trading Tools',
            href: getAuthHref('/'),
            hasDropdown: true,
            dropdownTag: 'QUANTITATIVE EXECUTION SUITE',
            dropdownFooter: 'Multi-Broker Execution & Zero-Latency Routing',
            dropdownItems: tradingToolsDropdownItems
        },
        {
            label: 'Company',
            href: '/#about',
            hasDropdown: true,
            dropdownTag: 'COMPANY & RESOURCES',
            dropdownFooter: 'ChronosX Global Financial Intelligence Network',
            dropdownItems: companyDropdownItems
        },
        { label: 'Pricing', href: getAuthHref('/') },

        { label: 'Contact Us', href: getAuthHref('/') },
    ];

    const isLinkActive = (item) => {
        if (!pathname) return false;
        const current = pathname.split('?')[0].replace(/\/$/, '') || '/';
        const target = (item.href || '').split('#')[0].replace(/\/$/, '') || '/';

        // 'Home' is only active when at root '/'
        if (item.label === 'Home') {
            return current === '/';
        }

        // For dropdown menus, only activate if user is visiting a specific non-root subpage
        if (item.hasDropdown && item.dropdownItems) {
            const isChildActive = item.dropdownItems.some(sub => {
                const subHref = (sub.href || '').split('#')[0].replace(/\/$/, '');
                if (!subHref || subHref === '/') return false;
                return current === subHref || current.startsWith(`${subHref}/`);
            });
            if (isChildActive) return true;
        }

        // If target is root '/' or hash anchor, do not activate as an active navigation tab on homepage
        if (target === '/' || item.href?.startsWith('/#') || item.href?.startsWith('#')) {
            return false;
        }

        return current === target || current.startsWith(`${target}/`);
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className='container'>
                <div className={`${styles.headerAlignment} ${scrolled ? styles.alignmentScrolled : ''}`}>
                    {/* Brand Logo */}
                    <div className={styles.logo}>
                        <Link href="/" aria-label="ChronosX Home">
                            <img src={Logo} alt="ChronosX Logo" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className={styles.menu} aria-label="Main Navigation">
                        <ul>
                            {navItems.map((item) => {
                                const active = isLinkActive(item);
                                const isItemOpen = activeDropdown === item.label;

                                if (item.hasDropdown) {
                                    return (
                                        <li
                                            key={item.label}
                                            className={`${styles.dropdownParent} ${active ? styles.active : ''} ${isItemOpen ? styles.dropdownOpen : ''}`}
                                            onMouseEnter={() => setActiveDropdown(item.label)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                type="button"
                                                className={styles.dropdownTrigger}
                                                aria-expanded={isItemOpen}
                                                onClick={() => setActiveDropdown(prev => prev === item.label ? null : item.label)}
                                            >
                                                <span>{item.label}</span>
                                                <svg
                                                    className={styles.chevron}
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </button>

                                            {/* Hover Dropdown Menu */}
                                            <div className={styles.dropdownMenu}>
                                                <div className={styles.dropdownCard}>
                                                    <div className={styles.dropdownHeaderTag}>
                                                        <span>{item.dropdownTag}</span>
                                                    </div>

                                                    <div className={styles.dropdownGrid}>
                                                        {item.dropdownItems.map((subItem) => (
                                                            <Link
                                                                key={subItem.label}
                                                                href={subItem.href}
                                                                className={styles.dropdownItem}
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <div className={styles.itemIconBox}>
                                                                    {subItem.icon}
                                                                </div>
                                                                <div className={styles.itemContent}>
                                                                    <div className={styles.itemTitleRow}>
                                                                        <span className={styles.itemTitle}>{subItem.label}</span>
                                                                        {subItem.badge && (
                                                                            <span className={styles.itemBadge}>{subItem.badge}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className={styles.itemDesc}>{subItem.desc}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>

                                                    <div className={styles.dropdownFooter}>
                                                        <span className={styles.footerGlowDot} />
                                                        <span>{item.dropdownFooter}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.label} className={active ? styles.active : ''}>
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Right Desktop CTA */}
                    <div className={styles.desktopAction}>
                        <Button
                            text="Get Started"
                            icon={RightIcon}
                            onClick={() => authNavigate(router, '/dashboard')}
                        />
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        className={`${styles.hamburgerBtn} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className={styles.line} />
                        <span className={styles.line} />
                        <span className={styles.line} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className={styles.mobileDrawer}
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="container">
                            <div className={styles.drawerCard}>
                                <ul className={styles.drawerNavList}>
                                    {navItems.map((item) => {
                                        const active = isLinkActive(item);
                                        const isMobileOpen = openMobileDropdown === item.label;

                                        if (item.hasDropdown) {
                                            return (
                                                <li key={item.label} className={styles.mobileDropdownItem}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.drawerLink} ${styles.mobileDropdownTrigger} ${active ? styles.drawerLinkActive : ''}`}
                                                        onClick={() => toggleMobileDropdown(item.label)}
                                                    >
                                                        <span>{item.label}</span>
                                                        <svg
                                                            className={`${styles.mobileChevron} ${isMobileOpen ? styles.mobileChevronOpen : ''}`}
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </button>

                                                    <AnimatePresence>
                                                        {isMobileOpen && (
                                                            <motion.div
                                                                className={styles.mobileSubList}
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {item.dropdownItems.map((sub) => (
                                                                    <Link
                                                                        key={sub.label}
                                                                        href={sub.href}
                                                                        className={styles.mobileSubLink}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                    >
                                                                        <div className={styles.subIconWrap}>{sub.icon}</div>
                                                                        <div className={styles.subContent}>
                                                                            <span className={styles.subTitle}>{sub.label}</span>
                                                                            <span className={styles.subDesc}>{sub.desc}</span>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li key={item.label}>
                                                <Link
                                                    href={item.href}
                                                    className={`${styles.drawerLink} ${active ? styles.drawerLinkActive : ''}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <span>{item.label}</span>
                                                    {active && <span className={styles.activeDot} />}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className={styles.drawerDivider} />

                                <div className={styles.drawerCta}>
                                    <Button
                                        text="Get Started"
                                        icon={RightIcon}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            authNavigate(router, '/dashboard');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

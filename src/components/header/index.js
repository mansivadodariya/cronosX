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

    // Close mobile menu on route change or resize
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'AI Tools', href: getAuthHref('/trade-snap') },
        { label: 'AI Chat', href: getAuthHref('/ai-assistant') },
        { label: 'AI Strategy', href: getAuthHref('/ai-strategy/live') },
        { label: 'Pricing', href: getAuthHref('/plans') }
    ];

    const isLinkActive = (href) => {
        if (!pathname) return false;
        const current = pathname.split('?')[0].replace(/\/$/, '') || '/';
        const target = href.replace(/\/$/, '') || '/';
        if (target === '/') return current === '/';
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
                                const active = isLinkActive(item.href);
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
                                        const active = isLinkActive(item.href);
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

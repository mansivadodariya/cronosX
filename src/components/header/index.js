"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authNavigate, getAuthHref } from '@/lib/authRedirect';
import styles from './header.module.scss';
import Button from '../button';

const Logo = '/assets/logo/logo.png';
const RightIcon = '/assets/icons/right.svg';

export default function Header() {
    const router = useRouter();

    return (
        <header className={styles.header}>
            <div className='container'>
                <div className={styles.headerAlignment}>
                    <div className={styles.logo}>
                        <Link href="/" aria-label="ChronosX Home">
                            <img src={Logo} alt="ChronosX Logo" />
                        </Link>
                    </div>
                    <div className={styles.menu}>
                        <ul>
                            <li className={styles.active}><Link href="/">Home</Link></li>
                            <li><Link href={getAuthHref('/trade-snap')}>AI Tools</Link></li>
                            <li><Link href={getAuthHref('/ai-assistant')}>AI Chat</Link></li>
                            <li><Link href={getAuthHref('/ai-strategy/live')}>AI Strategy</Link></li>
                            <li><Link href={getAuthHref('/plans')}>Pricing</Link></li>
                        </ul>
                    </div>
                    <Button 
                        text="Get Started" 
                        icon={RightIcon} 
                        onClick={() => authNavigate(router, '/dashboard')} 
                    />
                </div>
            </div>
        </header>
    );
}

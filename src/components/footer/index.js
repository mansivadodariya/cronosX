import React from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';

const Logo = '/assets/logo/logo.png';

const socialLinks = [
  { icon: '/assets/icons/twitter.svg', href: 'https://twitter.com', label: 'Twitter' },
  { icon: '/assets/icons/instagram.svg', href: 'https://instagram.com', label: 'Instagram' },
  { icon: '/assets/icons/discord.svg', href: 'https://discord.com', label: 'Discord' },
  { icon: '/assets/icons/telegram.svg', href: 'https://t.me/ChronosX_Official', label: 'Telegram' },
  { icon: '/assets/icons/youtube.svg', href: 'https://youtube.com', label: 'YouTube' }
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <div className={styles.topSection}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <Link href="/" aria-label="ChronosX Home">
                <img src={Logo} alt='ChronosX Logo' />
              </Link>
            </div>
            <p className={styles.brandDesc}>
              Institutional-grade AI trading intelligence, neural chart pattern detection,
              and quantitative execution models built for modern traders.
            </p>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              <span>AI Trading Desk Online</span>
            </div>
          </div>

          {/* 1. Products Column */}
          <div className={styles.navCol}>
            <h4>PRODUCTS</h4>
            <ul>
              <li><Link href="/trade-snap">AI Chart Analysis</Link></li>
              <li><Link href="/ai-assistant">AI Chat Analysis</Link></li>
              <li><Link href="/ai-strategy/live">AI Strategies & Indicators</Link></li>
              <li><Link href="/capabilities">Capabilities & Vision</Link></li>
            </ul>
          </div>

          {/* 2. Trading Tools Column */}
          <div className={styles.navCol}>
            <h4>TRADING TOOLS</h4>
            <ul>
              <li><Link href="/ai-past-trade-analyzer">AI Past Trade Analyzer</Link></li>
              <li><Link href="/ai-strategy/live">Strategy Builder</Link></li>
              <li><Link href="/ai-strategy/live">Quant Backtesting</Link></li>
              <li><Link href="/dashboard">Paper Trading Desk</Link></li>
            </ul>
          </div>

          {/* 3. Company & Resources Column */}
          <div className={styles.navCol}>
            <h4>COMPANY</h4>
            <ul>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/plans">Pricing Plans</Link></li>
              <li><Link href="/economic-calendar">Economic Calendar</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          {/* 4. Legal Column (From Screenshot) */}
          <div className={styles.navCol}>
            <h4>LEGAL</h4>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/risk-disclosure">Risk Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomSection}>
          <p>© 2026 ChronosX. All rights reserved.</p>

          <div className={styles.socialList}>
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.href}
                aria-label={item.label}
                className={styles.socialBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={item.icon} alt={item.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

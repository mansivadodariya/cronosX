import React from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';
const Logo = '/assets/logo/logo.png';

const socialLinks = [
  { icon: '/assets/icons/twitter.svg', href: '#', label: 'Twitter' },
  { icon: '/assets/icons/instagram.svg', href: '#', label: 'Instagram' },
  { icon: '/assets/icons/discord.svg', href: '#', label: 'Discord' },
  { icon: '/assets/icons/telegram.svg', href: '#', label: 'Telegram' },
  { icon: '/assets/icons/youtube.svg', href: '#', label: 'YouTube' }
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <div className={styles.topSection}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <img src={Logo} alt='Logo' />
            </div>
            <p>
              AI-powered forex trading signals, market analysis, and
              smart trading tools built for modern traders.
            </p>
          </div>

          {/* Nav Columns */}
          <div className={styles.navCol}>
            <h4>PRODUCT</h4>
            <ul>
              <li><Link href="/trade-snap">AI Trade</Link></li>
              <li><Link href="/ai-assistant">AI Chat</Link></li>
              <li><Link href="/ai-strategy/live">AI Strategy</Link></li>
            </ul>
          </div>

          <div className={styles.navCol}>
            <h4>RESOURCES</h4>
            <ul>
              <li><Link href="/plans">Pricing Plans</Link></li>
              <li><Link href="/economic-calendar">Economic Calendar</Link></li>
            </ul>
          </div>

          <div className={styles.navCol}>
            <h4>LEGAL</h4>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/risk-disclosure">Risk Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.divider}></div>

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

'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './stepthree.module.scss';

const OnboardingGlobeImg = '/assets/images/onboarding-globe.png';

// SVG Icons
const EurUsdIcon = () => (
    <div className={styles.doubleCircleIcon}>
        <div className={styles.currCircle}><span>€</span></div>
        <div className={classNames(styles.currCircle, styles.currCircleSub)}><span>$</span></div>
    </div>
);

const GbpUsdIcon = () => (
    <div className={styles.doubleCircleIcon}>
        <div className={classNames(styles.currCircle, styles.flagCircle)}>
            <svg viewBox="0 0 60 30" width="100%" height="100%">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </svg>
        </div>
        <div className={classNames(styles.currCircle, styles.currCircleSub)}><span>$</span></div>
    </div>
);

const UsdJpyIcon = () => (
    <div className={styles.doubleCircleIcon}>
        <div className={classNames(styles.currCircle, styles.flagCircle)}>
            <svg viewBox="0 0 60 30" width="100%" height="100%">
                <rect width="60" height="30" fill="#B22234" />
                <rect y="4.6" width="60" height="4.6" fill="#fff" />
                <rect y="13.8" width="60" height="4.6" fill="#fff" />
                <rect y="23" width="60" height="4.6" fill="#fff" />
                <rect width="25" height="16" fill="#3C3B6E" />
                <circle cx="6" cy="4" r="1" fill="#fff" />
                <circle cx="12" cy="4" r="1" fill="#fff" />
                <circle cx="18" cy="4" r="1" fill="#fff" />
                <circle cx="9" cy="8" r="1" fill="#fff" />
                <circle cx="15" cy="8" r="1" fill="#fff" />
                <circle cx="6" cy="12" r="1" fill="#fff" />
                <circle cx="12" cy="12" r="1" fill="#fff" />
                <circle cx="18" cy="12" r="1" fill="#fff" />
            </svg>
        </div>
        <div className={classNames(styles.currCircle, styles.currCircleSub, styles.flagCircle)}>
            <svg viewBox="0 0 30 30" width="100%" height="100%">
                <rect width="30" height="30" fill="#FFFFFF" />
                <circle cx="15" cy="15" r="7" fill="#BC002D" />
            </svg>
        </div>
    </div>
);

const GoldBarsIcon = () => (
    <div className={styles.goldBarsWrapper}>
        <svg width="34" height="26" viewBox="0 0 40 30" fill="none">
            <path d="M12 4L16 0H24L28 4L24 8H16L12 4Z" fill="#F4D17A" />
            <path d="M16 8H24L28 4V6L24 10H16L12 6V4L16 8Z" fill="#D4AF37" />
            <path d="M4 14L8 10H18L22 14L18 18H8L4 14Z" fill="#FFE79A" />
            <path d="M8 18H18L22 14V17L18 21H8L4 17V14L8 18Z" fill="#B8860B" />
            <path d="M18 14L22 10H32L36 14L32 18H22L18 14Z" fill="#F4D17A" />
            <path d="M22 18H32L36 14V17L32 21H22L18 17V14L22 18Z" fill="#996515" />
        </svg>
    </div>
);

const GbpJpyIcon = () => (
    <div className={styles.doubleCircleIcon}>
        <div className={classNames(styles.currCircle, styles.flagCircle)}>
            <svg viewBox="0 0 60 30" width="100%" height="100%">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </svg>
        </div>
        <div className={classNames(styles.currCircle, styles.currCircleSub, styles.flagCircle)}>
            <svg viewBox="0 0 30 30" width="100%" height="100%">
                <rect width="30" height="30" fill="#FFFFFF" />
                <circle cx="15" cy="15" r="7" fill="#BC002D" />
            </svg>
        </div>
    </div>
);

const CryptoIcon = () => (
    <div className={styles.cryptoBadge}>
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" fill="#F7931A" />
            <path d="M21.5 13.5C21.9 12.3 21.2 10.9 19.3 10.4L18.8 8.6L17.7 8.9L18.2 10.7C17.9 10.8 17.6 10.9 17.3 11L16.8 9.2L15.7 9.5L16.2 11.3C15.9 11.4 15.6 11.5 15.3 11.6L13.8 11.2L13.4 12.7C13.4 12.7 14.2 12.9 14.2 12.9C14.6 13 14.7 13.3 14.6 13.6L13.3 18.7C13.2 18.9 13 19 12.7 18.9C12.7 18.9 11.9 18.7 11.9 18.7L11.2 20.3L12.7 20.7C13 20.8 13.3 20.9 13.6 21L13.1 23L14.2 22.7L14.7 20.7C15 20.8 15.3 20.9 15.6 21L15.1 23L16.2 22.7L16.7 20.7C18.6 21 20.1 20.6 20.7 18.9C21.2 17.5 20.7 16.7 19.8 16.2C20.5 15.8 21 14.9 20.7 13.7M18.8 18.3C18.5 19.6 16.2 18.8 15.3 18.6L16 15.9C16.9 16.1 19.2 16.9 18.8 18.3M19.1 14.3C18.8 15.5 16.9 14.8 16.1 14.6L16.7 12.2C17.5 12.4 19.4 13.1 19.1 14.3Z" fill="white" />
        </svg>
    </div>
);

const IndicesIcon = () => (
    <div className={styles.indicesBadge}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 19V14" stroke="#00C087" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 19V10" stroke="#00C087" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 19V6" stroke="#00C087" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M3 13L9 7L13 11L21 3M21 3H16M21 3V8" stroke="#00C087" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

const OtherIcon = () => (
    <div className={styles.otherBadge}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="12" r="2.5" fill="#F4D17A" />
            <circle cx="12" cy="12" r="2.5" fill="#F4D17A" />
            <circle cx="18" cy="12" r="2.5" fill="#F4D17A" />
        </svg>
    </div>
);

const MARKET_OPTIONS = [
    {
        id: 'eur_usd',
        title: 'EUR/USD',
        desc: 'Euro / U.S. Dollar',
        icon: EurUsdIcon,
    },
    {
        id: 'gbp_usd',
        title: 'GBP/USD',
        desc: 'British Pound / U.S. Dollar',
        icon: GbpUsdIcon,
    },
    {
        id: 'usd_jpy',
        title: 'USD/JPY',
        desc: 'U.S. Dollar / Japanese Yen',
        icon: UsdJpyIcon,
    },
    {
        id: 'xau_usd',
        title: 'XAU/USD',
        desc: 'Gold / U.S. Dollar',
        icon: GoldBarsIcon,
    },
    {
        id: 'gbp_jpy',
        title: 'GBP/JPY',
        desc: 'British Pound / Japanese Yen',
        icon: GbpJpyIcon,
    },
    {
        id: 'crypto',
        title: 'Crypto',
        desc: 'Cryptocurrencies',
        icon: CryptoIcon,
    },
    {
        id: 'indices',
        title: 'Indices',
        desc: 'Global Stock Indices',
        icon: IndicesIcon,
    },
    {
        id: 'other',
        title: 'Other',
        desc: 'Other markets or instruments',
        icon: OtherIcon,
    },
];

export default function Stepthree({ selectedOptions: controlledOptions, onToggleOption }) {
    const [internalOptions, setInternalOptions] = useState([
        'eur_usd',
        'gbp_usd',
        'usd_jpy',
        'xau_usd',
        'crypto',
    ]);
    const selectedOptions = controlledOptions !== undefined ? controlledOptions : internalOptions;

    const handleToggle = (id) => {
        if (onToggleOption) {
            onToggleOption(id);
        } else {
            setInternalOptions((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        }
    };

    return (
        <div className={styles.mainGrid}>
            {/* Left Side: Titles and 8 Markets Grid */}
            <div className={styles.leftColumn}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.mainTitle}>
                        <span className={styles.whiteTitle}>WHICH MARKETS</span>
                        <span className={styles.goldTitle}>DO YOU TRADE?</span>
                    </h1>
                    <p className={styles.subtitle}>Select your favorite instruments.</p>
                </div>

                <div className={styles.marketsGrid}>
                    {MARKET_OPTIONS.map((opt) => {
                        const isSelected = selectedOptions.includes(opt.id);
                        const IconComponent = opt.icon;

                        return (
                            <div
                                key={opt.id}
                                className={classNames(styles.marketCard, isSelected && styles.selected)}
                                onClick={() => handleToggle(opt.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleToggle(opt.id);
                                    }
                                }}
                            >
                                <div className={classNames(styles.checkbox, isSelected && styles.checked)}>
                                    {isSelected && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17L4 12" stroke="#0A0807" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>

                                <div className={styles.marketIconBox}>
                                    <IconComponent />
                                </div>

                                <div className={styles.marketInfo}>
                                    <h3 className={styles.marketTitle}>{opt.title}</h3>
                                    <p className={styles.marketDesc}>{opt.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Preferences Notice */}
                <div className={styles.preferenceNotice}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#F4D17A" strokeWidth="1.6" />
                        <path d="M12 8V8.01M12 11V16" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span>You can update this later in your preferences.</span>
                </div>
            </div>

            {/* Right Side: 3D Gold Holographic Globe Graphic */}
            <div className={styles.rightColumn}>
                <div className={styles.graphicWrapper}>
                    <img
                        src={OnboardingGlobeImg}
                        alt="Global Trading Markets"
                        className={styles.graphicImage}
                    />
                </div>
            </div>
        </div>
    );
}

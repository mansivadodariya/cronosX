'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './step.module.scss';

const OnboardingStairsImg = '/assets/images/onboarding-stairs.png';

const SproutIcon = () => (
    <div className={styles.icon3dWrapper}>
        <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
            <path d="M18 30V18M18 18C18 12 11 10 7 11C7 16 11 20 18 18ZM18 18C18 10 25 8 29 9C29 14 25 18 18 18Z" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="url(#sprout-grad)" />
            <path d="M12 30H24" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
            <defs>
                <linearGradient id="sprout-grad" x1="7" y1="8" x2="29" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6EE7B7" stopOpacity="0.85" />
                    <stop offset="1" stopColor="#10B981" stopOpacity="0.45" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const GrowthChartIcon = () => (
    <div className={styles.icon3dWrapper}>
        <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
            <rect x="5" y="22" width="5" height="8" rx="1.5" fill="url(#bar-grad)" stroke="#18C98B" strokeWidth="1.6" />
            <rect x="13" y="16" width="5" height="14" rx="1.5" fill="url(#bar-grad)" stroke="#18C98B" strokeWidth="1.6" />
            <rect x="21" y="10" width="5" height="20" rx="1.5" fill="url(#bar-grad)" stroke="#18C98B" strokeWidth="1.6" />
            <path d="M5 16L13 10L21 6L29 2M29 2H23M29 2V8" stroke="#6EE7B7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#6EE7B7" />
                    <stop offset="1" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const LightningIcon = () => (
    <div className={styles.icon3dWrapper}>
        <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
            <path d="M20 4L8 19H18L16 32L28 17H18L20 4Z" fill="url(#bolt-grad)" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="bolt-grad" x1="8" y1="4" x2="28" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A7F3D0" />
                    <stop offset="1" stopColor="#059669" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const TrophyIcon = () => (
    <div className={styles.icon3dWrapper}>
        <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
            <path d="M10 6H26V15C26 19.4 22.4 23 18 23C13.6 23 10 19.4 10 15V6Z" fill="url(#trophy-grad)" stroke="#18C98B" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 9H6C4.9 9 4 9.9 4 11V13C4 15.2 5.8 17 8 17H10.5" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M26 9H30C31.1 9 32 9.9 32 11V13C32 15.2 30.2 17 28 17H25.5" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 23V27M13 31H23M15 27H21" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
            <defs>
                <linearGradient id="trophy-grad" x1="10" y1="6" x2="26" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A7F3D0" />
                    <stop offset="1" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const EXPERIENCE_OPTIONS = [
    {
        id: 'beginner',
        title: 'BEGINNER',
        desc: "I'm still learning Forex",
        icon: SproutIcon,
    },
    {
        id: 'intermediate',
        title: 'INTERMEDIATE',
        desc: "I've been trading for 1–3 years",
        icon: GrowthChartIcon,
    },
    {
        id: 'advanced',
        title: 'ADVANCED',
        desc: 'I actively trade and understand technical analysis',
        icon: LightningIcon,
    },
    {
        id: 'professional',
        title: 'PROFESSIONAL',
        desc: 'I trade professionally / for a prop firm',
        icon: TrophyIcon,
    },
];

export default function Step({ selectedLevel: controlledLevel, onSelectLevel }) {
    const [internalLevel, setInternalLevel] = useState('beginner');
    const selectedLevel = controlledLevel !== undefined ? controlledLevel : internalLevel;

    const handleSelect = (id) => {
        if (onSelectLevel) {
            onSelectLevel(id);
        } else {
            setInternalLevel(id);
        }
    };

    return (
        <div className={styles.stepContainer}>
            {/* Top Hero Section: Title on Left, 3D Stairs Graphic on Right */}
            <div className={styles.topHeroSection}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.mainTitle}>
                        <span className={styles.whiteTitle}>WHAT'S YOUR</span>
                        <span className={styles.goldTitle}>TRADING EXPERIENCE?</span>
                    </h1>
                    <p className={styles.subtitle}>
                        This helps us personalize your experience and provide better insights.
                    </p>
                </div>

                <div className={styles.heroGraphicWrapper}>
                    <img
                        src={OnboardingStairsImg}
                        alt="Trading Growth Stairs"
                        className={styles.stairsImage}
                    />
                </div>
            </div>

            {/* Middle Section: 4 Horizontal Experience Cards Grid */}
            <div className={styles.cardsGrid}>
                {EXPERIENCE_OPTIONS.map((opt) => {
                    const isSelected = selectedLevel === opt.id;
                    const IconComponent = opt.icon;

                    return (
                        <div
                            key={opt.id}
                            className={classNames(styles.experienceCard, isSelected && styles.selected)}
                            onClick={() => handleSelect(opt.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSelect(opt.id);
                                }
                            }}
                        >
                            {/* Radio Circle (Top Right) */}
                            <div className={classNames(styles.radioCircle, isSelected && styles.checked)}>
                                {isSelected && <div className={styles.radioCore} />}
                            </div>

                            {/* Top 3D Icon */}
                            <div className={styles.cardTopIcon}>
                                <IconComponent />
                            </div>

                            {/* Center Title */}
                            <div className={styles.cardCenterBlock}>
                                <h3 className={styles.cardTitle}>{opt.title}</h3>
                            </div>

                            {/* Bottom Desc */}
                            <div className={styles.cardBottomBlock}>
                                <p className={styles.cardDesc}>{opt.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

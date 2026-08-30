'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './stepTwo.module.scss';

const OnboardingTargetImg = '/assets/images/onboarding-target.png';

const AnalyzeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20V14" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M9 20V11" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 20V7" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M19 20V4" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M13 5L19 3M19 3V9M19 3L11 11" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AskAiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="16" height="13" rx="4" stroke="#18C98B" strokeWidth="1.8" />
        <path d="M12 3V7" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1" fill="#18C98B" />
        <circle cx="9" cy="12" r="1.5" fill="#18C98B" />
        <circle cx="15" cy="12" r="1.5" fill="#18C98B" />
        <path d="M9 16C10 17 14 17 15 16" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 12H4" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 12H22" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const BrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 4C7.5 4 6 5.5 6 7.5C6 8.2 6.2 8.8 6.6 9.3C5.1 9.8 4 11.3 4 13C4 14.8 5.2 16.3 6.8 16.8C6.9 18.6 8.4 20 10.2 20C11.2 20 12 19.5 12.5 18.8C13 19.5 13.8 20 14.8 20C16.6 20 18.1 18.6 18.2 16.8C19.8 16.3 21 14.8 21 13C21 11.3 19.9 9.8 18.4 9.3C18.8 8.8 19 8.2 19 7.5C19 5.5 17.5 4 15.5 4C14.7 4 14 4.3 13.5 4.8C13 4.3 12.3 4 11.5 4H9.5Z" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V20" stroke="#18C98B" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 9H12M12 12H8.5M12 15H9.5M12 9H15M12 12H15.5M12 15H14.5" stroke="#18C98B" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const FlaskIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H15" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 3V8L4.5 18.5C3.8 19.8 4.7 21 6.2 21H17.8C19.3 21 20.2 19.8 19.5 18.5L14 8V3" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16H17" stroke="#18C98B" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 3" />
        <circle cx="10" cy="18" r="0.75" fill="#18C98B" />
        <circle cx="14" cy="17.5" r="0.75" fill="#18C98B" />
    </svg>
);

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.5C10.5 5 8 4.5 5 4.5C3.5 4.5 2 5 2 5V19C2 19 3.5 18.5 5 18.5C8 18.5 10.5 19 12 20.5C13.5 19 16 18.5 19 18.5C20.5 18.5 22 19 22 19V5C22 5 20.5 4.5 19 4.5C16 4.5 13.5 5 12 6.5Z" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6.5V20.5" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HELP_OPTIONS = [
    {
        id: 'analyze_trades',
        title: 'Analyze My Trades',
        desc: 'Upload charts and identify setups.',
        icon: AnalyzeIcon,
        fullWidth: false,
    },
    {
        id: 'ask_ai',
        title: 'Ask AI',
        desc: 'Get answers about markets and trading.',
        icon: AskAiIcon,
        fullWidth: false,
    },
    {
        id: 'build_strategies',
        title: 'Build Strategies',
        desc: 'Create structured trading strategies.',
        icon: BrainIcon,
        fullWidth: false,
    },
    {
        id: 'backtest_strategies',
        title: 'Backtest Strategies',
        desc: 'Test strategies against historical data.',
        icon: FlaskIcon,
        fullWidth: false,
    },
    {
        id: 'learn_trading',
        title: 'Learn Trading',
        desc: 'Understand concepts and improve your skills.',
        icon: BookIcon,
        fullWidth: true,
    },
];

export default function StepTwo({ selectedOptions: controlledOptions, onToggleOption }) {
    const [internalOptions, setInternalOptions] = useState(['analyze_trades', 'ask_ai']);
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
            <div className={styles.leftColumn}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.mainTitle}>
                        <span className={styles.whiteTitle}>WHAT DO YOU WANT</span>
                        <span className={styles.goldTitle}>CHRONOSX TO HELP WITH?</span>
                    </h1>
                    <p className={styles.subtitle}>You can select multiple options.</p>
                </div>

                <div className={styles.optionsGrid}>
                    {HELP_OPTIONS.map((opt) => {
                        const isSelected = selectedOptions.includes(opt.id);
                        const IconComponent = opt.icon;

                        return (
                            <div
                                key={opt.id}
                                className={classNames(
                                    styles.optionCard,
                                    opt.fullWidth && styles.fullWidthCard,
                                    isSelected && styles.selected
                                )}
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
                                <div className={styles.optionBadgeIcon}>
                                    <IconComponent />
                                </div>
                                <div className={styles.optionContent}>
                                    <h3 className={styles.optionTitle}>{opt.title}</h3>
                                    <p className={styles.optionDesc}>{opt.desc}</p>
                                </div>
                                <div className={classNames(styles.checkbox, isSelected && styles.checked)}>
                                    {isSelected && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17L4 12" stroke="#0A0807" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.graphicWrapper}>
                    <img
                        src={OnboardingTargetImg}
                        alt="ChronosX Target Goals"
                        className={styles.graphicImage}
                    />
                </div>
            </div>
        </div>
    );
}

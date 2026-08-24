'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './stepOne.module.scss';

const OnboardingTradeImg = '/assets/images/onboarding-trade.png';

// SVG Icons
const ScalpingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DayTradingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#F4D17A" strokeWidth="1.8" />
        <path d="M12 7V12L15 14.5" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SwingTradingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 16.5L8.5 11L12.5 15L20.5 7" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7H20.5V12.5" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PositionTradingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 20V14" stroke="#F4D17A" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M12 20V10" stroke="#F4D17A" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M18 20V5" stroke="#F4D17A" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
);

const QuestionIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#F4D17A" strokeWidth="1.8" />
        <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.6 13.78 11.53 12.8 11.85C12.33 12.01 12 12.44 12 12.94V13.5" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.85" fill="#F4D17A" />
    </svg>
);

const TRADE_OPTIONS = [
    {
        id: 'scalping',
        label: 'Scalping',
        icon: ScalpingIcon,
    },
    {
        id: 'day_trading',
        label: 'Day Trading',
        icon: DayTradingIcon,
    },
    {
        id: 'swing_trading',
        label: 'Swing Trading',
        icon: SwingTradingIcon,
    },
    {
        id: 'position_trading',
        label: 'Position Trading',
        icon: PositionTradingIcon,
    },
    {
        id: 'figuring_out',
        label: "I'm still figuring it out",
        icon: QuestionIcon,
    },
];

export default function StepOne() {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleOption = (id) => {
        setSelectedOptions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className={styles.mainGrid}>
            {/* Left Side: Titles and Multi-select Options */}
            <div className={styles.leftColumn}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.mainTitle}>
                        <span className={styles.whiteTitle}>HOW DO YOU</span>
                        <span className={styles.goldTitle}>USUALLY TRADE?</span>
                    </h1>
                    <p className={styles.subtitle}>You can select multiple options.</p>
                </div>

                <div className={styles.optionsList}>
                    {TRADE_OPTIONS.map((opt) => {
                        const isSelected = selectedOptions.includes(opt.id);
                        const IconComponent = opt.icon;

                        return (
                            <div
                                key={opt.id}
                                className={classNames(styles.optionCard, isSelected && styles.selected)}
                                onClick={() => toggleOption(opt.id)}
                            >
                                <div className={classNames(styles.checkbox, isSelected && styles.checked)}>
                                    {isSelected && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17L4 12" stroke="#0A0807" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.optionIconBox}>
                                    <IconComponent />
                                </div>
                                <span className={styles.optionLabel}>{opt.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Side: 3D Gold Trading Graphic */}
            <div className={styles.rightColumn}>
                <div className={styles.graphicWrapper}>
                    <img
                        src={OnboardingTradeImg}
                        alt="Trading Navigation & Charts"
                        className={styles.graphicImage}
                    />
                </div>
            </div>
        </div>
    );
}

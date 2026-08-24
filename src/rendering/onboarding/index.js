'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import Step from './step';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import Stepthree from './stepthree';
import styles from './onboarding.module.scss';

// SVG Icons for Header & Footer
const SkipIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4L13 12L5 20V4Z" fill="#F4D17A" />
        <path d="M13 4L21 12L13 20V4Z" fill="#F4D17A" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Onboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        } else {
            router.push('/dashboard');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            router.push('/login');
        }
    };

    const handleSkip = () => {
        router.push('/dashboard');
    };

    return (
        <div className={styles.onboardingPage}>
            {/* Common Fixed Top Header */}
            <div className={styles.topHeader}>
                <button type="button" className={styles.skipBtn} onClick={handleSkip}>
                    <SkipIcon />
                    <span>Skip for now</span>
                </button>

                <div className={styles.stepperContainer}>
                    {/* Step 1 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 1 && styles.completed,
                            currentStep === 1 && styles.active
                        )}
                    >
                        {currentStep > 1 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 1 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 1 -> 2 */}
                    <div className={classNames(styles.stepLine, currentStep >= 2 && styles.activeLine)} />

                    {/* Step 2 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 2 && styles.completed,
                            currentStep === 2 && styles.active
                        )}
                    >
                        {currentStep > 2 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 2 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 2 -> 3 */}
                    <div className={classNames(styles.stepLine, currentStep >= 3 && styles.activeLine)} />

                    {/* Step 3 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep > 3 && styles.completed,
                            currentStep === 3 && styles.active
                        )}
                    >
                        {currentStep > 3 ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : currentStep === 3 ? (
                            <div className={styles.activeCore} />
                        ) : null}
                    </div>

                    {/* Line 3 -> 4 */}
                    <div className={classNames(styles.stepLine, currentStep >= 4 && styles.activeLine)} />

                    {/* Step 4 */}
                    <div
                        className={classNames(
                            styles.stepCircle,
                            currentStep === 4 && styles.active
                        )}
                    >
                        {currentStep === 4 && <div className={styles.activeCore} />}
                    </div>
                </div>

                <div className={styles.stepCount}>
                    <span>Step {currentStep} of 4</span>
                </div>
            </div>

            {/* Dynamic Center Step Content */}
            <div className={styles.stepContentArea}>
                {currentStep === 1 && <Step />}
                {currentStep === 2 && <StepOne />}
                {currentStep === 3 && <StepTwo />}
                {currentStep === 4 && <Stepthree />}
            </div>

            {/* Common Fixed Bottom Footer */}
            <div className={styles.bottomFooter}>
                <div className={styles.footerLeft}>
                    {currentStep === 1 ? (
                        <div className={styles.securityNotice}>
                            <ShieldCheckIcon />
                            <span>Your answers are private and secure</span>
                        </div>
                    ) : (
                        <button type="button" className={styles.backBtn} onClick={handleBack}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Back</span>
                        </button>
                    )}
                </div>

                <button type="button" className={styles.nextBtn} onClick={handleNext}>
                    <span>{currentStep === 4 ? 'Get Started' : 'Next'}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0A0807" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './breakoutDetection.module.scss';
import Textbutton from '@/components/textbutton';

const stepsData = [
  {
    step: '01',
    title: 'Watch the level.',
    desc: 'ChronosX tracks every ticker against its 20-day range. The line below shows PLTR approaching $86.20 — its 20-day resistance.',
    ticker: 'PLTR · 1m +5.12%',
    status: 'Approaching $86.20',
    stage: 1
  },
  {
    step: '02',
    title: 'The break.',
    desc: 'When PLTR closes above $86.20 with above-average volume, the level lights up. The AI score has already moved to 91 on bullish sentiment confirmation.',
    ticker: 'PLTR · 1m +6.72%',
    status: 'Resistance broken',
    stage: 2
  },
  {
    step: '03',
    title: 'The toast.',
    desc: 'The alert hits your phone the second the candle closes. By the time the rest of the room sees it on the news, you’re already in.',
    ticker: 'PLTR · 1m +6.72%',
    status: 'Breakout alert',
    stage: 3
  }
];

export default function BreakoutDetection() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Track scroll progress inside container
      if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.2) {
        stepRefs.current.forEach((el, index) => {
          if (!el) return;
          const stepRect = el.getBoundingClientRect();
          if (stepRect.top <= windowHeight * 0.55 && stepRect.bottom >= windowHeight * 0.3) {
            setActiveStep(index);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStepClick = (index) => {
    setActiveStep(index);
    if (stepRefs.current[index]) {
      stepRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentStep = stepsData[activeStep];

  return (
    <section className={styles.breakoutSection} ref={containerRef}>
      <div className="container">
        <div className={styles.mainLayout}>
          
          {/* Left Column: Sticky Container with Heading & Interactive Chart */}
          <div className={styles.stickyColumn}>
            <div className={styles.stickyContent}>
              <motion.div 
                className={styles.header}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.badgeWrapper}>
                  <Textbutton text="REAL-TIME BREAKOUT DETECTION" />
                </div>
                <h2>
                  CATCH THE MOVE THE <br />
                  <span>SECOND IT HAPPENS.</span>
                </h2>
                <p className={styles.subtext}>
                  Scroll through one trade idea: from approach to confirmation to alert. The chart pins; the narrative scrolls past it.
                </p>
              </motion.div>

              {/* Pinned Interactive Chart Card */}
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.tickerTag}>
                    <span className={styles.liveGreenDot}></span>
                    {currentStep.ticker}
                  </div>
                  <div className={styles.statusTag}>
                    {currentStep.status}
                  </div>
                </div>

                {/* SVG Real-time Candle & Trajectory Graphic */}
                <div className={styles.svgWrapper}>
                  <svg viewBox="0 0 540 280" xmlns="http://www.w3.org/2000/svg" className={styles.chartSvg}>
                    <defs>
                      {/* Rich Title Gold Gradients */}
                      <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D8A23B" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FFE693" stopOpacity="1" />
                      </linearGradient>

                      <linearGradient id="baseLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#645A45" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#9E7F40" stopOpacity="0.85" />
                      </linearGradient>

                      <linearGradient id="glowAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D8A23B" stopOpacity="0.25" />
                        <stop offset="60%" stopColor="#9E6B17" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#D8A23B" stopOpacity="0" />
                      </linearGradient>

                      <linearGradient id="baseAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9E6B17" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#9E6B17" stopOpacity="0" />
                      </linearGradient>

                      <radialGradient id="pointGlowHalo" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="40%" stopColor="#FFE693" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#D8A23B" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Subtle Horizontal Grid lines */}
                    <line x1="20" y1="230" x2="520" y2="230" stroke="rgba(216, 162, 59, 0.08)" strokeWidth="1" />
                    <line x1="20" y1="120" x2="520" y2="120" stroke="rgba(216, 162, 59, 0.08)" strokeWidth="1" />

                    {/* Dashed Resistance Line (R · $86.20) */}
                    <g className={styles.resistanceLineGroup}>
                      <line 
                        x1="20" 
                        y1="175" 
                        x2="450" 
                        y2="175" 
                        className={`${styles.resistanceLine} ${activeStep >= 1 ? styles.resistanceBroken : ''}`}
                      />
                      <text x="515" y="178" textAnchor="end" className={styles.resistanceLabel}>
                        R · $86.20
                      </text>
                    </g>

                    {/* Approach Path Segment (Stage 1 base) */}
                    <path
                      d="M 25 240 L 55 248 L 90 226 L 125 238 L 160 215 L 195 228 L 230 200 L 265 212 L 300 185 L 340 175"
                      className={styles.basePathLine}
                    />

                    {/* Base Area Fill */}
                    <path
                      d="M 25 240 L 55 248 L 90 226 L 125 238 L 160 215 L 195 228 L 230 200 L 265 212 L 300 185 L 340 175 L 340 270 L 25 270 Z"
                      fill="url(#baseAreaGrad)"
                    />

                    {/* Stage 1 Tip Dot */}
                    {activeStep === 0 && (
                      <g className={styles.tipDotGroup}>
                        <circle cx="340" cy="175" r="8" className={styles.sonarRing} />
                        <circle cx="340" cy="175" r="3.5" fill="#FFE693" />
                        <circle cx="340" cy="175" r="1.5" fill="#FFFFFF" />
                      </g>
                    )}

                    {/* Stage 2 & 3 Breakout Line Extension & Glowing Area */}
                    {activeStep >= 1 && (
                      <g className={styles.breakoutGraphic}>
                        {/* Golden Area Under Breakout */}
                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          d={
                            activeStep === 1
                              ? "M 340 175 Q 365 175 410 130 L 485 75 L 485 270 L 340 270 Z"
                              : "M 340 175 Q 365 175 410 130 L 495 62 L 495 270 L 340 270 Z"
                          }
                          fill="url(#glowAreaGrad)"
                        />

                        {/* Breakout Surge Curve */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          d={
                            activeStep === 1
                              ? "M 340 175 Q 365 175 410 130 L 485 75"
                              : "M 340 175 Q 365 175 410 130 L 495 62"
                          }
                          className={styles.breakoutLine}
                        />

                        {/* Breakout Point Indicator */}
                        <circle cx="340" cy="175" r="11" className={styles.breakoutSonar} />
                        <circle cx="340" cy="175" r="4.5" fill="none" stroke="#FFE693" strokeWidth="1.5" />
                        <circle cx="340" cy="175" r="2.5" fill="#FFE693" />

                        {/* Current Price Tip Dot */}
                        <circle 
                          cx={activeStep === 1 ? "485" : "495"} 
                          cy={activeStep === 1 ? "75" : "62"} 
                          r="5" 
                          fill="url(#pointGlowHalo)" 
                        />
                      </g>
                    )}
                  </svg>

                  {/* Stage 3 Breakout Toast Alert Card */}
                  <AnimatePresence>
                    {activeStep === 2 && (
                      <motion.div 
                        className={styles.toastCard}
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className={styles.toastTopRow}>
                          <span className={styles.toastBadge}>RESISTANCE BREAK</span>
                          <span className={styles.toastTime}>JUST NOW</span>
                        </div>
                        <div className={styles.toastMainTitle}>
                          PLTR · $88.41
                        </div>
                        <div className={styles.toastSubtitle}>
                          +6.72% past $86.20
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Scrolling Steps */}
          <div className={styles.scrollingColumn}>
            {stepsData.map((item, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={index}
                  ref={(el) => (stepRefs.current[index] = el)}
                  className={`${styles.stepBlock} ${isActive ? styles.stepActive : ''}`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className={styles.stepHeader}>
                    <div className={styles.numberBadge}>
                      {item.step}
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <p className={styles.stepDesc}>{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './beforeAfterComparison.module.scss';
import Textbutton from '@/components/textbutton';

// High-Density Realistic 60-Candle Wave Dataset matching TradingView Chart
const candlesData = [
  { open: 510, high: 525, low: 505, close: 518 },
  { open: 518, high: 535, low: 512, close: 532 },
  { open: 532, high: 545, low: 528, close: 520 },
  { open: 520, high: 528, low: 485, close: 490 },
  { open: 490, high: 515, low: 480, close: 508 },
  { open: 508, high: 512, low: 468, close: 472 },
  { open: 472, high: 498, low: 465, close: 492 }, // Candle 6 - Weak Buy
  { open: 492, high: 496, low: 458, close: 464 },
  { open: 464, high: 478, low: 442, close: 448 },
  { open: 448, high: 458, low: 432, close: 440 },
  { open: 440, high: 455, low: 435, close: 448 },
  { open: 448, high: 452, low: 430, close: 435 },
  { open: 435, high: 450, low: 428, close: 442 },
  { open: 442, high: 448, low: 425, close: 430 },
  { open: 430, high: 465, low: 422, close: 458 },
  { open: 458, high: 472, low: 445, close: 450 },
  { open: 450, high: 468, low: 438, close: 462 }, // Candle 16 - Normal Sell
  { open: 462, high: 470, low: 418, close: 424 }, 
  { open: 424, high: 445, low: 420, close: 438 },
  { open: 438, high: 448, low: 430, close: 434 },
  { open: 434, high: 442, low: 422, close: 428 },
  { open: 428, high: 448, low: 425, close: 440 }, // Candle 21 - TP1
  { open: 440, high: 452, low: 432, close: 446 },
  { open: 446, high: 460, low: 435, close: 442 },
  { open: 442, high: 458, low: 430, close: 452 },
  { open: 452, high: 475, low: 448, close: 468 },
  { open: 468, high: 482, low: 405, close: 415 }, // Candle 26 - Sweep & TP2
  { open: 415, high: 488, low: 410, close: 482 }, // Candle 27 - SMRT Buy
  { open: 482, high: 495, low: 475, close: 488 },
  { open: 488, high: 492, low: 460, close: 468 },
  { open: 468, high: 485, low: 462, close: 480 },
  { open: 480, high: 508, low: 478, close: 502 },
  { open: 502, high: 522, low: 498, close: 518 },
  { open: 518, high: 535, low: 505, close: 510 },
  { open: 510, high: 528, low: 495, close: 522 },
  { open: 522, high: 538, low: 512, close: 528 },
  { open: 528, high: 545, low: 518, close: 536 },
  { open: 536, high: 550, low: 525, close: 542 },
  { open: 542, high: 548, low: 518, close: 522 },
  { open: 522, high: 540, low: 515, close: 535 },
  { open: 535, high: 552, low: 528, close: 545 },
  { open: 545, high: 568, low: 540, close: 560 },
  { open: 560, high: 585, low: 555, close: 572 }, // Candle 42 - SMRT Sell Peak
  { open: 572, high: 578, low: 538, close: 542 },
  { open: 542, high: 555, low: 532, close: 548 },
  { open: 548, high: 558, low: 530, close: 536 },
  { open: 536, high: 546, low: 522, close: 540 },
  { open: 540, high: 548, low: 512, close: 518 },
  { open: 518, high: 528, low: 488, close: 495 },
  { open: 495, high: 512, low: 462, close: 468 }, // Candle 49 - Sharp Sell Dump
  { open: 468, high: 490, low: 460, close: 484 },
  { open: 484, high: 522, low: 480, close: 515 }, // Strong V-Rally
  { open: 515, high: 538, low: 508, close: 532 },
  { open: 532, high: 552, low: 525, close: 546 },
  { open: 546, high: 562, low: 540, close: 555 },
  { open: 555, high: 570, low: 548, close: 564 },
  { open: 564, high: 572, low: 538, close: 545 },
  { open: 545, high: 555, low: 528, close: 532 },
  { open: 532, high: 542, low: 515, close: 520 },
  { open: 520, high: 528, low: 482, close: 488 }
];

export default function BeforeAfterComparison() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Handle Drag / Touch Move to update slider position smoothly
  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const onPointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleWindowPointerMove = (e) => {
      if (isDragging) updatePosition(e.clientX);
    };
    const handleWindowPointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('pointerup', handleWindowPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [isDragging, updatePosition]);

  // Chart dimensions & scaling
  const width = 960;
  const height = 480;
  const padding = { top: 40, bottom: 40, left: 15, right: 195 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minPrice = 390;
  const maxPrice = 600;
  const priceRange = maxPrice - minPrice;

  const priceToY = (val) => {
    return height - padding.bottom - ((val - minPrice) / priceRange) * chartHeight;
  };

  const candleWidth = chartWidth / candlesData.length;
  const currentPrice = candlesData[candlesData.length - 1].close;

  // Gridlines Data
  const horizontalGridLines = [410, 440, 470, 500, 530, 560, 590];
  const verticalGridLines = Array.from({ length: 16 }, (_, i) => padding.left + i * (chartWidth / 15));

  return (
    <section className={styles.comparisonSection} aria-label="Before vs After Algorithm Comparison">
      <div className="container">
        
        {/* Standardized Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badgeWrapper}>
            <Textbutton text="BEFORE vs AFTER ALGORITHM" />
          </div>
          <h2>
            SEE THE DIFFERENCE. <br />
            <span>RAW CHART vs CHRONOSX ALGO.</span>
          </h2>
          <p className={styles.subtext}>
            Transform noisy raw market price action into institutional trade execution setups. Drag the slider to reveal high-impact AI Buy/Sell signals, liquidity sweeps, and multi-timeframe backtest confluence.
          </p>
        </div>

        {/* Interactive Comparison Card Container */}
        <div 
          className={styles.comparisonCard} 
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >

          {/* LAYER 1: BEFORE (Raw Candlestick Chart ONLY) */}
          <div className={styles.layerBefore}>
            <div className={styles.badgeBefore}>BEFORE</div>
            
            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart} preserveAspectRatio="xMidYMid meet">
              {/* Background Fine Grid Lines */}
              {verticalGridLines.map((x, i) => (
                <line key={`vgrid-before-${i}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}
              {horizontalGridLines.map((price, i) => (
                <line key={`hgrid-before-${i}`} x1={0} y1={priceToY(price)} x2={width} y2={priceToY(price)} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}

              {/* Current Price Dotted Baseline */}
              <line x1={0} y1={priceToY(currentPrice)} x2={width - padding.right} y2={priceToY(currentPrice)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1.2" />

              {/* High-Density Candlesticks Render (Raw Price Action) */}
              {candlesData.map((c, i) => {
                const x = padding.left + i * candleWidth + candleWidth / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? '#26A69A' : '#EF5350';
                const yTop = priceToY(Math.max(c.open, c.close));
                const yBot = priceToY(Math.min(c.open, c.close));
                const hBody = Math.max(2, yBot - yTop);
                const yHigh = priceToY(c.high);
                const yLow = priceToY(c.low);
                const bodyW = Math.max(3.2, candleWidth * 0.68);

                return (
                  <g key={`before-${i}`}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.3" />
                    <rect x={x - bodyW / 2} y={yTop} width={bodyW} height={hBody} fill={color} rx="1" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* LAYER 2: AFTER SMRT ALGO (Full Signals Revealed Across Entire Chart Width) */}
          <div 
            className={styles.layerAfter}
            style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
          >
            <div className={styles.badgeAfter}>AFTER SMRT ALGO</div>

            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart} preserveAspectRatio="xMidYMid meet">
              {/* Background Fine Grid Lines */}
              {verticalGridLines.map((x, i) => (
                <line key={`vgrid-after-${i}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}
              {horizontalGridLines.map((price, i) => (
                <line key={`hgrid-after-${i}`} x1={0} y1={priceToY(price)} x2={width} y2={priceToY(price)} stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              ))}

              {/* Shaded Liquidity Imbalance Zones Across Chart */}
              {/* Zone 1: Left Dip Support */}
              <rect x={padding.left + 5 * candleWidth} y={priceToY(470)} width={90} height={18} fill="rgba(38, 166, 154, 0.22)" rx="3" />
              {/* Zone 2: Middle Resistance Block */}
              <rect x={padding.left + 16 * candleWidth} y={priceToY(475)} width={110} height={20} fill="rgba(236, 72, 153, 0.22)" rx="3" stroke="#EC4899" strokeDasharray="3 3" strokeWidth="1" />
              {/* Zone 3: SMRT Buy Base Corridor */}
              <rect x={padding.left + 26 * candleWidth} y={priceToY(445)} width={100} height={22} fill="rgba(38, 166, 154, 0.28)" rx="3" stroke="#26A69A" strokeWidth="1" />
              {/* Zone 4: Top Right Peak Liquidity Corridor */}
              <rect x={padding.left + 40 * candleWidth} y={priceToY(582)} width={140} height={26} fill="rgba(236, 72, 153, 0.28)" rx="3" />
              <rect x={padding.left + 40 * candleWidth} y={priceToY(495)} width={140} height={22} fill="rgba(38, 166, 154, 0.25)" rx="3" />

              {/* Dotted Level Lines with Volume Labels Across Chart */}
              <line x1={padding.left + 40 * candleWidth} y1={priceToY(576)} x2={width - padding.right + 10} y2={priceToY(576)} stroke="#EC4899" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(576) + 4} fill="#EC4899" fontSize="10" fontFamily="monospace" fontWeight="bold">576.825K (100%)</text>

              <line x1={padding.left + 40 * candleWidth} y1={priceToY(495)} x2={width - padding.right + 10} y2={priceToY(495)} stroke="#38BDF8" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(495) + 4} fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">404.007K (77%)</text>

              <line x1={padding.left + 40 * candleWidth} y1={priceToY(462)} x2={width - padding.right + 10} y2={priceToY(462)} stroke="#38BDF8" strokeDasharray="3 3" strokeWidth="1.2" />
              <text x={width - padding.right + 15} y={priceToY(462) + 4} fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">1.431M (22%)</text>

              {/* Current Price Dotted Baseline */}
              <line x1={0} y1={priceToY(currentPrice)} x2={width - padding.right} y2={priceToY(currentPrice)} stroke="#EF5350" strokeDasharray="3 3" strokeWidth="1.2" />

              {/* High-Density Candlesticks Render */}
              {candlesData.map((c, i) => {
                const x = padding.left + i * candleWidth + candleWidth / 2;
                const isBull = c.close >= c.open;
                const color = isBull ? '#26A69A' : '#EF5350';
                const yTop = priceToY(Math.max(c.open, c.close));
                const yBot = priceToY(Math.min(c.open, c.close));
                const hBody = Math.max(2, yBot - yTop);
                const yHigh = priceToY(c.high);
                const yLow = priceToY(c.low);
                const bodyW = Math.max(3.2, candleWidth * 0.68);

                return (
                  <g key={`after-${i}`}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.3" />
                    <rect x={x - bodyW / 2} y={yTop} width={bodyW} height={hBody} fill={color} rx="1" />
                  </g>
                );
              })}

              {/* SIGNAL 1 (LEFT SWING): Weak Buy ★ 3 & TP3 */}
              <g transform={`translate(${padding.left + 6 * candleWidth - 34}, ${priceToY(445) + 12})`}>
                <rect width="68" height="24" rx="5" fill="#0D9488" />
                <text x="34" y="11" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="800" textAnchor="middle">Weak Buy</text>
                <text x="34" y="20" fill="#FFE693" fontSize="8.5" fontFamily="monospace" fontWeight="800" textAnchor="middle">★ 3</text>
                <polygon points="34,-4 29,1 39,1" fill="#0D9488" />
              </g>
              <line x1={padding.left + 2 * candleWidth} y1={priceToY(545)} x2={padding.left + 8 * candleWidth} y2={priceToY(545)} stroke="#34D399" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 2.5 * candleWidth} cy={priceToY(545)} r="3.5" fill="#34D399" />
              <text x={padding.left + 2.5 * candleWidth - 6} y={priceToY(545) - 6} fill="#34D399" fontSize="9" fontFamily="monospace" fontWeight="bold">TP3</text>

              {/* SIGNAL 2 (MIDDLE SWING): Normal Sell ★ 3 & TP1 / TP2 & Sweep */}
              <g transform={`translate(${padding.left + 16 * candleWidth - 36}, ${priceToY(470) - 48})`}>
                <rect width="72" height="24" rx="5" fill="#E11D48" />
                <text x="36" y="11" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="800" textAnchor="middle">Normal Sell</text>
                <text x="36" y="20" fill="#FFE693" fontSize="8.5" fontFamily="monospace" fontWeight="800" textAnchor="middle">★ 3</text>
                <polygon points="36,28 31,24 41,24" fill="#E11D48" />
              </g>

              <line x1={padding.left + 17 * candleWidth} y1={priceToY(430)} x2={padding.left + 22 * candleWidth} y2={priceToY(430)} stroke="#EC4899" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={padding.left + 21 * candleWidth} cy={priceToY(430)} r="3.5" fill="#EC4899" />
              <text x={padding.left + 21 * candleWidth - 6} y={priceToY(430) + 12} fill="#EC4899" fontSize="9" fontFamily="monospace" fontWeight="bold">TP1</text>

              <circle cx={padding.left + 26 * candleWidth} cy={priceToY(405)} r="3.5" fill="#EC4899" />
              <text x={padding.left + 26 * candleWidth - 6} y={priceToY(405) + 12} fill="#EC4899" fontSize="9" fontFamily="monospace" fontWeight="bold">TP2</text>

              <g transform={`translate(${padding.left + 26 * candleWidth}, ${priceToY(405) + 26})`}>
                <text x="0" y="0" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">✕</text>
                <text x="0" y="12" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sweep</text>
              </g>

              {/* SIGNAL 3 (BREAKOUT BASE): SMRT Buy ★ 3 */}
              <g transform={`translate(${padding.left + 27 * candleWidth - 36}, ${priceToY(410) + 8})`}>
                <rect width="72" height="24" rx="5" fill="#10B981" />
                <text x="36" y="11" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="800" textAnchor="middle">SMRT Buy</text>
                <text x="36" y="20" fill="#FFE693" fontSize="8.5" fontFamily="monospace" fontWeight="800" textAnchor="middle">★ 3</text>
                <polygon points="36,-4 31,1 41,1" fill="#10B981" />
              </g>

              {/* SIGNAL 4 (TOP PEAK): SMRT Sell ★ 3 & TP1 & Right Sweep */}
              <g transform={`translate(${padding.left + 42 * candleWidth - 36}, ${priceToY(585) - 52})`}>
                <rect width="72" height="26" rx="6" fill="#F43F5E" />
                <text x="36" y="12" fill="#FFFFFF" fontSize="9.5" fontFamily="monospace" fontWeight="800" textAnchor="middle">SMRT Sell</text>
                <text x="36" y="22" fill="#FFE693" fontSize="9" fontFamily="monospace" fontWeight="800" textAnchor="middle">★ 3</text>
                <polygon points="36,31 31,26 41,26" fill="#F43F5E" />
              </g>

              <line x1={padding.left + 44 * candleWidth} y1={priceToY(590)} x2={width - padding.right} y2={priceToY(590)} stroke="#34D399" strokeDasharray="4 4" strokeWidth="1.2" />
              <circle cx={padding.left + 46 * candleWidth} cy={priceToY(590)} r="4" fill="#34D399" />
              <text x={padding.left + 46 * candleWidth - 8} y={priceToY(590) - 8} fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">TP1</text>

              <g transform={`translate(${padding.left + 49 * candleWidth}, ${priceToY(462) + 12})`}>
                <text x="0" y="0" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">✕</text>
                <text x="0" y="14" fill="#38BDF8" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Sweep</text>
              </g>
            </svg>

            {/* MTF Telemetry & Backtest Table HUD Overlay */}
            <div className={styles.mtfHudOverlay}>
              {/* Parameters Table */}
              <div className={styles.hudTableWrapper}>
                <div className={styles.hudTableHeader}>
                  <span>MTF</span>
                  <span>Parameters</span>
                  <span>Data</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>5M</span>
                  <span>Sentiment Range</span>
                  <span className={styles.valGreen}>28.38%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>M15</span>
                  <span>Footprint</span>
                  <span className={styles.valRed}>15.57%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>M30</span>
                  <span>Trend Strength</span>
                  <span className={styles.valRed}>19.14%</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>1H</span>
                  <span>Condition</span>
                  <span className={styles.valRed}>Bearish</span>
                </div>
                <div className={styles.hudTableRow}>
                  <span className={styles.tfBadge}>4H</span>
                  <span>Optimal Sensitivity</span>
                  <span className={styles.valWhite}>2</span>
                </div>
              </div>

              {/* Backtest Win Rate Table */}
              <div className={styles.backtestTable}>
                <div className={styles.btHeader}>Backtest Table</div>
                <div className={styles.btGrid}>
                  <div>
                    <span className={styles.btLabel}>TP1 %</span>
                    <span className={styles.btVal}>78.13%</span>
                  </div>
                  <div>
                    <span className={styles.btLabel}>TP2 %</span>
                    <span className={styles.btVal}>65.63%</span>
                  </div>
                  <div>
                    <span className={styles.btLabel}>TP3 %</span>
                    <span className={styles.btVal}>50%</span>
                  </div>
                </div>
              </div>

              {/* Trend Strength Meter */}
              <div className={styles.trendStrengthBox}>
                <div className={styles.tsHeader}>
                  <span>Trend Strength</span>
                  <span className={styles.tsLabel}>Bullish Momentum</span>
                </div>
                <div className={styles.tsMeterBar}>
                  <div className={styles.tsMeterFill} style={{ width: '44.8%' }} />
                </div>
                <span className={styles.tsScore}>0.448</span>
              </div>
            </div>
          </div>

          {/* Central Draggable Slider Bar & Handle */}
          <div 
            className={styles.sliderLine} 
            style={{ left: `${sliderPos}%` }}
          >
            <div className={styles.sliderHandle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Drag Pill Badge */}
          <div className={styles.dragBadgePill}>
            <span>Drag to compare</span>
          </div>

        </div>

      </div>
    </section>
  );
}

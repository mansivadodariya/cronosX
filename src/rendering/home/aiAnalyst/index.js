"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './aiAnalyst.module.scss';
import Textbutton from '@/components/textbutton';

const conversationFlow = [
  {
    user: "Top 3 names with breakouts this hour?",
    bot: [
      "Here are the top 3 breakout leaders with >2.4x volume surge:",
      "1. PLTR ($88.41) — Broke 20-day resistance at $86.20 with +6.72% candle close.",
      "2. NVDA ($138.20) — Bullish flag breakout confirmed on 15m timeframe.",
      "3. AMD ($164.50) — MACD golden cross with institutional block buying."
    ]
  },
  {
    user: "What's the risk-to-reward on PLTR right now?",
    bot: [
      "Stop loss recommended at $85.80 (below previous resistance turned support).",
      "Current Risk/Reward ratio is 1:3.4 with initial target at $94.20 on strong volume confirmation."
    ]
  },
  {
    user: "Any volume divergence on BTC 4H chart?",
    bot: [
      "RSI bullish divergence detected at $64,200 support.",
      "Selling pressure has dropped 42% over the last 3 candles while price holds above the 50 EMA."
    ]
  }
];

const featurePoints = [
  {
    num: "01",
    title: "Reads what the platform shows.",
    desc: "Indicator state, heat-list rank, open ticker, your watchlist — ChronosX answers in that frame, not from thin air."
  },
  {
    num: "02",
    title: "Indicators are the source of truth.",
    desc: "ChronosX quotes the algorithm and the indicators verbatim. It does not invent signals or override them."
  },
  {
    num: "03",
    title: "Knows when to say 'I don't know.'",
    desc: "Surfaces the underlying number or chart instead of guessing. No false confidence."
  }
];

// Typewriter Bot Message Streamer
function TypewriterBotMessage({ lines, onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([""]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (!lines || lines.length === 0) return;

    if (currentLineIndex < lines.length) {
      const targetLine = lines[currentLineIndex];
      if (currentCharIndex < targetLine.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[currentLineIndex] = targetLine.slice(0, currentCharIndex + 1);
            return next;
          });
          setCurrentCharIndex((prev) => prev + 1);
        }, 12);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, ""]);
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 70);
        return () => clearTimeout(timeout);
      }
    } else {
      if (onComplete) onComplete();
    }
  }, [lines, currentLineIndex, currentCharIndex, onComplete]);

  return (
    <div className={styles.botBubble}>
      <span className={styles.botSenderLabel}>CHRONOSX</span>
      <div className={styles.botContent}>
        {displayedLines.map((line, idx) => (
          <p key={idx} className={styles.botLine}>
            {line}
            {idx === currentLineIndex && currentLineIndex < lines.length && (
              <span className={styles.typeCursor}>|</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AiAnalyst() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [flowIndex, setFlowIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll chat body on content updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Autonomous Live Chat Loop
  useEffect(() => {
    if (isUserInteracting) return;

    let timer;
    const currentConv = conversationFlow[flowIndex];

    // Reset messages when loop cycles
    if (messages.length === 0) {
      timer = setTimeout(() => {
        // Step 1: User asks question
        setMessages([{ role: 'user', text: currentConv.user }]);
        setIsThinking(true);

        // Step 2: Bot thinks and streams answers with typewriter animation
        setTimeout(() => {
          setIsThinking(false);
          setMessages([
            { role: 'user', text: currentConv.user },
            { role: 'bot', lines: currentConv.bot }
          ]);
        }, 1600);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [flowIndex, messages.length, isUserInteracting]);

  const handleBotTypingComplete = () => {
    if (isUserInteracting) return;
    // Step 3: Advance to next conversation after reading pause
    setTimeout(() => {
      setMessages([]);
      setFlowIndex((prev) => (prev + 1) % conversationFlow.length);
    }, 5500);
  };

  // Handle manual user submission
  const handleSendMessage = (e) => {
    e?.preventDefault();
    const query = userInput.trim();
    if (!query) return;

    setIsUserInteracting(true);
    setUserInput('');
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const responses = [
        "Analyzing real-time institutional order flow and volume delta...",
        `Bullish structure confirmed for ${query.toUpperCase()}. Volume is 1.8x average with key support holding.`,
        "Risk/Reward profile is favorable. Target 1: +4.2%, Invalidation: -1.4%."
      ];
      setMessages((prev) => [
        ...prev,
        { role: 'bot', lines: responses }
      ]);

      // Resume auto loop after 10s
      setTimeout(() => {
        setIsUserInteracting(false);
      }, 10000);
    }, 1400);
  };

  const handleQuickPrompt = (promptText) => {
    setUserInput(promptText);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <section className={styles.aiAnalystSection}>
      <div className="container">
        <div className={styles.mainGrid}>
          
          {/* Left Column: Live Interactive AI Chat Box */}
          <motion.div 
            className={styles.chatWrapper}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.chatCard}>
              {/* Chat Card Header (Clean header without live symbol) */}
              <div className={styles.chatHeader}>
                <div className={styles.aiProfile}>
                  <div className={styles.avatarOrb}>
                    <span className={styles.pulseCore}></span>
                  </div>
                  <div className={styles.aiMeta}>
                    <h4>ChronosX</h4>
                    <span>AI · ALWAYS ON</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Stream Viewport */}
              <div className={styles.chatBody} ref={chatBodyRef}>
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={msg.role === 'user' ? styles.userMsgRow : styles.botMsgRow}
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {msg.role === 'user' ? (
                        <div className={styles.userBubble}>
                          <span className={styles.userSenderLabel}>YOU</span>
                          <div className={styles.userText}>{msg.text}</div>
                        </div>
                      ) : (
                        <TypewriterBotMessage
                          lines={msg.lines}
                          onComplete={handleBotTypingComplete}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* AI Thinking Indicator */}
                {isThinking && (
                  <motion.div 
                    className={styles.thinkingWrapper}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className={styles.botSenderLabel}>CHRONOSX</span>
                    <div className={styles.thinkingPill}>
                      <span className={styles.dot1}></span>
                      <span className={styles.dot2}></span>
                      <span className={styles.dot3}></span>
                      <span className={styles.thinkingText}>THINKING</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className={styles.quickPrompts}>
                <button 
                  type="button" 
                  onClick={() => handleQuickPrompt("Top 3 breakouts this hour")}
                  className={styles.promptChip}
                >
                  ⚡ Top Breakouts
                </button>
                <button 
                  type="button" 
                  onClick={() => handleQuickPrompt("Check BTC support level")}
                  className={styles.promptChip}
                >
                  📊 BTC Support
                </button>
              </div>

              {/* Interactive Chat Input Box */}
              <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask ChronosX anything..."
                  className={styles.chatInput}
                />
                <button type="submit" className={styles.sendButton} aria-label="Send message">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Section Header & Feature Points */}
          <motion.div 
            className={styles.contentColumn}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.header}>
              <div className={styles.badgeWrapper}>
                <Textbutton text="CHRONOSX · AI MARKET ANALYST" />
              </div>
              <h2>
                AI ON TOP OF INDICATORS. <br />
                <span>NOT INSTEAD OF THEM.</span>
              </h2>
              <p className={styles.leadDesc}>
                The signals come from the indicators and the institutional algorithms. ChronosX reads them back to you — ask why a breakout fired, sort the heat list by sector, or pull the last MACD reversal, in plain English.
              </p>
            </div>

            {/* Feature List Points */}
            <div className={styles.featureList}>
              {featurePoints.map((item, index) => (
                <div key={index} className={styles.featureItem}>
                  <div className={styles.numBadge}>{item.num}</div>
                  <div className={styles.featureContent}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './languageToggle.module.scss';

const GlobeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case 'ar':
        return 'العربية';
      case 'ph':
        return 'Filipino';
      case 'en':
      default:
        return 'English';
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'ph', label: 'Filipino' },
  ];

  return (
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className={styles.globeIcon}>
          <GlobeIcon />
        </span>
        
        <span className={styles.label}>
          {getLanguageLabel(language)}
        </span>

        <span
          className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`${styles.dropdownOption} ${language === item.code ? styles.activeOption : ''}`}
                onClick={() => handleSelectLanguage(item.code)}
              >
                <span>{item.label}</span>
                {language === item.code && (
                  <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

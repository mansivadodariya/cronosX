'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './topbar.module.scss';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId, hydrateUserFromProfile } from '@/lib/authSession';
import { CREDITS_UPDATED_EVENT } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/languageToggle';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const CoinDocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="7" width="6" height="10" rx="1" />
    <path d="M11 10h2M11 13h2" />
  </svg>
);

const Topbar = ({ onMenuClick }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async (userId) => {
    if (!userId) return;
    try {
      const res = await dashboardApi.getStats(userId);
      setCredits(res?.data?.available_credits ?? 0);
    } catch (err) {
      if (!err?.message?.includes('Session expired')) { /* skip */ }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const parsed = getStoredUser();
        const userId = getStoredUserId();
        if (!parsed && !userId) {
          router.replace('/login');
          return;
        }
        await hydrateUserFromProfile(userId, parsed || { id: userId, user_id: userId });
        await fetchCredits(userId);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    init();
    window.addEventListener('user:updated', init);
    return () => window.removeEventListener('user:updated', init);
  }, [router]);

  useEffect(() => {
    const onCreditsUpdated = (e) => {
      const next = e?.detail?.available_credits;
      if (next !== undefined && next !== null) {
        setCredits(next);
      }
    };
    window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
    return () => window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
  }, []);

  if (loading) {
    return (
      <div className={styles.topbar}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.right}>
          <div className={styles.skeletonCredits} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={styles.right}>
        {/* Sun / Dark Mode Aesthetic Button */}
        <button className={styles.themeToggle} aria-label="Theme" type="button">
          <SunIcon />
        </button>

        {/* Language Selector */}
        <LanguageToggle />

        {/* Credits Badge */}
        <div className={styles.credits} onClick={() => router.push('/plans')} role="button" tabIndex={0}>
          <CoinDocIcon />
          <span>{credits ?? 0} {t('topbar.credits', 'credits')}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

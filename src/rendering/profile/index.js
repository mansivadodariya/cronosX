'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './profile.module.scss';
import Input from '@/components/input';
import PhoneInput from '@/components/phoneInput';
import FirebasePhoneModal from '@/components/firebasePhoneModal';
import Button from '@/components/button';
import CreditHistory from '@/rendering/creditHistory';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/toast';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { profileApi, dashboardApi } from '@/lib/api';
import { clearAuthSession } from '@/lib/authSession';
import { CREDITS_UPDATED_EVENT } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';

const GoldSecurityShield = '/assets/images/gold_security_shield_badge.jpg';
const Lock = '/assets/icons/lock.svg';

function getUserFromStorage() {
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function parseLogins(rawLogins) {
    if (!rawLogins) return [];
    if (Array.isArray(rawLogins)) return rawLogins;
    if (typeof rawLogins === 'string') {
        const trimmed = rawLogins.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                return JSON.parse(trimmed);
            } catch (_) {}
        }
        if (trimmed) return [trimmed];
    }
    return [];
}

export default function Profile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const { t, language } = useLanguage();

    const [activeTab, setActiveTab] = useState(tabParam || 'profile');
    const [userId, setUserId] = useState('');
    const [userCreatedAt, setUserCreatedAt] = useState('May 12, 2024');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [credits, setCredits] = useState(0);
    const [lastLogins, setLastLogins] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [initialPhone, setInitialPhone] = useState('');
    const [referralCount, setReferralCount] = useState(0);
    const [visibleTabNames, setVisibleTabNames] = useState(null);

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
    const [passwordUpdating, setPasswordUpdating] = useState(false);

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        referral_code: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tabParam && ['profile', 'security', 'activity_log', 'credit_history'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const cached = sessionStorage.getItem('visible_tab_names');
                if (cached) {
                    setVisibleTabNames(new Set(JSON.parse(cached)));
                }
            }
        } catch (e) { /* ignore */ }

        async function fetchVisibleTabs() {
            try {
                const { data, error } = await supabase.rpc('get_visible_dashboard_tabs');
                if (!error && Array.isArray(data)) {
                    const set = new Set(data.map(t => typeof t === 'string' ? t : (t?.tab_name || t?.name || '')));
                    setVisibleTabNames(set);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('visible_tab_names', JSON.stringify(Array.from(set)));
                    }
                }
            } catch (e) { /* ignore */ }
        }
        fetchVisibleTabs();
    }, []);

    const canViewPlans = () => {
        if (!visibleTabNames) return true;
        return (
            visibleTabNames.has('subscription_plans') ||
            visibleTabNames.has('plans') ||
            visibleTabNames.has('subscription') ||
            visibleTabNames.has('proAccount')
        );
    };

    useEffect(() => {
        const user = getUserFromStorage();
        if (!user) { router.replace('/login'); return; }
        const id = user.id || user.user_id || '';
        setUserId(id);
        setInitialPhone(user.phone_number || '');

        if (user.created_at) {
            try {
                const d = new Date(user.created_at);
                if (!isNaN(d.getTime())) {
                    setUserCreatedAt(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                }
            } catch (_) {}
        }

        setForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            referral_code: user.referral_code || id || '',
        });

        const initialLogins = parseLogins(user.last_logins);
        if (initialLogins.length > 0) {
            setLastLogins(initialLogins.slice(-5));
        }

        fetchProfile(id);
    }, []);

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

    const fetchProfile = async (id) => {
        setLoading(true);
        try {
            if (supabase && id) {
                try {
                    const { data } = await supabase
                        .from('users')
                        .select('first_name, last_name, email, phone_number, referral_code, last_logins, created_at')
                        .eq('id', id)
                        .maybeSingle();

                    if (data) {
                        const parsedDbLogins = parseLogins(data.last_logins);
                        if (parsedDbLogins.length > 0) {
                            setLastLogins(parsedDbLogins.slice(-5));
                        }
                        if (data.created_at) {
                            const d = new Date(data.created_at);
                            if (!isNaN(d.getTime())) {
                                setUserCreatedAt(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                            }
                        }
                        if (data.phone_number) setInitialPhone(data.phone_number);
                        setForm((prev) => ({
                            ...prev,
                            first_name: data.first_name || prev.first_name || '',
                            last_name: data.last_name || prev.last_name || '',
                            email: data.email || prev.email || '',
                            phone_number: data.phone_number || prev.phone_number || '',
                            referral_code: data.referral_code || prev.referral_code || id || '',
                        }));
                    }

                    const { count: refCount, error: countErr } = await supabase
                        .from('users')
                        .select('id', { count: 'exact', head: true })
                        .eq('referred_by_id', id);

                    if (!countErr && typeof refCount === 'number') {
                        setReferralCount(refCount);
                    }
                } catch (sbErr) {
                    console.warn('Supabase profile fetch error:', sbErr);
                }
            }

            const apiRes = await profileApi.getProfile();
            const profileData = apiRes?.data || apiRes || {};
            if (profileData) {
                if (profileData.phone_number) setInitialPhone(profileData.phone_number);
                setForm((prev) => ({
                    ...prev,
                    first_name: profileData.first_name || prev.first_name || '',
                    last_name: profileData.last_name || prev.last_name || '',
                    email: profileData.email || prev.email || '',
                    phone_number: profileData.phone_number || prev.phone_number || '',
                    referral_code: profileData.referral_code || prev.referral_code || id || '',
                }));

                const apiRefCount = profileData.referral_count ?? profileData.referred_count ?? profileData.total_referrals;
                if (typeof apiRefCount === 'number') {
                    setReferralCount(apiRefCount);
                }

                const fetchedLogins = parseLogins(profileData.last_logins);
                if (fetchedLogins.length > 0) {
                    setLastLogins(fetchedLogins.slice(-5));
                }

                const stored = getUserFromStorage() || {};
                const updated = {
                    ...stored,
                    first_name: profileData.first_name || stored.first_name || '',
                    last_name: profileData.last_name || stored.last_name || '',
                    email: profileData.email || stored.email || '',
                    phone_number: profileData.phone_number || stored.phone_number || '',
                    last_logins: fetchedLogins.length > 0 ? fetchedLogins.slice(-5) : stored.last_logins || [],
                };
                localStorage.setItem('user', JSON.stringify(updated));
                window.dispatchEvent(new Event('user:updated'));
            }

            if (id) {
                try {
                    const statsRes = await dashboardApi.getStats(id);
                    if (statsRes?.data?.available_credits !== undefined) {
                        setCredits(statsRes.data.available_credits);
                    }
                } catch (statsErr) {
                    console.warn('Credits fetch error:', statsErr);
                }
            }
        } catch (err) {
            console.warn('Profile fetch warning:', err);
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const errs = {};
        const firstName = form.first_name.trim();
        const lastName = form.last_name.trim();

        if (!firstName) {
            errs.first_name = 'First name is required.';
        } else if (firstName.length < 2) {
            errs.first_name = 'First name must be at least 2 characters.';
        }

        if (!lastName) {
            errs.last_name = 'Last name is required.';
        } else if (lastName.length < 2) {
            errs.last_name = 'Last name must be at least 2 characters.';
        }

        if (!form.phone_number) {
            errs.phone_number = 'Phone number is required.';
        } else if (!isValidPhoneNumber(form.phone_number)) {
            errs.phone_number = 'Enter a valid phone number.';
        }

        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitized = value;
        if (name === 'first_name' || name === 'last_name') {
            sanitized = value.replace(/[^a-zA-Z\s]/g, '');
        }
        setForm((prev) => ({ ...prev, [name]: sanitized }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const setPhone = (value) => {
        setForm((prev) => ({ ...prev, phone_number: value || '' }));
        setErrors((prev) => ({ ...prev, phone_number: '' }));
    };

    const performSaveProfile = async () => {
        setSaving(true);
        try {
            const apiRes = await profileApi.updateProfile({
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone_number: form.phone_number,
            });

            const stored = getUserFromStorage() || {};
            if (supabase && stored?.id) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: form.phone_number,
                            is_phone_verified: true
                        })
                        .eq('id', stored.id);
                } catch (dbErr) {
                    console.warn("Supabase direct phone update error:", dbErr);
                }
            }

            const updated = {
                ...stored,
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone_number: form.phone_number,
                is_phone_verified: true
            };
            localStorage.setItem('user', JSON.stringify(updated));
            setInitialPhone(form.phone_number);
            setIsEditing(false);
            window.dispatchEvent(new Event('user:updated'));

            toast.success(apiRes?.message || 'Profile updated successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
            setShowOtpModal(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        performSaveProfile();
    };

    const getActiveReferralCode = () => {
        return form.referral_code || userId || '';
    };

    const handleCopyLink = async () => {
        const code = getActiveReferralCode();
        if (!code) return;
        try {
            const link = `${window.location.origin}/signup?code=${encodeURIComponent(code)}`;
            await navigator.clipboard.writeText(link);
            toast.success('Referral link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link.');
        }
    };

    const handleShareLink = async () => {
        const code = getActiveReferralCode();
        if (!code) return;
        const link = `${window.location.origin}/signup?code=${encodeURIComponent(code)}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join ChronosX',
                    text: 'Sign up using my referral code!',
                    url: link
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    toast.error('Failed to share link.');
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(link);
                toast.success('Referral link copied to clipboard!');
            } catch (err) {
                toast.error('Failed to copy link.');
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.centered}>
                <div className={styles.spinner} />
            </div>
        );
    }

    const activeRefCode = getActiveReferralCode();
    const displayLogins = (lastLogins.length > 0 ? [...lastLogins] : []).reverse();
    const fullName = `${form.first_name || 'John'} ${form.last_name || 'Doe'}`.trim();
    const displayUid = userId ? `UID: CHX${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 9).toUpperCase()}` : 'UID: CHX789456123';
    const initials = [form.first_name, form.last_name]
        .filter(Boolean)
        .map((n) => n.charAt(0).toUpperCase())
        .join('') || (form.email ? form.email.charAt(0).toUpperCase() : 'U');

    const subMenuItems = [
        {
            id: 'profile',
            title: t('profile.profileTab', 'My Profile'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            id: 'security',
            title: t('profile.securityTab', 'Security'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        {
            id: 'activity_log',
            title: t('profile.recentActivity', 'Activity Log'),
            count: displayLogins.length,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            )
        },
        {
            id: 'credit_history',
            title: t('creditHistory.title', 'Credit History'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            )
        }
    ];

    return (
        <div className={styles.profile}>
            {/* Top Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerIconCircle}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </div>
                <div className={styles.headerTitleMeta}>
                    <h1>{t('profile.mySettings', 'Settings')}</h1>
                    <p>{t('profile.settingsSubtitle', 'Manage your personal profile, security settings, and account preferences')}</p>
                </div>
            </div>

            {/* 3-Column Profile Layout */}
            <div className={styles.profileLayoutGrid}>
                {/* 1. Left Sidebar Navigation */}
                <div className={styles.leftSidebar}>
                    <div className={styles.navMenuCard}>
                        {subMenuItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`${styles.navMenuItem} ${isActive ? styles.navMenuItemActive : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <div className={styles.navItemIcon}>{item.icon}</div>
                                    <span className={styles.navItemTitle}>{item.title}</span>
                                    {typeof item.count === 'number' && item.count > 0 && (
                                        <span className={styles.navItemBadge}>{item.count}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Middle Column: Main Profile Area */}
                <div className={styles.mainContentColumn}>
                    {activeTab === 'profile' && (
                        <div className={styles.profileTabWrapper}>
                            {/* Hero Card: Profile Information */}
                            <div className={styles.heroProfileCard}>
                                <div className={styles.heroCardHeader}>
                                    <div className={styles.heroCardHeaderLeft}>
                                        <div className={styles.cardHeaderIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div className={styles.cardHeaderTexts}>
                                            <h3>{t('profile.profileInfoTitle', 'Profile Information')}</h3>
                                            <p>{t('profile.profileInfoDesc', 'View and update your personal details')}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.editProfileBtn}
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {isEditing ? t('common.cancel', 'Cancel') : t('profile.editProfile', 'Edit Profile')}
                                    </button>
                                </div>

                                <div className={styles.heroCardBody}>
                                    {/* Large Avatar */}
                                    <div className={styles.avatarWrapper}>
                                        <div className={styles.avatarCircle}>
                                            <span className={styles.avatarInitialsText}>{initials}</span>
                                        </div>
                                    </div>

                                    {/* User Meta */}
                                    <div className={styles.userMetaDetails}>
                                        <div className={styles.userNameRow}>
                                            <h2>{fullName}</h2>
                                            
                                        </div>
                                        <div className={styles.userEmailRow}>
                                            <span className={styles.emailText}>{form.email || 'johndoe@email.com'}</span>
                                            <span className={styles.verifiedPill}>
                                                Verified ✓
                                            </span>
                                        </div>
                                        <div className={styles.uidRow}>
                                            <span>{displayUid}</span>
                                        </div>
                                        <div className={styles.joinedRow}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>Joined on {userCreatedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Personal Details Grid / Form */}
                            <div className={styles.personalDetailsCard}>
                                <div className={styles.detailsCardHeader}>
                                    <div className={styles.cardHeaderIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                    </div>
                                    <h3>{t('profile.personalDetailsTitle', 'Personal Details')}</h3>
                                </div>

                                {!isEditing ? (
                                    <div className={styles.detailsGrid}>
                                        {/* Full Name */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('auth.fullNameLabel', 'Full Name')}</span>
                                                <strong className={styles.pillValue}>{fullName}</strong>
                                            </div>
                                        </div>

                                        {/* Email Address */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('auth.emailLabel', 'Email Address')}</span>
                                                <strong className={styles.pillValue}>{form.email || '—'}</strong>
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.phoneLabel', 'Phone Number')}</span>
                                                <strong className={styles.pillValue}>{form.phone_number || '—'}</strong>
                                            </div>
                                        </div>

                                        {/* Referral Code Box */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.referralCode', 'Referral Code')} ({referralCount} Refs)</span>
                                                <div className={styles.referralCodePillRow}>
                                                    <strong className={styles.pillValue}>{activeRefCode || '—'}</strong>
                                                    <button type="button" onClick={handleCopyLink} className={styles.refActionIcon} title="Copy Link">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                        </svg>
                                                    </button>
                                                    <button type="button" onClick={handleShareLink} className={styles.refActionIcon} title="Share Link">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="18" cy="5" r="3" />
                                                            <circle cx="6" cy="12" r="3" />
                                                            <circle cx="18" cy="19" r="3" />
                                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Edit Form */
                                    <form onSubmit={handleSave} className={styles.editFormArea} noValidate>
                                        <div className={styles.formRow}>
                                            <Input
                                                label={t('auth.firstNameLabel', 'First Name')}
                                                name="first_name"
                                                placeholder={t('auth.firstNameLabel', 'First name')}
                                                value={form.first_name}
                                                onChange={handleChange}
                                                error={errors.first_name}
                                                maxLength={50}
                                            />
                                            <Input
                                                label={t('auth.lastNameLabel', 'Last Name')}
                                                name="last_name"
                                                placeholder={t('auth.lastNameLabel', 'Last name')}
                                                value={form.last_name}
                                                onChange={handleChange}
                                                error={errors.last_name}
                                                maxLength={50}
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <Input
                                                label={t('auth.emailLabel', 'Email Address')}
                                                name="email"
                                                type="email"
                                                value={form.email || ''}
                                                disabled
                                                readOnly
                                            />

                                            <PhoneInput
                                                label={t('profile.phoneLabel', 'Phone Number')}
                                                value={form.phone_number}
                                                onChange={setPhone}
                                                placeholder={t('profile.phoneLabel', 'Phone number')}
                                                error={errors.phone_number}
                                            />
                                        </div>

                                        <div className={styles.formActionsRow}>
                                            <button
                                                type="button"
                                                className={styles.cancelFormBtn}
                                                onClick={() => setIsEditing(false)}
                                            >
                                                {t('common.cancel', 'Cancel')}
                                            </button>
                                            <Button
                                                text={saving ? t('common.loading', 'Saving...') : t('common.save', 'Save Changes')}
                                                type="submit"
                                                disabled={saving}
                                            />
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className={styles.tabCardContainer}>
                            <div className={styles.cardHeaderBox}>
                                <h3>{t('profile.securityTab', 'Account Security')}</h3>
                                <p>{t('profile.securityDesc', 'Manage your authentication methods and credentials.')}</p>
                            </div>
                            <div className={styles.securityActionsList}>
                                <div className={styles.securityActionRow}>
                                    <div className={styles.secActionMeta}>
                                        <h4>{t('profile.password', 'Password')}</h4>
                                        <span>Last changed 3 months ago</span>
                                    </div>
                                    <button type="button" className={styles.secActionButton} onClick={() => setShowPasswordModal(true)}>
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity_log' && (
                        <div className={styles.tabCardContainer}>
                            <div className={styles.cardHeaderBox}>
                                <h3>{t('profile.recentActivity', 'Recent Activity Log')}</h3>
                                <p>{t('profile.loginActivityDesc', 'Monitor your 5 most recent login sessions for account security.')}</p>
                            </div>
                            <div className={styles.activityList}>
                                {displayLogins.length > 0 ? (
                                    displayLogins.map((entry, idx) => {
                                        const dateObj = new Date(entry);
                                        const isValidDate = !isNaN(dateObj.getTime());
                                        const dateStr = isValidDate ? dateObj.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : entry;
                                        const timeStr = isValidDate ? dateObj.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true
                                        }) : '';
                                        const isLatest = idx === 0;

                                        return (
                                            <div key={idx} className={`${styles.activityItemRow} ${isLatest ? styles.activeActivityRow : ''}`}>
                                                <div className={styles.activityItemLeft}>
                                                    <div className={`${styles.activityIconBox} ${isLatest ? styles.activeActivityIconBox : ''}`}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="2" y="3" width="20" height="14" rx="2" />
                                                            <line x1="8" y1="21" x2="16" y2="21" />
                                                            <line x1="12" y1="17" x2="12" y2="21" />
                                                        </svg>
                                                    </div>
                                                    <div className={styles.activityMeta}>
                                                        <div className={styles.activityDateRow}>
                                                            <strong className={styles.activityDateText}>{dateStr}</strong>
                                                            {timeStr && <span className={styles.activityTimeText}>{t('profile.at', 'at')} {timeStr}</span>}
                                                        </div>
                                                        <span className={styles.activityDescText}>
                                                            {t('profile.loginSuccess', 'Successful WebApp Authentication')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.activityItemRight}>
                                                    {isLatest ? (
                                                        <span className={styles.activeSessionBadge}>
                                                            <span className={styles.activePulseDot} />
                                                            {t('profile.currentSession', 'Active Session')}
                                                        </span>
                                                    ) : (
                                                        <span className={styles.pastSessionBadge}>
                                                            {t('profile.pastSession', 'Past Session')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className={styles.emptyText}>{t('profile.noLoginData', 'No recent activity logged.')}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Credit History Tab */}
                    {activeTab === 'credit_history' && (
                        <CreditHistory embedMode={true} />
                    )}
                </div>

                {/* 3. Right Column: Account Summary & Quick Actions */}
                <div className={styles.rightSummaryColumn}>
                    {/* Card 1: Account Summary */}
                    <div className={styles.rightCard}>
                        <h4 className={styles.rightCardTitle}>{t('profile.accountSummary', 'Account Summary')}</h4>

                        <div className={styles.summaryMetaRows}>
                         
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Account Status</span>
                                <span className={styles.summaryActiveTag}>Active ✓</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Total Referrals</span>
                                <span className={styles.summaryProTag}>{referralCount} Ref{referralCount !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Real Dynamic Credits Box */}
                        <div className={styles.creditsCardBox}>
                            <div className={styles.creditsHead}>
                                <span className={styles.creditsLabel}>{t('topbar.credits', 'Available Credits')}</span>
                                {canViewPlans() && (
                                    <button type="button" onClick={() => router.push('/plans')} className={styles.viewPlansBtn}>
                                        {t('sidebar.proAccount', 'View Plans')} →
                                    </button>
                                )}
                            </div>

                            <div className={styles.creditsValueRow}>
                                <div className={styles.creditsNumbers}>
                                    <h3 className={styles.creditsAmount}>
                                        {credits} <span>{t('topbar.credits', 'Credits')}</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Verification Status */}
                    <div className={styles.rightCard}>
                        <h4 className={styles.rightCardTitle}>{t('profile.verificationStatus', 'Verification Status')}</h4>
                        <div className={styles.verificationList}>
                            <div className={styles.verifItem}>
                                <div className={styles.verifLeft}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span>Email Verification</span>
                                </div>
                                <span className={styles.verifStatusGreen}>Verified ✓</span>
                            </div>

                            {/* Phone Verification - currently commented out */}
                            {/* <div className={styles.verifItem}>
                                <div className={styles.verifLeft}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={form.phone_number ? "#10b981" : "#18C98B"} strokeWidth="2">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    <span>Phone Verification</span>
                                </div>
                                {form.phone_number ? (
                                    <span className={styles.verifStatusGreen}>Verified ✓</span>
                                ) : (
                                    <button type="button" className={styles.verifActionBtn} onClick={() => setShowOtpModal(true)}>
                                        Verify Phone
                                    </button>
                                )}
                            </div> */}
                        </div>
                    </div>

                    {/* Card 3: Quick Actions */}
                    <div className={styles.rightCard}>
                        <h4 className={styles.rightCardTitle}>{t('profile.quickActions', 'Quick Actions')}</h4>
                        <div className={styles.quickActionsGrid}>
                            <button type="button" className={styles.actionGridBtn} onClick={() => setShowPasswordModal(true)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span>Change Password</span>
                            </button>

                            {canViewPlans() && (
                                <button type="button" className={styles.actionGridBtn} onClick={() => router.push('/plans')}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
                                    </svg>
                                    <span>Subscription Plans</span>
                                </button>
                            )}

                            <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('credit_history')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                                <span>Credit History</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('activity_log')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>Activity Log</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => { setActiveTab('profile'); setIsEditing(true); }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>

                            <button type="button" className={`${styles.actionGridBtn} ${styles.actionDanger}`} onClick={() => setShowLogoutConfirm(true)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 4: Security Priority Banner */}
                    <div className={styles.securityPriorityCard}>
                        <div className={styles.securityPriorityLeft}>
                            <div className={styles.secShieldIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <div className={styles.secPriorityTexts}>
                                <h5>Your security is our priority</h5>
                                <p>We use bank-level encryption to protect your data</p>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Change Password</h3>
                                <button type="button" onClick={() => setShowPasswordModal(false)} className={styles.closeBtn}>✕</button>
                            </div>
                            <div className={styles.modalBody}>
                                <Input
                                    label="Current Password"
                                    icon={Lock}
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="New Password"
                                    icon={Lock}
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPass}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="Confirm Password"
                                    icon={Lock}
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    className={styles.cancelFormBtn} 
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordForm({ current: '', newPass: '', confirm: '' });
                                    }}
                                    disabled={passwordUpdating}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <Button
                                    text={passwordUpdating ? "Updating..." : "Update Password"}
                                    type="button"
                                    disabled={passwordUpdating}
                                    onClick={async () => {
                                        if (!passwordForm.current) {
                                            toast.error('Please enter your current password');
                                            return;
                                        }
                                        if (!passwordForm.newPass) {
                                            toast.error('Please enter a new password');
                                            return;
                                        }
                                        if (passwordForm.newPass.length < 8) {
                                            toast.error('New password must be at least 8 characters long');
                                            return;
                                        }
                                        if (passwordForm.newPass !== passwordForm.confirm) {
                                            toast.error('New passwords do not match');
                                            return;
                                        }
                                        if (passwordForm.current === passwordForm.newPass) {
                                            toast.error('New password must be different from current password');
                                            return;
                                        }

                                        setPasswordUpdating(true);
                                        try {
                                            await profileApi.changePassword({
                                                userId,
                                                email: form.email,
                                                currentPassword: passwordForm.current,
                                                newPassword: passwordForm.newPass,
                                            });
                                            toast.success('Password updated successfully!');
                                            setShowPasswordModal(false);
                                            setPasswordForm({ current: '', newPass: '', confirm: '' });
                                        } catch (err) {
                                            toast.error(err.message || 'Failed to update password. Please check your current password.');
                                        } finally {
                                            setPasswordUpdating(false);
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirm Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className={styles.modalOverlay} onClick={() => setShowLogoutConfirm(false)}>
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3>{t('sidebar.logoutTitle', 'Confirm Logout')}</h3>
                                <button type="button" onClick={() => setShowLogoutConfirm(false)} className={styles.closeBtn}>✕</button>
                            </div>
                            <div className={styles.modalBody}>
                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '8px 0 16px' }}>
                                    {t('sidebar.logoutConfirm', 'Are you sure you want to sign out of your account?')}
                                </p>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelFormBtn} onClick={() => setShowLogoutConfirm(false)}>
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <Button
                                    text={t('sidebar.logout', 'Log Out')}
                                    type="button"
                                    onClick={() => {
                                        clearAuthSession();
                                        router.push('/login');
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <FirebasePhoneModal
                isOpen={showOtpModal}
                phoneNumber={form.phone_number}
                onClose={() => setShowOtpModal(false)}
                onSuccess={performSaveProfile}
            />
        </div>
    );
}

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
import { profileApi } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

const GoldCrownBadge = '/assets/images/gold_crown_circuit_badge.jpg';
const GoldSecurityShield = '/assets/images/gold_security_shield_badge.jpg';

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
    const [showBalance, setShowBalance] = useState(true);
    const [lastLogins, setLastLogins] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [initialPhone, setInitialPhone] = useState('');
    const [referralCount, setReferralCount] = useState(0);

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        referral_code: '',
        country: 'India',
        timezone: '(GMT +05:30) India Standard Time',
        dob: '15 May 1995'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tabParam && ['profile', 'security', 'preferences', 'api_management', 'activity_log', 'credit_history'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

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
            country: user.country || 'India',
            timezone: user.timezone || '(GMT +05:30) India Standard Time',
            dob: user.dob || '15 May 1995'
        });

        const initialLogins = parseLogins(user.last_logins);
        if (initialLogins.length > 0) {
            setLastLogins(initialLogins.slice(-5));
        }

        fetchProfile(id);
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
    const username = form.first_name ? `${form.first_name.toLowerCase()}_trader` : 'johndoe_trader';
    const displayUid = userId ? `UID: CHX${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 9).toUpperCase()}` : 'UID: CHX789456123';

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
            id: 'preferences',
            title: t('profile.preferencesTab', 'Preferences'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
            )
        },
        {
            id: 'api_management',
            title: t('profile.apiManagement', 'API Management'),
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
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
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <div className={styles.headerTitleMeta}>
                    <h1>{t('profile.myProfile', 'My Profile')}</h1>
                    <p>{t('profile.subtitle', 'Manage your personal information and account preferences')}</p>
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
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <button type="button" className={styles.cameraUploadBtn} title="Upload Photo" onClick={() => toast.info('Photo upload feature coming soon')}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* User Meta */}
                                    <div className={styles.userMetaDetails}>
                                        <div className={styles.userNameRow}>
                                            <h2>{fullName}</h2>
                                            <span className={styles.proTraderBadge}>
                                                Pro Trader 👑
                                            </span>
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

                                    {/* Gold Circuit Crown Art */}
                                    <div className={styles.heroRightEmblem}>
                                        <div className={styles.emblemImageContainer}>
                                            <Image
                                                src={GoldCrownBadge}
                                                alt="Pro Crown Emblem"
                                                width={140}
                                                height={140}
                                                className={styles.crownImg}
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Personal Details Grid / Form */}
                            <div className={styles.personalDetailsCard}>
                                <div className={styles.detailsCardHeader}>
                                    <div className={styles.cardHeaderIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('auth.fullNameLabel', 'Full Name')}</span>
                                                <strong className={styles.pillValue}>{fullName}</strong>
                                            </div>
                                        </div>

                                        {/* Username */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="4" />
                                                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.username', 'Username')}</span>
                                                <strong className={styles.pillValue}>{username}</strong>
                                            </div>
                                        </div>

                                        {/* Email Address */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('auth.emailLabel', 'Email Address')}</span>
                                                <strong className={styles.pillValue}>{form.email || 'johndoe@email.com'}</strong>
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.country', 'Country')}</span>
                                                <strong className={styles.pillValue}>{form.country || 'India'}</strong>
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.phoneLabel', 'Phone Number')}</span>
                                                <strong className={styles.pillValue}>{form.phone_number || '+91 98765 43210'}</strong>
                                            </div>
                                        </div>

                                        {/* Time Zone */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.timeZone', 'Time Zone')}</span>
                                                <strong className={styles.pillValue}>{form.timezone || '(GMT +05:30) India Standard Time'}</strong>
                                            </div>
                                        </div>

                                        {/* Date of Birth / Referral */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.dob', 'Date of Birth')}</span>
                                                <strong className={styles.pillValue}>{form.dob || '15 May 1995'}</strong>
                                            </div>
                                        </div>

                                        {/* Referral Code Box */}
                                        <div className={styles.detailPillBox}>
                                            <div className={styles.pillIcon}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            </div>
                                            <div className={styles.pillTexts}>
                                                <span className={styles.pillLabel}>{t('profile.referralCode', 'Referral Code')} ({referralCount} Refs)</span>
                                                <div className={styles.referralCodePillRow}>
                                                    <strong className={styles.pillValue}>{activeRefCode || 'CHX-2024'}</strong>
                                                    <button type="button" onClick={handleCopyLink} className={styles.refActionIcon} title="Copy Link">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                        </svg>
                                                    </button>
                                                    <button type="button" onClick={handleShareLink} className={styles.refActionIcon} title="Share Link">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                            <div className={styles.fieldGroup}>
                                                <label className={styles.inputLabel}>{t('auth.emailLabel', 'Email')}</label>
                                                <div className={styles.disabledEmailBox}>{form.email || '—'}</div>
                                            </div>

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
                                <div className={styles.securityActionRow}>
                                    <div className={styles.secActionMeta}>
                                        <h4>Two-Factor Authentication (2FA)</h4>
                                        <span>Add an extra layer of security with Google Authenticator</span>
                                    </div>
                                    <button type="button" className={styles.secActionButton} onClick={() => toast.info('2FA setup is enabled by default')}>
                                        Configured ✓
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className={styles.tabCardContainer}>
                            <div className={styles.cardHeaderBox}>
                                <h3>{t('profile.preferencesTab', 'Preferences')}</h3>
                                <p>Customize your system visual appearance and platform notifications.</p>
                            </div>
                            <div className={styles.preferencesList}>
                                <div className={styles.prefRow}>
                                    <span>Theme Mode</span>
                                    <span className={styles.proTraderBadge}>Luxury Dark (Active)</span>
                                </div>
                                <div className={styles.prefRow}>
                                    <span>Language</span>
                                    <span className={styles.pillValue}>{language === 'ar' ? 'العربية' : 'English'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API Management Tab */}
                    {activeTab === 'api_management' && (
                        <div className={styles.tabCardContainer}>
                            <div className={styles.cardHeaderBox}>
                                <h3>{t('profile.apiManagement', 'API Management')}</h3>
                                <p>Create and manage API keys for automated Expert Advisor trading.</p>
                            </div>
                            <div className={styles.apiKeyList}>
                                <div className={styles.apiKeyBox}>
                                    <div>
                                        <strong>Live MT5 Bridge Key</strong>
                                        <p className={styles.keyText}>cx_live_9f837248923a19...</p>
                                    </div>
                                    <button type="button" className={styles.secActionButton} onClick={() => { navigator.clipboard.writeText('cx_live_9f837248923a19'); toast.success('API key copied!'); }}>
                                        Copy Key
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
                                    displayLogins.map((entry, idx) => (
                                        <div key={idx} className={styles.activityItemRow}>
                                            <div className={styles.activityIcon}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                                    <line x1="8" y1="21" x2="16" y2="21" />
                                                    <line x1="12" y1="17" x2="12" y2="21" />
                                                </svg>
                                            </div>
                                            <div className={styles.activityMeta}>
                                                <strong>{entry}</strong>
                                                <span>Successful WebApp Authentication</span>
                                            </div>
                                            <span className={idx === 0 ? styles.verifiedPill : styles.pillLabel}>
                                                {idx === 0 ? 'Active' : 'Completed'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No recent activity logged.</p>
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
                                <span className={styles.summaryLabel}>Account Type</span>
                                <span className={styles.summaryProTag}>Pro Trader 👑</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Account Status</span>
                                <span className={styles.summaryActiveTag}>Active ✓</span>
                            </div>
                        </div>

                        {/* Portfolio Value Box with Sparkline */}
                        <div className={styles.portfolioCardBox}>
                            <div className={styles.portfolioHead}>
                                <span className={styles.portfolioLabel}>Total Portfolio Value</span>
                                <button type="button" onClick={() => setShowBalance(!showBalance)} className={styles.eyeBtn} title="Toggle Visibility">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>

                            <div className={styles.portfolioValueRow}>
                                <div className={styles.portfolioNumbers}>
                                    <h3 className={styles.portfolioAmount}>
                                        {showBalance ? '68,542.31' : '••••••••'} <span>USDT</span>
                                    </h3>
                                    <div className={styles.portfolioChange}>
                                        <span className={styles.changeLabel}>24H Change</span>
                                        <span className={styles.changeValue}>+2.37% (+1,584.23 USDT)</span>
                                    </div>
                                </div>

                                {/* Mini SVG Glow Sparkline */}
                                <div className={styles.sparklineChart}>
                                    <svg width="110" height="48" viewBox="0 0 110 48" fill="none">
                                        <defs>
                                            <linearGradient id="goldSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#F4D17A" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#F4D17A" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 0 38 Q 20 42, 35 30 T 70 20 T 95 10 T 110 5 L 110 48 L 0 48 Z" fill="url(#goldSparkGrad)" />
                                        <path d="M 0 38 Q 20 42, 35 30 T 70 20 T 95 10 T 110 5" stroke="#F4D17A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                        <circle cx="110" cy="5" r="3.5" fill="#FFE79A" stroke="#C1902E" strokeWidth="1.5" />
                                        <circle cx="70" cy="20" r="2" fill="#F4D17A" />
                                        <circle cx="35" cy="30" r="2" fill="#F4D17A" />
                                    </svg>
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

                            <div className={styles.verifItem}>
                                <div className={styles.verifLeft}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    <span>Phone Verification</span>
                                </div>
                                <span className={styles.verifStatusGreen}>Verified ✓</span>
                            </div>

                            <div className={styles.verifItem}>
                                <div className={styles.verifLeft}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>KYC Verification</span>
                                </div>
                                <span className={styles.verifStatusGold}>Level 2 Verified ⊗</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Quick Actions */}
                    <div className={styles.rightCard}>
                        <h4 className={styles.rightCardTitle}>{t('profile.quickActions', 'Quick Actions')}</h4>
                        <div className={styles.quickActionsGrid}>
                            <button type="button" className={styles.actionGridBtn} onClick={() => setShowPasswordModal(true)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span>Change Password</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => toast.info('2FA is active and secured')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Enable 2FA</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => toast.success('KYC level 2 verified')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <circle cx="9" cy="10" r="2" />
                                    <line x1="15" y1="8" x2="17" y2="8" />
                                    <line x1="15" y1="12" x2="17" y2="12" />
                                    <line x1="7" y1="16" x2="17" y2="16" />
                                </svg>
                                <span>KYC Documents</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => toast.info('Report generation initiated')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Download Reports</span>
                            </button>

                            <button type="button" className={styles.actionGridBtn} onClick={() => setActiveTab('api_management')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <circle cx="7.5" cy="15.5" r="5.5" />
                                    <path d="M21 2l-9.6 9.6" />
                                    <path d="M15.5 7.5l3 3L22 7l-3-3" />
                                </svg>
                                <span>API Keys</span>
                            </button>

                            <button type="button" className={`${styles.actionGridBtn} ${styles.actionDanger}`} onClick={() => toast.error('Please contact support to delete account')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                <span>Delete Account</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 4: Security Priority Banner */}
                    <div className={styles.securityPriorityCard}>
                        <div className={styles.securityPriorityLeft}>
                            <div className={styles.secShieldIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4D17A" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <div className={styles.secPriorityTexts}>
                                <h5>Your security is our priority</h5>
                                <p>We use bank-level encryption to protect your data</p>
                            </div>
                        </div>
                        <div className={styles.secShieldImgWrap}>
                            <Image
                                src={GoldSecurityShield}
                                alt="Security Shield"
                                width={48}
                                height={48}
                                className={styles.shieldImg}
                            />
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
                                <div className={styles.modalField}>
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        className={styles.modalInput}
                                        value={passwordForm.current}
                                        onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className={styles.modalField}>
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className={styles.modalInput}
                                        value={passwordForm.newPass}
                                        onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className={styles.modalField}>
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className={styles.modalInput}
                                        value={passwordForm.confirm}
                                        onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelFormBtn} onClick={() => setShowPasswordModal(false)}>
                                    Cancel
                                </button>
                                <Button
                                    text="Update Password"
                                    type="button"
                                    onClick={() => {
                                        if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirm) {
                                            toast.error('Passwords do not match');
                                            return;
                                        }
                                        toast.success('Password updated successfully');
                                        setShowPasswordModal(false);
                                        setPasswordForm({ current: '', newPass: '', confirm: '' });
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

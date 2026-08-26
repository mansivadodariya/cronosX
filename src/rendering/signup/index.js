
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './signup.module.scss';
import Input from '@/components/input';
import PhoneInput from '@/components/phoneInput';
import FirebasePhoneModal from '@/components/firebasePhoneModal';
import Button from '@/components/button';
import ContinueWithGoogle from '@/components/continueWithGoogle';
import { getAuthRedirectTarget, getStoredUser, getStoredUserId, clearAuthSession } from '@/lib/authSession';
import { useSearchParams } from 'next/navigation';
import { authApi, profileApi } from '@/lib/api';
import { validateSignup } from '@/lib/validation';
import { toast } from '@/components/toast';
import { supabase } from '@/lib/supabaseClient';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { getUtmParameters } from '@/lib/utm';

import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/languageToggle';

const Logo = '/assets/logo/logo.png';
const ArrowIcon = '/assets/icons/arrow.svg';
const UserIcon = '/assets/icons/user.svg';
const EmailIcon = '/assets/icons/sms.svg';
const Lock = '/assets/icons/lock.svg';

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const codeFromQuery = searchParams.get('code') || searchParams.get('referral_code') || '';
    const redirectTo = getAuthRedirectTarget(searchParams);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        referral_code: codeFromQuery
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // States for phone step after Google Sign-in
    const [pendingPhoneUserId, setPendingPhoneUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    useEffect(() => {
        console.log('Signup mount/update: pendingPhoneUserId =', pendingPhoneUserId);
    }, [pendingPhoneUserId]);

    useEffect(() => {
        const checkSession = async () => {
            const uid = getStoredUserId();
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            const hasCookie = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('auth_token='));
            console.log('Signup checkSession: uid =', uid, 'token =', token, 'hasCookie =', hasCookie);
            if (uid && token && hasCookie && supabase) {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('phone_number, is_active')
                        .eq('id', uid)
                        .single();

                    console.log('Signup checkSession: supabase data =', data, 'error =', error);

                    // User deleted/not found (PGRST116 is Supabase error for 0 rows returned)
                    const isUserDeleted = error?.code === 'PGRST116' || (!data && !error);
                    if (isUserDeleted) {
                        clearAuthSession();
                        toast.error('Your account has been deleted. Please contact admin.');
                        return;
                    }

                    // For other transient errors (network drop, RLS timeout), do not log out the user
                    if (error || !data) {
                        console.error('Signup checkSession: Failed to verify user status due to error:', error);
                        return;
                    }

                    // User inactive
                    if (data.is_active === false) {
                        clearAuthSession();
                        toast.error('Your account is inactive. Please contact admin.');
                        return;
                    }

                    const user = getStoredUser();
                    let isOnboardingDone = Boolean(data?.onboarding_completed) || localStorage.getItem('has_completed_onboarding') === 'true';
                    if (user) {
                        user.phone_number = data?.phone_number || user?.phone_number || '';
                        user.onboarding_completed = isOnboardingDone;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                    document.cookie = 'has_phone=true; path=/; SameSite=Lax';

                    if (!isOnboardingDone) {
                        window.location.assign('/onboarding');
                    } else {
                        window.location.assign(redirectTo);
                    }
                } catch (e) {
                    console.error('Error fetching user status', e);
                }
            }
        };

        checkSession();
    }, [searchParams, redirectTo]);

    const set = (field) => (e) => {
        const val = e.target.value.trimStart();
        setForm((f) => ({ ...f, [field]: val }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const setPhone = (val) => {
        setForm((f) => ({ ...f, phone_number: val || '' }));
        if (errors.phone_number) setErrors((prev) => ({ ...prev, phone_number: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        const fieldErrors = validateSignup(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }
        setLoading(true);
        try {
            const utm = getUtmParameters();
            const signupPayload = { ...form, ...utm };
            await authApi.signup(signupPayload);
            setSuccess(true);
        } catch (err) {
            toast.dismiss();
            toast.error(typeof err.message === 'string' ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePhoneNumber = async (e) => {
        if (e) e.preventDefault();

        if (!phoneNumber) {
            setPhoneError('Phone number is required.');
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid phone number with country code.');
            return;
        }

        const activeUid = pendingPhoneUserId || getStoredUserId();
        if (!activeUid) {
            toast.error('Session expired. Please log in again.');
            clearAuthSession();
            setPendingPhoneUserId('');
            return;
        }

        setPhoneError('');
        setShowOtpModal(true);
    };

    const handleOtpSuccess = async () => {
        setSavingPhone(true);
        const activeUid = pendingPhoneUserId || getStoredUserId();
        try {
            let apiRes = null;
            try {
                apiRes = await profileApi.updateProfile({
                    phone_number: phoneNumber,
                    is_phone_verified: true
                });
            } catch (apiErr) {
                console.warn("profileApi.updateProfile fallback to direct update:", apiErr);
            }

            if (supabase && activeUid) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: phoneNumber,
                            is_phone_verified: true
                        })
                        .eq('id', activeUid);
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            let isOnboardingDone = localStorage.getItem('has_completed_onboarding') === 'true';
            if (typeof window !== 'undefined') {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = phoneNumber;
                parsed.is_phone_verified = true;
                if (parsed.onboarding_completed) isOnboardingDone = true;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                window.dispatchEvent(new CustomEvent('user:updated'));
            }

            toast.success(apiRes?.message || 'Phone number verified and saved!');
            if (!isOnboardingDone) {
                window.location.assign('/onboarding');
            } else {
                window.location.assign(redirectTo);
            }
        } catch (err) {
            console.error('Failed to save phone number after verification:', err);
            const msg = String(err.message || '');
            let userFriendlyMsg = 'Failed to save phone number.';
            if (msg.includes('unique constraint') || msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('already in use')) {
                userFriendlyMsg = 'This phone number is already in use.';
            } else if (msg) {
                userFriendlyMsg = msg;
            }
            setPhoneError(userFriendlyMsg);
            toast.error(userFriendlyMsg);
        } finally {
            setSavingPhone(false);
            setShowOtpModal(false);
        }
    };

    if (success) {
        return (
            <div className={styles.signuppage}>
                <div className={styles.ambientGlowTop} aria-hidden="true" />
                <div className={styles.ambientGlowBottom} aria-hidden="true" />
                <div className={styles.gridOverlay} aria-hidden="true" />

                <div className={styles.authContainer}>
                    <div className={styles.authCard}>
                        <div className={styles.logoWrapper}>
                            <Link href="/" className={styles.logoLink} title="ChronosX Home">
                                <img src={Logo} alt="ChronosX Logo" className={styles.logoImg} />
                            </Link>
                        </div>
                        <div className={styles.text}>
                            <h2>{t('auth.checkEmail', 'Check your email')}</h2>
                            <p>{t('auth.verificationSent', `We sent a verification link to ${form.email}. Click the link to activate your account.`)}</p>
                            <p className={styles.note}>
                                {t('auth.spamNote', "Note: If you don't find the email in your inbox, please check your spam folder.")}
                            </p>
                        </div>
                        <div className={styles.accountText}>
                            <p><Link href="/login">{t('auth.backToLogin', 'Back to Log in')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.signuppage}>
            {/* Ambient Background Glows */}
            <div className={styles.ambientGlowTop} aria-hidden="true" />
            <div className={styles.ambientGlowBottom} aria-hidden="true" />
            <div className={styles.gridOverlay} aria-hidden="true" />

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    {/* Redesigned Logo */}
                    <div className={styles.logoWrapper}>
                        <Link href="/" className={styles.logoLink} title="ChronosX Home">
                            <img src={Logo} alt="ChronosX Logo" className={styles.logoImg} />
                        </Link>
                    </div>

                    {pendingPhoneUserId ? (
                        <>
                            <div className={styles.text}>
                                <h2>{t('auth.completeProfile', 'Complete Your Profile')}</h2>
                                <p>{t('auth.enterPhoneDesc', 'Please enter your phone number to continue.')}</p>
                            </div>
                            <form onSubmit={handleSavePhoneNumber} noValidate>
                                <div className={styles.spacingGrid}>
                                    <PhoneInput
                                        label={t('profile.phoneLabel', 'Phone Number')}
                                        value={phoneNumber}
                                        onChange={(val) => {
                                            setPhoneNumber(val || '');
                                            setPhoneError('');
                                        }}
                                        placeholder={t('profile.phoneLabel', 'Phone number')}
                                        error={phoneError}
                                        defaultCountry="AE"
                                    />
                                    <Button
                                        text={savingPhone ? t('auth.saving', 'Saving...') : t('auth.continue', 'Continue')}
                                        type="submit"
                                        disabled={savingPhone}
                                        icon={ArrowIcon}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearAuthSession();
                                            window.location.assign('/');
                                        }}
                                        className={styles.backBtn}
                                    >
                                        {t('auth.backToHome', 'Back to Home')}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className={styles.text}>
                                <h2>{t('auth.signupHeader', 'Sign Up')}</h2>
                                <p>{t('auth.signupDesc', 'Get set up so you can start your trading experience.')}</p>
                            </div>
                            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                                <div className={styles.spacingGrid}>
                                    <div className={styles.twoCol}>
                                        <Input
                                            label={t('auth.firstNameLabel', 'FIRST NAME')}
                                            icon={UserIcon}
                                            placeholder={t('auth.firstNamePlaceholder', 'Enter first name')}
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={set('first_name')}
                                            error={errors.first_name}
                                            maxLength={50}
                                            autoComplete="off"
                                        />
                                        <Input
                                            label={t('auth.lastNameLabel', 'LAST NAME')}
                                            icon={UserIcon}
                                            placeholder={t('auth.lastNamePlaceholder', 'Enter last name')}
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={set('last_name')}
                                            error={errors.last_name}
                                            maxLength={50}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Input
                                        label={t('auth.emailLabel', 'EMAIL')}
                                        icon={EmailIcon}
                                        placeholder={t('auth.emailPlaceholder', 'Enter email')}
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={set('email')}
                                        error={errors.email}
                                        maxLength={100}
                                        autoComplete="off"
                                    />
                                    <PhoneInput
                                        label={t('profile.phoneLabel', 'PHONE NUMBER')}
                                        placeholder={t('profile.phoneLabel', 'Phone number')}
                                        value={form.phone_number}
                                        onChange={setPhone}
                                        error={errors.phone_number}
                                        defaultCountry="AE"
                                    />
                                    <div className={styles.twoCol}>
                                        <Input
                                            label={t('auth.passwordLabel', 'PASSWORD')}
                                            icon={Lock}
                                            placeholder={t('auth.passwordPlaceholder', 'Enter password')}
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={set('password')}
                                            error={errors.password}
                                            maxLength={50}
                                            autoComplete="new-password"
                                        />
                                        <Input
                                            label={t('auth.confirmPasswordLabel', 'CONFIRM PASSWORD')}
                                            icon={Lock}
                                            placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm password')}
                                            type="password"
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={set('confirmPassword')}
                                            error={errors.confirmPassword}
                                            maxLength={50}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <Input
                                        label={t('auth.referralOptional', 'REFERRAL CODE (OPTIONAL)')}
                                        icon={UserIcon}
                                        placeholder={t('auth.referralOptionalPlaceholder', 'Enter referral code')}
                                        name="referral_code"
                                        value={form.referral_code}
                                        onChange={set('referral_code')}
                                        error={errors.referral_code}
                                        maxLength={50}
                                        autoComplete="off"
                                    />
                                    <Button
                                        type="submit"
                                        text={loading ? t('auth.signingUpBtn', 'Signing up...') : t('auth.signupHeader', 'Sign up')}
                                        icon={ArrowIcon}
                                        disabled={loading}
                                    />
                                </div>
                            </form>
                            <div className={styles.accountText}>
                                <p>{t('auth.alreadyHaveAccount', 'Already have an account?')} <Link href="/login">{t('auth.loginHeader', 'Log in')}</Link></p>
                            </div>
                            <div className={styles.orText}><span>{t('auth.or', 'or')}</span></div>
                            <ContinueWithGoogle redirectTo={redirectTo} onPendingPhone={setPendingPhoneUserId} />
                        </>
                    )}
                </div>
            </div>

            <FirebasePhoneModal
                isOpen={showOtpModal}
                phoneNumber={phoneNumber}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
            />
        </div>
    );
};

export default Signup;

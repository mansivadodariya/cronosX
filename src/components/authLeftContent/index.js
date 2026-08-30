import React from 'react';
import styles from './authLeftContent.module.scss';

const TextLogo = '/assets/images/text-logo.png';

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ServerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="4" rx="2" stroke="#18C98B" strokeWidth="1.8" />
        <rect x="3" y="10" width="18" height="4" rx="2" stroke="#18C98B" strokeWidth="1.8" />
        <rect x="3" y="16" width="18" height="4" rx="2" stroke="#18C98B" strokeWidth="1.8" />
        <circle cx="6.5" cy="6" r="0.75" fill="#18C98B" />
        <circle cx="6.5" cy="12" r="0.75" fill="#18C98B" />
        <circle cx="6.5" cy="18" r="0.75" fill="#18C98B" />
    </svg>
);

const FastIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13 3L8.5 12.5H13.5L11 21L17.5 10.5H12.5L13 3Z" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 17.3431 14.6569 16 13 16H6C4.34315 16 3 17.3431 3 19V21" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="7.5" r="4" stroke="#18C98B" strokeWidth="1.8" />
        <path d="M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M21 21V19C21 17.5 19.8 16.3 18.5 16.05" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export default function AuthLeftContent() {
    return (
        <div className={styles.authLeftContent}>
            <img src={TextLogo} alt='TextLogo' />
        </div>
    );
}

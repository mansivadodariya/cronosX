"use client";
import React, { useEffect } from 'react'
import { captureUtmParameters } from '@/lib/utm';
import AuthLeftContent from '@/components/authLeftContent';

export default function Layout({ children }) {
    useEffect(() => {
        captureUtmParameters();
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <div className='auth-layout'>
            <div className='auth-layout-col'>
                <AuthLeftContent />
            </div>
            <div className='auth-layout-col'>
                {children}
            </div>
        </div>
    )
}
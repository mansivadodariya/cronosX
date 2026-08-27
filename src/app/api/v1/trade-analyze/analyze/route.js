import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getBackendUrl() {
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://f3a3-110-226-115-185.ngrok-free.app';
    return raw.replace(/\/+$/, '');
}

export async function POST(request) {
    try {
        const backendBase = getBackendUrl();
        const targetUrl = `${backendBase}/api/v1/trade-analyze/analyze`;

        // Extract incoming form data
        const incomingFormData = await request.formData();

        // Forward authorization header if present
        const authHeader = request.headers.get('authorization') || '';

        const forwardHeaders = {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': 'true',
        };

        if (authHeader) {
            forwardHeaders['Authorization'] = authHeader;
        }

        const backendResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: forwardHeaders,
            body: incomingFormData,
        });

        const data = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            return NextResponse.json(
                data || { detail: 'Trade analysis failed on backend server' },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Error proxying trade analysis request:', err);
        return NextResponse.json(
            { detail: err?.message || 'Failed to communicate with analysis backend' },
            { status: 500 }
        );
    }
}

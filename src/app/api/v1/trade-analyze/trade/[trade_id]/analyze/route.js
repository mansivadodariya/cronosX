import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getBackendUrl() {
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://lushly-freebie-delusion.ngrok-free.dev';
    return raw.replace(/\/+$/, '');
}

export async function POST(request, { params }) {
    try {
        const { trade_id } = await params;
        if (!trade_id) {
            return NextResponse.json({ detail: 'trade_id parameter is required' }, { status: 400 });
        }

        const backendBase = getBackendUrl();
        const targetUrl = `${backendBase}/api/v1/trade-analyze/trade/${encodeURIComponent(trade_id)}/analyze`;

        // Forward authorization header if present
        const authHeader = request.headers.get('authorization') || '';

        const forwardHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
        };

        if (authHeader) {
            forwardHeaders['Authorization'] = authHeader;
        }

        const backendResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: forwardHeaders,
        });

        const data = await backendResponse.json().catch(() => null);

        if (!backendResponse.ok) {
            return NextResponse.json(
                data || { detail: 'Individual trade analysis failed on backend server' },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Error proxying individual trade analysis request:', err);
        return NextResponse.json(
            { detail: err?.message || 'Failed to communicate with analysis backend' },
            { status: 500 }
        );
    }
}

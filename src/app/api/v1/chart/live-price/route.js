import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const symbol = (searchParams.get('symbol') || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();

        const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.thetradermaster.com').replace(/\/+$/, '');
        const targetUrl = `${baseUrl}/api/v1/chart/live-price?symbol=${symbol}`;

        try {
            const res = await fetch(targetUrl, {
                headers: {
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'no-store, max-age=0'
                    }
                });
            }
        } catch (e) {
            // If direct backend live-price endpoint is unreachable, fallback to recent candle close
        }

        // Fallback: try fetching recent candles from backend or Supabase
        const candlesUrl = `${baseUrl}/api/v1/chart/candles?symbol=${symbol}&timeframe=1m&limit=2`;
        const candleRes = await fetch(candlesUrl, {
            headers: {
                'accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            cache: 'no-store'
        });

        if (candleRes.ok) {
            const candleData = await candleRes.json();
            const list = candleData.candles || candleData.data || (Array.isArray(candleData) ? candleData : []);
            if (list.length > 0) {
                const last = list[list.length - 1];
                const prev = list.length > 1 ? list[list.length - 2] : last;
                const close = parseFloat(last.close);
                const prevClose = parseFloat(prev.close || last.open);
                const diff = close - prevClose;
                const pct = prevClose ? ((diff / prevClose) * 100).toFixed(2) : '0.00';

                return NextResponse.json({
                    success: true,
                    symbol: symbol,
                    price: close,
                    bid: close,
                    ask: close + (symbol.includes('XAU') ? 0.15 : 0.00015),
                    last: close,
                    change_percent: parseFloat(pct),
                    timestamp: new Date().toISOString()
                }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'no-store, max-age=0'
                    }
                });
            }
        }

        return NextResponse.json({
            success: false,
            symbol: symbol,
            message: 'No live price available'
        }, {
            status: 404,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

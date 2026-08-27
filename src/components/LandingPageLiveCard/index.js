'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * LandingPageLiveCard
 * Connects the Landing Page AI Live Feed card to the live WebSocket backend with
 * smooth flash glow animations and automatic reconnection.
 * WebSocket Endpoint: /api/v1/websocket/live-price?symbol={symbol}
 */
export const LandingPageLiveCard = ({ symbol = 'XAUUSD', className = '' }) => {
    const cleanSymbol = (symbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const [price, setPrice] = useState(null);
    const [bid, setBid] = useState(null);
    const [ask, setAsk] = useState(null);
    const [changePct, setChangePct] = useState(0.00);
    const [lastUpdated, setLastUpdated] = useState('SYNCING');
    const [isConnected, setIsConnected] = useState(false);
    const [flashColor, setFlashColor] = useState('transparent');
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        let ws = null;

        const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
        let host = 'overbook-cognitive-platonic.ngrok-free.dev';

        if (backendUrl) {
            host = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        } else if (typeof window !== 'undefined' && window.location.host) {
            host = window.location.host;
        }

        const wsUrl = `${protocol}//${host}/api/v1/websocket/live-price?symbol=${cleanSymbol}`;

        const connect = () => {
            try {
                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    if (isMounted) setIsConnected(true);
                };

                ws.onmessage = (event) => {
                    try {
                        const payload = JSON.parse(event.data);
                        if ((payload.type === 'price_update' || payload.price !== undefined) && isMounted) {
                            const newPrice = parseFloat(payload.price);
                            if (!isNaN(newPrice)) {
                                setPrice((prevPrice) => {
                                    if (prevPrice !== null && prevPrice !== undefined) {
                                        if (newPrice > prevPrice) {
                                            setFlashColor('rgba(0, 230, 118, 0.2)');
                                        } else if (newPrice < prevPrice) {
                                            setFlashColor('rgba(255, 82, 82, 0.2)');
                                        }
                                        setTimeout(() => {
                                            if (isMounted) setFlashColor('transparent');
                                        }, 400);
                                    }
                                    return newPrice;
                                });
                            }

                            if (payload.bid !== undefined) setBid(parseFloat(payload.bid));
                            if (payload.ask !== undefined) setAsk(parseFloat(payload.ask));

                            const cp = payload.change_percent !== undefined
                                ? parseFloat(payload.change_percent)
                                : (payload.changePercent !== undefined ? parseFloat(payload.changePercent) : 0);
                            setChangePct(cp);
                            setLastUpdated('JUST NOW');
                        }
                    } catch (err) {
                        console.error('Parse Error:', err);
                    }
                };

                ws.onerror = () => {
                    if (isMounted) setIsConnected(false);
                };

                ws.onclose = () => {
                    if (isMounted) {
                        setIsConnected(false);
                        reconnectTimeoutRef.current = setTimeout(connect, 3000);
                    }
                };
            } catch (e) {
                if (isMounted) setIsConnected(false);
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                ws.close();
            }
        };
    }, [cleanSymbol]);

    const isPositive = changePct >= 0;

    return (
        <div
            className={className}
            style={{
                background: '#0d0e12',
                border: '1px solid #1e2029',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '420px',
                color: '#fff',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                transition: 'background 0.3s ease, border-color 0.3s ease',
                backgroundColor: flashColor !== 'transparent' ? flashColor : '#0d0e12',
            }}
        >
            {/* Header Symbol Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#d4af37',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#000',
                        }}
                    >
                        G
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                            {cleanSymbol}{' '}
                            <span
                                style={{
                                    fontSize: '11px',
                                    color: isConnected ? '#00e676' : '#ff9100',
                                    background: isConnected ? 'rgba(0,230,118,0.1)' : 'rgba(255,145,0,0.1)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                }}
                            >
                                ● {isConnected ? 'LIVE' : 'CONNECTING'}
                            </span>
                        </h3>
                        <span style={{ fontSize: '12px', color: '#71758c' }}>
                            {cleanSymbol === 'XAUUSD' ? 'Gold Spot • Commodities' : 'Live Asset • Market Stream'}
                        </span>
                    </div>
                </div>
                <span style={{ fontSize: '12px', color: '#71758c' }}>★ IN WATCHLIST</span>
            </div>

            {/* Main Big Price Display */}
            <div style={{ marginBottom: '16px' }}>
                <h1 style={{ margin: 0, fontSize: '42px', fontWeight: 800, color: '#ff6e40', letterSpacing: '-1px' }}>
                    {price !== null
                        ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'Connecting...'}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div style={{ color: isPositive ? '#00e676' : '#ff5252', fontSize: '14px', fontWeight: 600 }}>
                        {isPositive ? '↑ +' : '↓ '}{changePct.toFixed(2)}% (Live Tick)
                    </div>
                    {(bid !== null || ask !== null) && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                            Bid: {bid?.toFixed(2) || '--'} | Ask: {ask?.toFixed(2) || '--'}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Footer */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #1e2029',
                    fontSize: '11px',
                    color: '#71758c',
                }}
            >
                <span>● UPDATED {lastUpdated} • {isConnected ? 'WEBSOCKET LIVE' : 'CONNECTING...'}</span>
                <span>CHRONOSX AI LIVE FEED</span>
            </div>
        </div>
    );
};

export default LandingPageLiveCard;

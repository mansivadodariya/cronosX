'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * 1-Second Automatic Live MT5 Price Stream Hook
 * Connects to WebSocket /api/v1/websocket/live-price?symbol={symbol}
 * Fallback to 1-second REST polling /api/v1/chart/live-price if WebSocket fails or disconnects.
 */
export function useLivePrice(symbol = 'XAUUSD') {
    const cleanSymbol = (symbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const [priceData, setPriceData] = useState(null);
    const [tickDirection, setTickDirection] = useState(null); // 'up' | 'down' | null
    const prevPriceRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!cleanSymbol) return;

        let isMounted = true;

        const updatePrice = (newPrice, changePercent, timestamp, bid, ask) => {
            if (!isMounted) return;
            const numPrice = parseFloat(newPrice);
            if (isNaN(numPrice)) return;

            if (prevPriceRef.current !== null) {
                if (numPrice > prevPriceRef.current) {
                    setTickDirection('up');
                } else if (numPrice < prevPriceRef.current) {
                    setTickDirection('down');
                }
            }
            prevPriceRef.current = numPrice;

            setPriceData({
                symbol: cleanSymbol,
                price: numPrice,
                bid: bid !== undefined ? parseFloat(bid) : numPrice,
                ask: ask !== undefined ? parseFloat(ask) : numPrice,
                changePercent: changePercent !== undefined ? parseFloat(changePercent) : 0,
                timestamp: timestamp || new Date().toISOString(),
            });
        };

        // 1. REST Polling Fallback Function
        const startRestPolling = () => {
            if (pollingIntervalRef.current) return;

            const fetchLivePrice = async () => {
                try {
                    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');
                    const apiUrl = baseUrl
                        ? `${baseUrl}/api/v1/chart/live-price?symbol=${cleanSymbol}`
                        : `/api/v1/chart/live-price?symbol=${cleanSymbol}`;

                    const res = await fetch(apiUrl, {
                        headers: {
                            'accept': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });

                    if (res.ok) {
                        const json = await res.json();
                        if (json && (json.price || json.last || json.data?.price)) {
                            const p = json.price ?? json.last ?? json.data?.price;
                            const cp = json.change_percent ?? json.changePercent ?? json.data?.change_percent ?? 0;
                            const ts = json.timestamp ?? json.data?.timestamp;
                            const b = json.bid ?? json.data?.bid;
                            const a = json.ask ?? json.data?.ask;
                            updatePrice(p, cp, ts, b, a);
                        }
                    }
                } catch (e) {
                    // Silently ignore or retry next tick
                }
            };

            fetchLivePrice();
            pollingIntervalRef.current = setInterval(fetchLivePrice, 1000);
        };

        const stopRestPolling = () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };

        // 2. WebSocket Connection Setup
        let ws = null;
        try {
            let wsUrl = '';
            const customWsUrl = process.env.NEXT_PUBLIC_WS_PRICE_URL;

            if (customWsUrl) {
                wsUrl = `${customWsUrl}${customWsUrl.includes('?') ? '&' : '?'}symbol=${cleanSymbol}`;
            } else {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                let wsScheme = 'ws:';
                let wsHost = 'localhost:8000';

                if (backendUrl) {
                    wsScheme = backendUrl.startsWith('https') ? 'wss:' : 'ws:';
                    wsHost = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
                } else if (typeof window !== 'undefined') {
                    wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                    wsHost = window.location.host || 'localhost:8000';
                }

                wsUrl = `${wsScheme}//${wsHost}/api/v1/websocket/live-price?symbol=${cleanSymbol}`;
            }

            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                stopRestPolling();
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'price_update' || data.type === 'tick' || data.price !== undefined) {
                        updatePrice(
                            data.price ?? data.last ?? data.close,
                            data.change_percent ?? data.changePercent,
                            data.timestamp,
                            data.bid,
                            data.ask
                        );
                    }
                } catch (err) {
                    console.error('Error parsing WS live price message', err);
                }
            };

            ws.onerror = () => {
                startRestPolling();
            };

            ws.onclose = () => {
                startRestPolling();
            };
        } catch (e) {
            startRestPolling();
        }

        return () => {
            isMounted = false;
            stopRestPolling();
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                ws.close();
            }
            wsRef.current = null;
        };
    }, [cleanSymbol]);

    return { priceData, tickDirection };
}

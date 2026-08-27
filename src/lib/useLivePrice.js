'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Get WebSocket URL for live price streaming
 */
export function getLivePriceWsUrl(symbol = 'XAUUSD') {
    const cleanSymbol = (symbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const customWsUrl = process.env.NEXT_PUBLIC_WS_PRICE_URL || process.env.NEXT_PUBLIC_WS_URL;

    if (customWsUrl) {
        return `${customWsUrl}${customWsUrl.includes('?') ? '&' : '?'}symbol=${cleanSymbol}`;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    let wsScheme = 'ws:';
    let wsHost = 'localhost:8000';

    if (backendUrl) {
        wsScheme = backendUrl.startsWith('https') ? 'wss:' : 'ws:';
        wsHost = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    } else if (typeof window !== 'undefined') {
        wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsHost = window.location.host || 'localhost:8000';
    }

    return `${wsScheme}//${wsHost}/api/v1/websocket/live-price?symbol=${cleanSymbol}`;
}

/**
 * Real-time MT5 / Multi-Asset Live Price WebSocket Hook
 * Connects directly to `ws://<backend>/api/v1/websocket/live-price?symbol={symbol}`
 * Supports dynamically changing symbols via `{"action": "subscribe", "symbol": "EURUSD"}`.
 */
export function useLivePrice(initialSymbol = 'XAUUSD') {
    const [currentSymbol, setCurrentSymbol] = useState(() =>
        (initialSymbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase()
    );
    const [priceData, setPriceData] = useState(null);
    const [tickDirection, setTickDirection] = useState(null); // 'up' | 'down' | null
    const [isConnected, setIsConnected] = useState(false);

    const prevPriceRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const activeSymbolRef = useRef(currentSymbol);

    // Sync state if initialSymbol prop changes externally
    useEffect(() => {
        const clean = (initialSymbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();
        if (clean && clean !== activeSymbolRef.current) {
            activeSymbolRef.current = clean;
            setCurrentSymbol(clean);
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                try {
                    wsRef.current.send(JSON.stringify({ action: 'subscribe', symbol: clean }));
                } catch (e) {
                    console.warn('Failed to send dynamic subscribe action:', e);
                }
            }
        }
    }, [initialSymbol]);

    const updatePrice = useCallback((payload) => {
        if (!payload) return;
        const rawPrice = payload.price ?? payload.last ?? payload.close ?? payload.data?.price;
        const numPrice = parseFloat(rawPrice);
        if (isNaN(numPrice)) return;

        if (prevPriceRef.current !== null) {
            if (numPrice > prevPriceRef.current) {
                setTickDirection('up');
            } else if (numPrice < prevPriceRef.current) {
                setTickDirection('down');
            }
        }
        prevPriceRef.current = numPrice;

        const rawCp = payload.change_percent ?? payload.changePercent ?? payload.data?.change_percent ?? 0;
        const changePercent = parseFloat(rawCp) || 0;
        const rawBid = payload.bid ?? payload.data?.bid;
        const bid = rawBid !== undefined && !isNaN(parseFloat(rawBid)) ? parseFloat(rawBid) : numPrice;
        const rawAsk = payload.ask ?? payload.data?.ask;
        const ask = rawAsk !== undefined && !isNaN(parseFloat(rawAsk)) ? parseFloat(rawAsk) : numPrice;
        const sym = payload.symbol || activeSymbolRef.current;
        const timestamp = payload.timestamp || new Date().toISOString();

        const formatted = {
            symbol: sym,
            price: numPrice,
            bid,
            ask,
            change_percent: changePercent,
            changePercent,
            timestamp,
        };

        setPriceData(formatted);

        // Dispatch browser event for charts and other listening components
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: formatted }));
        }
    }, []);

    const subscribe = useCallback((newSymbol) => {
        const clean = (newSymbol || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
        if (!clean) return;
        activeSymbolRef.current = clean;
        setCurrentSymbol(clean);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify({ action: 'subscribe', symbol: clean }));
            } catch (e) {
                console.warn('Failed to send subscribe message:', e);
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const connect = () => {
            if (!isMounted) return;
            try {
                const targetSymbol = activeSymbolRef.current || 'XAUUSD';
                const wsUrl = getLivePriceWsUrl(targetSymbol);

                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    if (isMounted) {
                        setIsConnected(true);
                        // If symbol shifted during connection setup, send subscription
                        if (activeSymbolRef.current && activeSymbolRef.current !== targetSymbol) {
                            try {
                                ws.send(JSON.stringify({ action: 'subscribe', symbol: activeSymbolRef.current }));
                            } catch (err) { /* ignore */ }
                        }
                    }
                };

                ws.onmessage = (event) => {
                    if (!isMounted) return;
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'price_update' || data.type === 'tick' || data.price !== undefined) {
                            updatePrice(data);
                        }
                    } catch (err) {
                        console.error('Error parsing live price WebSocket message:', err);
                    }
                };

                ws.onerror = (err) => {
                    if (isMounted) {
                        setIsConnected(false);
                    }
                };

                ws.onclose = (event) => {
                    if (isMounted) {
                        setIsConnected(false);
                        // Reconnect after 3 seconds on unexpected drop
                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (isMounted) connect();
                        }, 3000);
                    }
                };
            } catch (e) {
                if (isMounted) {
                    setIsConnected(false);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (isMounted) connect();
                    }, 3000);
                }
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                try {
                    if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                        wsRef.current.close();
                    }
                } catch (e) { /* ignore */ }
                wsRef.current = null;
            }
        };
    }, [updatePrice]);

    return {
        priceData,
        tickDirection,
        isConnected,
        isLive: isConnected,
        symbol: currentSymbol,
        subscribe,
    };
}

export default useLivePrice;

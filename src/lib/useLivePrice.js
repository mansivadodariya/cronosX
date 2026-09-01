'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Live MT5 Price Stream Hook (WebSocket Only)
 * Connects directly to WebSocket /api/v1/websocket/live-price?symbol={symbol}
 * and listens to browser-wide 'livePriceUpdate' events.
 * Continuous REST polling has been removed as WebSocket provides real-time streaming.
 */
export function useLivePrice(symbol = 'XAUUSD') {
    const cleanSymbol = (symbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const [priceData, setPriceData] = useState(null);
    const [tickDirection, setTickDirection] = useState(null); // 'up' | 'down' | null
    const prevPriceRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);

    useEffect(() => {
        if (!cleanSymbol) return;

        let isMounted = true;

        const updatePrice = (newPrice, changePercent, timestamp, bid, ask) => {
            if (!isMounted) return;
            const numPrice = parseFloat(newPrice);
            if (isNaN(numPrice) || numPrice <= 0) return;

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
                bid: bid !== undefined && bid !== null ? parseFloat(bid) : numPrice,
                ask: ask !== undefined && ask !== null ? parseFloat(ask) : numPrice,
                changePercent: changePercent !== undefined && changePercent !== null ? parseFloat(changePercent) : 0,
                timestamp: timestamp || new Date().toISOString(),
            });
        };

        // 1. Listen for global livePriceUpdate events (broadcasted by WebSocket consumers like CopilotHeaderPrice)
        const handleGlobalPriceUpdate = (e) => {
            const payload = e?.detail;
            if (!payload || payload.price === undefined || payload.price === null) return;
            if (payload.symbol) {
                const eventSym = String(payload.symbol).replace(/[^A-Z0-9]/gi, '').toUpperCase();
                if (eventSym && eventSym !== cleanSymbol) return;
            }
            updatePrice(
                payload.price,
                payload.change_percent ?? payload.changePercent,
                payload.timestamp,
                payload.bid,
                payload.ask
            );
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('livePriceUpdate', handleGlobalPriceUpdate);
        }

        // 2. Connect Dedicated WebSocket for cleanSymbol
        const connectWs = () => {
            if (!isMounted) return;

            if (wsRef.current) {
                try {
                    wsRef.current.close();
                } catch {
                    /* ignore */
                }
                wsRef.current = null;
            }

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

                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'price_update' || data.type === 'tick' || data.price !== undefined) {
                            const p = data.price ?? data.last ?? data.close;
                            const cp = data.change_percent ?? data.changePercent;
                            updatePrice(p, cp, data.timestamp, data.bid, data.ask);
                        }
                    } catch (err) {
                        // ignore JSON parse errors
                    }
                };

                ws.onerror = () => {
                    // Handled in onclose
                };

                ws.onclose = () => {
                    if (isMounted) {
                        // Reconnect after 3 seconds without ANY REST polling
                        reconnectTimerRef.current = setTimeout(connectWs, 3000);
                    }
                };
            } catch (err) {
                if (isMounted) {
                    reconnectTimerRef.current = setTimeout(connectWs, 3000);
                }
            }
        };

        connectWs();

        return () => {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('livePriceUpdate', handleGlobalPriceUpdate);
            }
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            if (wsRef.current) {
                if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close();
                }
                wsRef.current = null;
            }
        };
    }, [cleanSymbol]);

    return { priceData, tickDirection };
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getLivePriceWsUrl } from '@/lib/useLivePrice';

/**
 * CopilotHeaderPrice
 * Connects the top live price badge and dispatches `livePriceUpdate` custom browser event
 * for TradingView / Lightweight Charts to update real-time candle close price.
 * WebSocket Endpoint: /api/v1/websocket/live-price?symbol={symbol}
 */
export const CopilotHeaderPrice = ({ symbol = 'XAUUSD', className = '' }) => {
    const cleanSymbol = (symbol || 'XAUUSD').replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const [data, setData] = useState({
        symbol: cleanSymbol,
        price: null,
        bid: null,
        ask: null,
        change_percent: 0,
        timestamp: null,
    });
    const [isLive, setIsLive] = useState(false);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        let ws = null;

        const wsUrl = getLivePriceWsUrl(cleanSymbol);

        const connect = () => {
            try {
                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    if (isMounted) setIsLive(true);
                };

                ws.onmessage = (event) => {
                    try {
                        const payload = JSON.parse(event.data);
                        if (payload.type === 'price_update' || payload.price !== undefined) {
                            const formattedPayload = {
                                symbol: payload.symbol || cleanSymbol,
                                price: payload.price !== undefined ? parseFloat(payload.price) : null,
                                bid: payload.bid !== undefined ? parseFloat(payload.bid) : null,
                                ask: payload.ask !== undefined ? parseFloat(payload.ask) : null,
                                change_percent: payload.change_percent !== undefined
                                    ? parseFloat(payload.change_percent)
                                    : (payload.changePercent !== undefined ? parseFloat(payload.changePercent) : 0),
                                timestamp: payload.timestamp || new Date().toISOString(),
                            };

                            if (isMounted) {
                                setData(formattedPayload);
                            }

                            // Dispatch custom browser event for TradingView / Lightweight Charts to update last candle
                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: formattedPayload }));
                            }
                        }
                    } catch (err) {
                        console.error('Error parsing live price JSON:', err);
                    }
                };

                ws.onerror = () => {
                    if (isMounted) setIsLive(false);
                };

                ws.onclose = () => {
                    if (isMounted) {
                        setIsLive(false);
                        reconnectTimeoutRef.current = setTimeout(connect, 3000);
                    }
                };
            } catch (e) {
                if (isMounted) setIsLive(false);
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

    const isPositive = (data.change_percent || 0) >= 0;

    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontFamily: 'sans-serif',
                color: '#fff',
            }}
        >
            {/* Live Indicator Dot */}
            <span
                style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isLive ? '#00e676' : '#ff5252',
                    boxShadow: isLive ? '0 0 8px #00e676' : 'none',
                    transition: 'all 0.3s ease',
                }}
            />

            {/* Price Display */}
            <span style={{ fontWeight: 700, fontSize: '15px' }}>
                {data.price !== null
                    ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : 'Loading...'}
            </span>

            {/* Change Percentage Badge */}
            <span
                style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isPositive ? '#00e676' : '#ff5252',
                }}
            >
                {isPositive ? '↗ +' : '↘ '}
                {(data.change_percent || 0).toFixed(2)}%
            </span>
        </div>
    );
};

export default CopilotHeaderPrice;

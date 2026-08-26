export const PAIRS_CONFIG = {
    'EUR/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 1.0850, base: 'EUR', quote: 'USD', type: 'forex' },
    'GBP/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 1.2980, base: 'GBP', quote: 'USD', type: 'forex' },
    'USD/JPY': { contractSize: 100000, pipSize: 0.01, defaultPrice: 152.30, base: 'USD', quote: 'JPY', type: 'jpy' },
    'AUD/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 0.6550, base: 'AUD', quote: 'USD', type: 'forex' },
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'CAD', 'AUD', 'CHF'];

export const RATES_TO_USD = {
    USD: 1.0,
    EUR: 1.0850,
    GBP: 1.2980,
    AUD: 0.6550,
    NZD: 0.5920,
    CAD: 1 / 1.3850,
    CHF: 1 / 0.8840,
    JPY: 1 / 152.30,
    AED: 1 / 3.6725,
};

export const LEVERAGES = [
    { label: '1:1 (No Leverage)', value: 1 },
    { label: '1:10', value: 10 },
    { label: '1:20', value: 20 },
    { label: '1:30', value: 30 },
    { label: '1:50', value: 50 },
    { label: '1:100', value: 100 },
    { label: '1:200', value: 200 },
    { label: '1:400', value: 400 },
    { label: '1:500', value: 500 },
    { label: '1:1000', value: 1000 },
];

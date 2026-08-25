import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Algorithmic Trading Strategies & Backtests | ChronosX',
    description: 'Explore, backtest, and deploy algorithmic trading strategies with institutional accuracy metrics on ChronosX.',
};

export default function StrategyPage() {
    return <AiStrategy initialTab="strategy" />;
}

import AiStrategy from '@/rendering/aiStrategy';

export const metadata = {
    title: 'Live Market Analysis & Strategy Feeds | ChronosX',
    description: 'Real-time multi-indicator algorithmic analysis, live candlestick charts, pivot points, and technical conviction scores.',
};

export default function LiveAnalysisPage() {
    return <AiStrategy initialTab="live" />;
}

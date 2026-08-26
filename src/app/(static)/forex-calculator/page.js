import PublicForexCalculator from '@/rendering/publicCalculator';

export const metadata = {
    title: 'Free Forex & Trading Calculators | ChronosX',
    description: 'Precision pip value calculator, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
};

export default function Page() {
    return <PublicForexCalculator />;
}

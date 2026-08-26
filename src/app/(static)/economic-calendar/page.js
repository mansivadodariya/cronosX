import PublicEconomicCalendar from '@/rendering/publicCalendar';

export const metadata = {
    title: 'Global Economic Calendar & Macro Desk | ChronosX',
    description: 'Track high-impact macroeconomic events, central bank interest rate decisions, inflation, and volatility releases in real-time.',
};

export default function Page() {
    return <PublicEconomicCalendar />;
}

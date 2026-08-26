import ContactUs from '@/rendering/contactUs';

export const metadata = {
    title: 'Contact Us — 24/7 AI Trading Desk & Support',
    description: 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists. 24/7 live assistance.',
    alternates: {
        canonical: 'https://chronosx.io/contact-us',
    },
    openGraph: {
        title: 'Contact Us | ChronosX Institutional AI Trading Terminal',
        description: 'Get in touch with the ChronosX AI trading team, quantitative support desk, and institutional partnership specialists.',
        url: 'https://chronosx.io/contact-us',
    }
};

export default function Page() {
    return <ContactUs />;
}

import AboutUs from '@/rendering/aboutUs';

export const metadata = {
    title: 'About Us — Institutional AI Market Infrastructure',
    description: 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
    alternates: {
        canonical: 'https://chronosx.io/about-us',
    },
    openGraph: {
        title: 'About Us | ChronosX Institutional AI Trading Terminal',
        description: 'Learn about ChronosX, our quantitative research team, deep learning chart vision models, and institutional trading architecture.',
        url: 'https://chronosx.io/about-us',
    }
};

export default function Page() {
    return <AboutUs />;
}

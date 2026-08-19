import { Anton, Inter_Tight, Plus_Jakarta_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import WhatsappButton from "@/components/whatsappButton";
import { LanguageProvider } from "@/context/LanguageContext";

const antonSans = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

const plusSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const robotoSans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
});

export const metadata = {
  title: "AI Trading Signal | ChronosX",
  description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant insights, and market analysis.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${antonSans.variable} ${robotoSans.variable} ${plusSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var isDashboard = /^\\/(dashboard|ai-assistant|ai-strategy|credit-history|economic-calendar|profile|settings|trade-snap|plans|broker|brokers)/.test(window.location.pathname);
                if (isDashboard && (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                var storedLang = localStorage.getItem('app_language');
                if (storedLang === 'ar') {
                  document.documentElement.setAttribute('lang', 'ar');
                  document.documentElement.setAttribute('dir', 'rtl');
                }
              } catch (_) {}
            `,
          }}
        />
        <LanguageProvider>
          <ToastProvider>
            {children}
            <WhatsappButton />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

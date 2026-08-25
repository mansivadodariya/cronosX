import { Anton, Inter_Tight, Plus_Jakarta_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import WhatsappButton from "@/components/whatsappButton";
import PageLoader from "@/components/pageLoader";
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
  title: "ChronosX",
  description: "Trade smarter with AI that never sleeps. Real-time AI trading signals, instant insights, and market analysis.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${antonSans.variable} ${robotoSans.variable} ${plusSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');

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
            <PageLoader />
            <WhatsappButton />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

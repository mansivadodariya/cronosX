import { Anton, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const antonSans = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="en" className={`${antonSans.variable} `}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

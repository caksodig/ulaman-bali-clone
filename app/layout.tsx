import type { Metadata, Viewport } from "next";
import { americana, basisGrotesque } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Ulaman Eco Luxury Resort | Bali",
    template: "%s | Ulaman Bali",
  },
  description:
    "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort, Bali's premier sustainable villa destination.",
  keywords: [
    "Bali resort",
    "eco luxury",
    "private villa",
    "sustainable tourism",
    "Ulaman",
  ],
  authors: [{ name: "Ulaman Bali" }],
  creator: "Ulaman Bali",
  publisher: "Ulaman Bali",
  metadataBase: new URL("https://ulamanbali.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ulamanbali.com",
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    siteName: "Ulaman Bali",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ulaman Bali Resort",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-verification-code",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      // className={`${inter.variable} ${playfair.variable} ${cormorant.variable} scroll-smooth`}
      className={`${americana.variable} ${basisGrotesque.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to optimize external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body
        className="antialiased bg-white text-[#343E35]"
        suppressHydrationWarning
      >
        {/* Global Header - Sticky across all pages */}
        <Header />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Optional: Analytics Scripts */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoIntel — Global Risk Intelligence Platform",
  description: "Real-time geopolitical risk monitoring, threat assessment, and intelligence analysis powered by GDELT, OFAC/UN sanctions, World Bank data, and social media sentiment.",
  keywords: ["geopolitical risk", "threat intelligence", "GDELT", "sanctions", "risk analysis", "supply chain", "sentiment analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

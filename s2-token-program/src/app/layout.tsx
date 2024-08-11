import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "s2-token-program",
  description: "Solana Fellowship 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Analytics />
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </div>
  );
}

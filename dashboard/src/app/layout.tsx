import type { Viewport } from 'next';
import '@/styles/globals.css';
import Head from 'next/head';
import '@mantine/core/styles.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { MantineProvider } from '@mantine/core';
import VedWrapper from '@/components/vedWrapper';
import { Analytics } from "@vercel/analytics/react"

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Ved Analytics | Privacy-Focused Website Analytics</title>
        <meta
          name="description"
          content="Ved Analytics provides privacy-focused, cookie-free website analytics. Get real-time insights while respecting user privacy."
        />
        <meta
          name="keywords"
          content="website analytics, privacy-focused analytics, cookie-free analytics, user behavior insights"
        />
        <meta name="author" content="Ved Analytics" />
        <meta property="og:title" content="Ved Analytics | Privacy-Focused Website Analytics" />
        <meta
          property="og:description"
          content="Ved Analytics provides privacy-focused, cookie-free website analytics. Get real-time insights while respecting user privacy."
        />
        <meta property="og:image" content="ved.png" />
        <meta property="og:url" content="https://vedanalytics.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ved Analytics | Privacy-Focused Website Analytics" />
        <meta
          name="twitter:description"
          content="Ved Analytics provides privacy-focused, cookie-free website analytics. Get real-time insights while respecting user privacy."
        />
        <meta name="twitter:image" content="ved.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://vedanalytics.in" />
      </Head>
      <body className={cn('min-h-screen bg-black font-sans antialiased')}>
        <MantineProvider>
          <VedWrapper />
          {children}
          <Toaster />
        </MantineProvider>
      </body>
      <Analytics />
    </html>
  );
}

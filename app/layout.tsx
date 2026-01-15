import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import { notoSansKr, playfairDisplay } from './fonts';

export const metadata: Metadata = {
  title: {
    default: 'Tugo',
    template: '%s | Tugo',
  },
  description: '차세대 정치 커뮤니티 플랫폼',
  applicationName: 'Tugo',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tugo',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Tugo',
    title: 'Tugo - 차세대 정치 커뮤니티',
    description: '차세대 정치 커뮤니티 플랫폼',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tugo - 차세대 정치 커뮤니티',
    description: '차세대 정치 커뮤니티 플랫폼',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e3a5f' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.className} ${notoSansKr.variable} ${playfairDisplay.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

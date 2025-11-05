import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { notoSansKr } from './fonts';

export const metadata: Metadata = {
  title: 'Tugo',
  description: '차세대 정치 커뮤니티 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import { Noto_Sans_KR, Black_Han_Sans } from 'next/font/google';

export const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '400', '700', '900'],
});

export const blackHanSans = Black_Han_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

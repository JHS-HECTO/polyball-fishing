import './globals.scss';
import type { Viewport } from 'next';

export const metadata = {
  title: '응모권 낚시하기 | 폴리볼',
  description: '저수지에서 물고기 잡고 응모권 획득',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body>
        <div className="appFrame">{children}</div>
      </body>
    </html>
  );
}

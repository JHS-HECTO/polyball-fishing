import './globals.scss';

export const metadata = {
  title: '응모권 낚시하기 | 폴리볼',
  description: '저수지에서 물고기 잡고 응모권 획득',
};

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

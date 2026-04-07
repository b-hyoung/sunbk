import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "수연선박 | 선박 임대·판매 전문",
    template: "%s | 수연선박",
  },
  description: "국내 최고 수준의 선박 임대·판매 전문 업체. 레저선, 어선, 화물선 등 다양한 선박을 합리적인 가격에 이용하세요.",
  keywords: ["선박 임대", "선박 판매", "보트 렌탈", "요트 임대", "어선 판매", "선박 전문"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "수연선박",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

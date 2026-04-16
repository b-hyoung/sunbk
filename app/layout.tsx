import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollAnimations from "@/components/layout/ScrollAnimations";
import BackgroundVideo from "@/components/layout/BackgroundVideo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "수연선박 | 선박 임대·판매 전문",
    template: "%s | 수연선박",
  },
  description: "선박 임대·판매 전문 업체. 어선, 화물선 등 다양한 선박을 합리적인 가격에 이용하세요.",
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
    <html lang="ko" className="h-full antialiased" style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      <body className="min-h-full flex flex-col">
        <ScrollAnimations />
        <Suspense>
          <BackgroundVideo />
          <Header />
        </Suspense>
        <main className="flex-1 pt-20 relative z-10">{children}</main>
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}

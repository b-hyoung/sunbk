import { Suspense } from "react";
import Test2Header from "@/components/test2/Header";
import Test2Footer from "@/components/test2/Footer";
import ScrollAnimations from "@/components/layout/ScrollAnimations";

export default function Test2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollAnimations />
      <Suspense>
        <Test2Header />
      </Suspense>
      {/* 버전바(32px) + 파란 띠(36px) + 메인헤더(68px) = 136px */}
      <main className="flex-1 pt-[136px]">{children}</main>
      <Test2Footer />
    </>
  );
}

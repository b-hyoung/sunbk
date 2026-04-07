import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollAnimations from "@/components/layout/ScrollAnimations";

export default function Test1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollAnimations />
      <Suspense>
        <Header />
      </Suspense>
      {/* 버전바(32px) + 헤더(80px) = 112px */}
      <main className="flex-1 pt-28">{children}</main>
      <Footer />
    </>
  );
}

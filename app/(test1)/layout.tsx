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
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}

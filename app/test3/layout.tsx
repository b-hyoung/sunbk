import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Test3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header basePath="test3" />
      </Suspense>
      <main className="flex-1 pt-20">{children}</main>
      <Footer basePath="test3" />
    </>
  );
}

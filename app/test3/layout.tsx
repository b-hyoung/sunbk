import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Test3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header basePath="test3" />
      <main className="flex-1 pt-16">{children}</main>
      <Footer basePath="test3" />
    </>
  );
}

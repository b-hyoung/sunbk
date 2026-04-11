import AboutClient from "./_components/AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 | 수연선박",
  description: "수연선박 - 선박 임대·판매 전문기업 소개",
};

export default function AboutPage() {
  return <AboutClient />;
}

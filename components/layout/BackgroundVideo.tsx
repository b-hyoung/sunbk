"use client";

import { usePathname } from "next/navigation";

const HERO_PAGES = ["/about", "/work", "/contact", "/shipyard"];

export default function BackgroundVideo() {
  const pathname = usePathname();
  const show = HERO_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      poster="/hero-bg.jpg"
    >
      <source
        src="https://videos.pexels.com/video-files/5784933/5784933-hd_1920_1080_24fps.mp4"
        type="video/mp4"
      />
    </video>
  );
}

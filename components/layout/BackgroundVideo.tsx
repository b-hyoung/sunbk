"use client";

import { useEffect, useRef } from "react";

let sharedTime = 0;

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = sharedTime;
    const sync = setInterval(() => {
      sharedTime = v.currentTime;
    }, 200);
    return () => clearInterval(sync);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-20"
      poster="/hero-bg.jpg"
    >
      <source
        src="https://videos.pexels.com/video-files/5784933/5784933-hd_1920_1080_24fps.mp4"
        type="video/mp4"
      />
    </video>
  );
}

"use client";

const VIDEOS = [
  "https://videos.pexels.com/video-files/5926842/5926842-hd_1920_1080_24fps.mp4",
  "https://videos.pexels.com/video-files/4438522/4438522-hd_1920_1080_30fps.mp4",
];

export default function HeroVideo() {
  // 랜덤 영상 선택 (SSR에서는 0번, 클라이언트에서 랜덤)
  const videoSrc = VIDEOS[0];

  return (
    <div className="absolute inset-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/hero-bg.jpg"
        style={{ filter: "saturate(0.75) brightness(0.9)" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 차분한 단일 톤 오버레이 (slate 살짝 띤 깊은 바다 느낌) */}
      <div className="absolute inset-0 bg-slate-950/55" />
    </div>
  );
}

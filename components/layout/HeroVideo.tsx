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
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
    </div>
  );
}

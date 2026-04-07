"use client";

import { COMPANY } from "@/constants/company";

const navApps = [
  {
    label: "티맵",
    icon: "T",
    iconBg: "bg-sky-500",
    deepLink: `tmap://route?goalname=${encodeURIComponent(COMPANY.name)}&goalx=${COMPANY.lng}&goaly=${COMPANY.lat}`,
    webFallback: `https://apis.openapi.sk.com/tmap/app/routes?appKey=&goalx=${COMPANY.lng}&goaly=${COMPANY.lat}&goalname=${encodeURIComponent(COMPANY.name)}`,
    colors: {
      blue: "border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300",
      navy: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400/50",
    },
  },
  {
    label: "네이버맵",
    icon: "N",
    iconBg: "bg-green-500",
    deepLink: `nmap://route/car?dlat=${COMPANY.lat}&dlng=${COMPANY.lng}&dname=${encodeURIComponent(COMPANY.name)}&appname=com.sooyeonship`,
    webFallback: `https://map.naver.com/v5/directions/-/-/-/car?c=${COMPANY.lng},${COMPANY.lat},15,0,0,0,dh`,
    colors: {
      blue: "border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300",
      navy: "border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400/50",
    },
  },
  {
    label: "카카오맵",
    icon: "K",
    iconBg: "bg-yellow-400",
    deepLink: `kakaomap://route?ep=${COMPANY.lat},${COMPANY.lng}&by=CAR`,
    webFallback: `https://map.kakao.com/link/to/${encodeURIComponent(COMPANY.name)},${COMPANY.lat},${COMPANY.lng}`,
    colors: {
      blue: "border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400",
      navy: "border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-400/50",
    },
  },
];

interface NavButtonsProps {
  variant?: "blue" | "navy";
}

export default function NavButtons({ variant = "blue" }: NavButtonsProps) {
  const handleClick = (app: (typeof navApps)[number]) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const timeout = setTimeout(() => {
        window.location.assign(app.webFallback);
      }, 1500);
      window.location.assign(app.deepLink);
      window.addEventListener("blur", () => clearTimeout(timeout), { once: true });
    } else {
      window.open(app.webFallback, "_blank");
    }
  };

  const containerStyle = variant === "navy"
    ? "bg-transparent border-transparent"
    : "bg-blue-50 border-blue-100";

  const titleStyle = variant === "navy" ? "text-white/60" : "text-blue-600";

  return (
    <div className={`mt-5 p-4 rounded-sm border ${containerStyle}`}>
      <p className={`text-base font-bold mb-4 ${titleStyle}`}>탐색으로 길찾기</p>
      <div className="flex gap-3">
        {navApps.map((app) => (
          <button
            key={app.label}
            onClick={() => handleClick(app)}
            className={`flex-1 flex items-center justify-center gap-2.5 py-4 border text-sm font-semibold transition-colors ${app.colors[variant]}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${app.iconBg} ${app.label === "카카오맵" ? "text-black/70" : "text-white"}`}>
              {app.icon}
            </span>
            {app.label}
          </button>
        ))}
      </div>
    </div>
  );
}

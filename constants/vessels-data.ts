/**
 * 선박 데이터 (임시)
 *
 * 가격·제원은 실제 정보 확인 후 교체 필요.
 * "(임시)" 표시된 값은 모두 플레이스홀더입니다.
 * 이 파일만 수정하면 전체 사이트에 반영됩니다.
 */

import type { Vessel } from "@/lib/supabase";

// vessel_images는 data/vessels.json에서 관리 (사진 경로)
// 여기서는 가격·제원·설명 등 텍스트 데이터만 오버라이드
export const VESSEL_OVERRIDES: Record<
  string,
  Partial<Omit<Vessel, "vessel_images">>
> = {
  "suyeon-1": {
    title: "수연1호",
    vessel_type: "화물선",
    year_built: 2010,              // (임시)
    length_m: 45,                  // (임시)
    tonnage: 199,                  // (임시)
    engine_power: "미쯔비시 750HP", // (임시)
    capacity: 8,                   // (임시)
    location: "인천",
    description:
      "수연선박의 주력 화물선. 미쯔비시 주기관 탑재, 생활발전기 완비. 인천항 기반 근해 화물 운송에 최적화.",
    features: ["미쯔비시 주기관", "생활발전기", "경유필터", "오일필터", "GPS 항법장치"],
    rent_price_per_day: 1500000,   // (임시) 150만원/일
    sale_price: 350000000,         // (임시) 3.5억
    type: "both",
    is_featured: true,
  },
  "suyeon-3": {
    title: "수연3호",
    vessel_type: "화물선",
    year_built: 2012,              // (임시)
    length_m: 38,                  // (임시)
    tonnage: 120,                  // (임시)
    engine_power: "450HP",         // (임시)
    capacity: 6,                   // (임시)
    location: "인천",
    description: "수연선박 소속 화물선. 근해 운송 전용.",
    features: ["GPS 항법장치", "레이더"],
    rent_price_per_day: 1200000,   // (임시) 120만원/일
    sale_price: 250000000,         // (임시) 2.5억
    type: "both",
    is_featured: false,
  },
  "suyeon-5": {
    title: "수연5호",
    vessel_type: "화물선",
    year_built: 2008,              // (임시)
    length_m: 42,                  // (임시)
    tonnage: 180,                  // (임시)
    engine_power: "600HP",         // (임시)
    capacity: 8,                   // (임시)
    location: "인천",
    description:
      "수연선박 소속 화물선. 선실, 조타실 완비. 장거리 운항에 적합.",
    features: ["선실", "조타실", "GPS 항법장치", "냉난방"],
    rent_price_per_day: 1400000,   // (임시) 140만원/일
    sale_price: 320000000,         // (임시) 3.2억
    type: "both",
    is_featured: true,
  },
  "suyeon-6": {
    title: "수연6호",
    vessel_type: "화물선",
    year_built: 2015,              // (임시)
    length_m: 35,                  // (임시)
    tonnage: 100,                  // (임시)
    engine_power: "400HP",         // (임시)
    capacity: 6,                   // (임시)
    location: "인천",
    description:
      "수연선박 소속 화물선. 환경정화 활동 참여 이력. 선원실, 조타실 완비.",
    features: ["선원실", "조타실", "환경정화 참여"],
    rent_price_per_day: 1100000,   // (임시) 110만원/일
    sale_price: 280000000,         // (임시) 2.8억
    type: "both",
    is_featured: true,
  },
  "suyeon-9": {
    title: "수연9호",
    vessel_type: "레저선",
    year_built: 2020,              // (임시)
    length_m: 8.5,                 // (임시)
    tonnage: 3,                    // (임시)
    engine_power: "야마하 250마력",
    capacity: 10,                  // (임시)
    location: "인천",
    description:
      "야마하 250마력 선외기 탑재 레저선. 낚시, 해양 레저에 최적화.",
    features: ["야마하 250마력 선외기", "어군탐지기", "구명장비"],
    rent_price_per_day: 450000,    // (임시) 45만원/일
    sale_price: null,
    type: "rent",
    is_featured: false,
  },
  sinseong: {
    title: "신성호",
    vessel_type: "화물선",
    year_built: 2011,              // (임시)
    length_m: 40,                  // (임시)
    tonnage: 150,                  // (임시)
    engine_power: "550HP",         // (임시)
    capacity: 7,                   // (임시)
    location: "인천",
    description: "신성호. 선실, 조타실 완비. 안정적인 근해 운항 실적.",
    features: ["선실", "조타실", "GPS 항법장치", "자동조타장치"],
    rent_price_per_day: 1300000,   // (임시) 130만원/일
    sale_price: 300000000,         // (임시) 3.0억
    type: "both",
    is_featured: true,
  },
  youngjin: {
    title: "영진호",
    vessel_type: "화물선",
    year_built: 2005,              // (임시)
    length_m: 35,                  // (임시)
    tonnage: 90,                   // (임시)
    engine_power: "380HP",         // (임시)
    capacity: 5,                   // (임시)
    location: "인천",
    description: "영진호. 판매 전용. 선체 상태 양호.",
    features: ["레이더", "GPS 항법장치"],
    rent_price_per_day: null,
    sale_price: 180000000,         // (임시) 1.8억
    type: "sale",
    is_featured: false,
  },
  "jinyang-2": {
    title: "진양2호",
    vessel_type: "화물선",
    year_built: 2013,              // (임시)
    length_m: 43,                  // (임시)
    tonnage: 170,                  // (임시)
    engine_power: "580HP",         // (임시)
    capacity: 8,                   // (임시)
    location: "인천",
    description:
      "진양2호. 항해 실적 다수. 근해·연안 화물 운송 겸용.",
    features: ["선실", "GPS 항법장치", "자동조타장치", "냉난방"],
    rent_price_per_day: 1350000,   // (임시) 135만원/일
    sale_price: 310000000,         // (임시) 3.1억
    type: "both",
    is_featured: true,
  },
};

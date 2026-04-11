export type PhotoDataMode = "unified" | "split";

/** 사진 카테고리 정의 */
export const PHOTO_CATEGORIES = {
  exterior: "외관",
  "exterior-starboard": "외관(우현)",
  "exterior-rear": "외관(후면)",
  bridge: "조타실",
  "engine-room": "기관실",
  cabin: "선실",
  "main-engine": "주기관",
  generator: "발전기",
  "generator-filter": "발전기(연료필터)",
  "generator-nameplate": "발전기(명판)",
  "generator-oil-filter": "발전기(오일필터)",
  engine: "엔진",
  "dry-dock": "상가(정비)",
  sailing: "항해",
  cleanup: "환경정화",
} as const;

export type PhotoCategory = keyof typeof PHOTO_CATEGORIES;

/**
 * 데이터 모드 설정
 * - unified: 모든 사진을 vessel_images에 통합 (현재)
 * - split: 선박 자체 사진은 vessel_images, 작업 사진은 work-photos.json (향후)
 */
export const PHOTO_DATA_MODE: PhotoDataMode = "unified";

/** 카테고리 한글 라벨 가져오기 */
export function getCategoryLabel(category: string): string {
  return PHOTO_CATEGORIES[category as PhotoCategory] ?? category;
}

/** 작업현장 필터에 표시할 메인 카테고리 */
export const WORK_FILTER_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "exterior", label: "외관" },
  { key: "bridge", label: "조타실" },
  { key: "engine-room", label: "기관실" },
  { key: "cabin", label: "선실" },
  { key: "main-engine", label: "주기관" },
  { key: "generator", label: "발전기" },
  { key: "dry-dock", label: "상가(정비)" },
  { key: "sailing", label: "항해" },
] as const;

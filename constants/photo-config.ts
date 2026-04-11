export type PhotoDataMode = "unified" | "split";
export type PhotoGroup = "vessel" | "work";

/** 사진 카테고리 정의 — group으로 선박/작업현장 구분 */
export const PHOTO_CATEGORIES: Record<string, { label: string; group: PhotoGroup }> = {
  exterior:              { label: "외관",             group: "vessel" },
  "exterior-starboard":  { label: "외관(우현)",       group: "vessel" },
  "exterior-rear":       { label: "외관(후면)",       group: "vessel" },
  bridge:                { label: "조타실",           group: "vessel" },
  "engine-room":         { label: "기관실",           group: "vessel" },
  cabin:                 { label: "선실",             group: "vessel" },
  "main-engine":         { label: "주기관",           group: "vessel" },
  generator:             { label: "발전기",           group: "vessel" },
  "generator-filter":    { label: "발전기(연료필터)",  group: "vessel" },
  "generator-nameplate": { label: "발전기(명판)",     group: "vessel" },
  "generator-oil-filter":{ label: "발전기(오일필터)",  group: "vessel" },
  engine:                { label: "엔진",             group: "vessel" },
  "dry-dock":            { label: "상가(정비)",       group: "work" },
  sailing:               { label: "항해",             group: "work" },
  cleanup:               { label: "환경정화",         group: "work" },
};

export type PhotoCategory = keyof typeof PHOTO_CATEGORIES;

/**
 * 데이터 모드 설정
 * - unified: 모든 사진을 vessel_images에 통합 (현재)
 * - split: 선박 자체 사진은 vessel_images, 작업 사진은 work-photos.json (향후)
 */
export const PHOTO_DATA_MODE: PhotoDataMode = "unified";

/** 카테고리 한글 라벨 */
export function getCategoryLabel(category: string): string {
  return PHOTO_CATEGORIES[category]?.label ?? category;
}

/** 카테고리 → 그룹 (vessel / work) */
export function getPhotoGroup(category: string): PhotoGroup {
  return PHOTO_CATEGORIES[category]?.group ?? "vessel";
}

/** 작업현장 필터 (work 그룹 카테고리만) */
export const WORK_FILTER_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "dry-dock", label: "상가(정비)" },
  { key: "sailing", label: "항해" },
  { key: "cleanup", label: "환경정화" },
] as const;

/** 선박 사진 필터 (vessel 그룹 카테고리만) */
export const VESSEL_FILTER_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "exterior", label: "외관" },
  { key: "bridge", label: "조타실" },
  { key: "engine-room", label: "기관실" },
  { key: "cabin", label: "선실" },
  { key: "main-engine", label: "주기관" },
  { key: "generator", label: "발전기" },
] as const;

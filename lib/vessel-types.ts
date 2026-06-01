import type { UseCase, Vessel } from "./supabase";

/** UI에 표시되는 5종 카테고리 */
export const VESSEL_CATEGORIES = ["통선", "예항선", "작업선", "도선", "화물선"] as const;
export type VesselCategory = (typeof VESSEL_CATEGORIES)[number];

/**
 * 데이터의 vessel_type(공식 선박관리카드 분류)을 UI 카테고리로 매핑.
 * 예항력 표기가 있는 강선은 예항선으로 분기.
 */
export function getVesselCategory(vessel: {
  vessel_type: string;
  features?: string[] | null;
}): VesselCategory {
  const t = vessel.vessel_type;
  if (t.includes("통선")) return "통선";
  if (t === "화물선") return "화물선";
  if (t === "기선(강선)") {
    const hasTowingPower = vessel.features?.some((f) => f.includes("예항력"));
    return hasTowingPower ? "예항선" : "작업선";
  }
  if (t === "기선(FRP)" || t === "작업선") return "작업선";
  if (t === "기타선(FRP)") return "도선";
  return "작업선";
}

/** UI 카테고리가 주어졌을 때, 그 카테고리에 속하는지 판별 */
export function matchesCategory(
  vessel: { vessel_type: string; features?: string[] | null },
  category: VesselCategory,
): boolean {
  return getVesselCategory(vessel) === category;
}

/** 용도 라벨/아이콘/정의/컨텍스트 */
export const USE_CASES: Record<
  UseCase,
  { label: string; icon: string; definition: string; context: string }
> = {
  survey: {
    label: "해상측량",
    icon: "🛰️",
    definition:
      "해상의 지형·수심·해저 구조물을 측정하는 작업을 말합니다.",
    context: "지오스토리·올포랜드·UST 21 등 측량업체 다수 임대",
  },
  construction: {
    label: "해상공사",
    icon: "🚧",
    definition:
      "항만·해상 구조물 건설, 예항·예인, 자재·인원 운반 등을 말합니다.",
    context: "현대스틸·유호건설·대양건설 등 건설사 임대 실적",
  },
};

export const USE_CASE_ORDER: UseCase[] = ["survey", "construction"];

export function getUseCaseLabel(useCase: UseCase): string {
  return USE_CASES[useCase].label;
}

export function isUseCase(v: string | undefined | null): v is UseCase {
  return v === "survey" || v === "construction";
}

/** 판매 가능 여부 (type이 sale 또는 both) */
export function isSellable(vessel: Pick<Vessel, "type">): boolean {
  return vessel.type === "sale" || vessel.type === "both";
}

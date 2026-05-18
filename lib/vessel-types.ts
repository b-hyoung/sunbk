import type { UseCase } from "./supabase";

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

/** 용도 라벨/아이콘 */
export const USE_CASES: Record<UseCase, { label: string; icon: string; description: string }> = {
  survey: {
    label: "해상측량",
    icon: "🛰️",
    description: "지오스토리·올포랜드 등 측량업체 다수 임대",
  },
  construction: {
    label: "해상공사",
    icon: "🚧",
    description: "인원·물자 운반, 예항·예인, 작업선 임대",
  },
  cargo: {
    label: "화물·판매",
    icon: "🚢",
    description: "화물 운송 및 선박 매매",
  },
};

export function getUseCaseLabel(useCase: UseCase): string {
  return USE_CASES[useCase].label;
}

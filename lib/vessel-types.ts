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

/** 용도 라벨/아이콘/정의/컨텍스트 (filter용으로 남겨둠) */
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

/** 선박 유형 (홈에서 분류 기준) */
export type VesselClass = "tug" | "utility" | "coastal";

export const VESSEL_CLASS_ORDER: VesselClass[] = ["tug", "utility", "coastal"];

export const VESSEL_CLASS_INFO: Record<
  VesselClass,
  { label: string; icon: string; description: string }
> = {
  tug: {
    label: "예인선",
    icon: "⛴️",
    description:
      "해상의 각종 공사 등에 동원되는 부선의 예인, 공사바지 셋팅, 닻 투·양묘 등에 사용되며\n대한민국 연안 일원의 모든 해상에서 작업 가능합니다.",
  },
  utility: {
    label: "기타선 (통선·해양조사선)",
    icon: "🛟",
    description:
      "국제항구에 출·입항하는 상선과 육지 간 통선, 해상 공사 현장의 작업 인부·자재 운송에 사용하며,\n국립해양조사원의 지형·해저 측량 등 해양공간 정보 수집, 항로 준설유지작업의 조사선으로도 활용됩니다.",
  },
  coastal: {
    label: "기타선 (연안·내수면·호수 등)",
    icon: "🚤",
    description:
      "연안·내수면·호수 등에서 근거리 통선, 소규모 측량·연락·점검 작업에 투입되는 소형 선박입니다.\n좁은 수역과 접안 작업에 유리합니다.",
  },
};

/**
 * 각 유형에 속한 선박을 표시 순서대로 명시. (중복 없이 한 선박은 한 유형에만 속함)
 */
export const VESSEL_CLASS_MEMBERS: Record<VesselClass, string[]> = {
  tug: ["suyeon-1"],
  utility: ["suyeon-5", "suyeon-6", "youngjin", "sinseong", "jinyang-2"],
  coastal: ["suyeon-3", "suyeon-8", "suyeon-9", "incheon-9"],
};

/** 선박이 해당 유형에 속하는지 (명시적 멤버십 기준) */
export function matchesVesselClass(
  vessel: Pick<Vessel, "id">,
  cls: VesselClass,
): boolean {
  return VESSEL_CLASS_MEMBERS[cls].includes(vessel.id);
}

/** 유형 내 표시 순서 index (미지정이면 큰 값 → 뒤로) */
export function vesselClassOrderIndex(vesselId: string, cls: VesselClass): number {
  const i = VESSEL_CLASS_MEMBERS[cls].indexOf(vesselId);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/** 문자열이 유효한 VesselClass인지 판별 */
export function isVesselClass(v: string | undefined | null): v is VesselClass {
  return v === "tug" || v === "utility" || v === "coastal";
}

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

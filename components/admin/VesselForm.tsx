"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VesselImageUpload from "./VesselImageUpload";
import type { Vessel, VesselImage } from "@/lib/supabase";

interface VesselFormProps {
  vessel?: Vessel;
  mode: "create" | "edit";
}

function toSlug(title: string): string {
  return title
    .replace(/\s+/g, "-")
    .replace(/호$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/수연/, "suyeon-")
    .replace(/신성/, "sinseong")
    .replace(/영진/, "youngjin")
    .replace(/진양/, "jinyang-")
    || `vessel-${Date.now()}`;
}

const VESSEL_TYPES = ["어선", "화물선"];

function formatPrice(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  return num ? Number(num).toLocaleString() : "";
}

function unformatPrice(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export default function VesselForm({ vessel, mode }: VesselFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(vessel?.title ?? "");
  const initType = vessel?.vessel_type ?? "화물선";
  const [vesselType, setVesselType] = useState(VESSEL_TYPES.includes(initType) ? initType : "기타");
  const [customVesselType, setCustomVesselType] = useState(VESSEL_TYPES.includes(initType) ? "" : initType);
  const [type, setType] = useState(vessel?.type ?? "both");
  const [yearBuilt, setYearBuilt] = useState(vessel?.year_built?.toString() ?? "");
  const [lengthM, setLengthM] = useState(vessel?.length_m?.toString() ?? "");
  const [tonnage, setTonnage] = useState(vessel?.tonnage?.toString() ?? "");
  const [enginePower, setEnginePower] = useState(vessel?.engine_power ?? "");
  const [capacity, setCapacity] = useState(vessel?.capacity?.toString() ?? "");
  const [location, setLocation] = useState(vessel?.location ?? "인천");
  const [rentPrice, setRentPrice] = useState(vessel?.rent_price_per_day?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(vessel?.sale_price?.toString() ?? "");
  const [description, setDescription] = useState(vessel?.description ?? "");
  const [featuresStr, setFeaturesStr] = useState((vessel?.features ?? []).join(", "));
  const [isAvailable, setIsAvailable] = useState(vessel?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(vessel?.is_featured ?? false);
  const [status, setStatus] = useState(vessel?.status ?? "active");
  const [images, setImages] = useState<VesselImage[]>(vessel?.vessel_images ?? []);

  const actualVesselType = vesselType === "기타" ? customVesselType : vesselType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("선박명을 입력해주세요."); return; }
    setSaving(true);
    setError(null);

    const slug = mode === "edit" ? vessel!.slug : toSlug(title);
    const body = {
      id: mode === "edit" ? vessel!.id : undefined,
      title: title.trim(),
      slug,
      type,
      vessel_type: actualVesselType,
      year_built: yearBuilt ? Number(yearBuilt) : null,
      length_m: lengthM ? Number(lengthM) : null,
      tonnage: tonnage ? Number(tonnage) : null,
      engine_power: enginePower || null,
      capacity: capacity ? Number(capacity) : null,
      location: location || null,
      rent_price_per_day: rentPrice ? Number(unformatPrice(rentPrice)) : null,
      sale_price: salePrice ? Number(unformatPrice(salePrice)) : null,
      description: description || null,
      features: featuresStr ? featuresStr.split(",").map((s) => s.trim()).filter(Boolean) : [],
      is_available: isAvailable,
      is_featured: isFeatured,
      status,
      vessel_images: images.map((img, i) => ({ ...img, vessel_id: vessel?.id ?? "", sort_order: i + 1 })),
    };

    try {
      const url = mode === "edit" ? `/api/admin/vessels/${vessel!.id}` : "/api/admin/vessels";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("저장 실패");
      router.push("/test1/admin/vessels");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-describedby="form-error">
      {error && (
        <div id="form-error" role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* 기본정보 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">기본정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vessel-title" className={labelClass}>선박명 *</label>
            <input id="vessel-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="예: 수연1호" required />
          </div>
          <div>
            <label htmlFor="vessel-type" className={labelClass}>선종</label>
            <select id="vessel-type" value={vesselType} onChange={(e) => setVesselType(e.target.value)} className={inputClass}>
              {VESSEL_TYPES.map((vt) => (
                <option key={vt} value={vt}>{vt}</option>
              ))}
              <option value="기타">기타 (직접 입력)</option>
            </select>
            {vesselType === "기타" && (
              <input
                type="text"
                value={customVesselType}
                onChange={(e) => setCustomVesselType(e.target.value)}
                className={`${inputClass} mt-2`}
                placeholder="선종을 입력해주세요"
              />
            )}
          </div>
          <div>
            <label htmlFor="trade-type" className={labelClass}>거래유형</label>
            <select id="trade-type" value={type} onChange={(e) => setType(e.target.value as Vessel["type"])} className={inputClass}>
              <option value="rent">임대</option>
              <option value="sale">판매</option>
              <option value="both">임대·판매</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>정박 위치</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="예: 인천" />
          </div>
        </div>
      </section>

      {/* 제원 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">제원</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="year-built" className={labelClass}>건조 연도</label>
            <input id="year-built" type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} className={inputClass} placeholder="예: 2015" />
          </div>
          <div>
            <label htmlFor="length-m" className={labelClass}>전장 (m)</label>
            <input id="length-m" type="number" step="0.1" value={lengthM} onChange={(e) => setLengthM(e.target.value)} className={inputClass} placeholder="예: 45" />
          </div>
          <div>
            <label htmlFor="tonnage" className={labelClass}>톤수</label>
            <input id="tonnage" type="number" value={tonnage} onChange={(e) => setTonnage(e.target.value)} className={inputClass} placeholder="예: 199" />
          </div>
          <div>
            <label htmlFor="engine-power" className={labelClass}>엔진 출력</label>
            <input id="engine-power" type="text" value={enginePower} onChange={(e) => setEnginePower(e.target.value)} className={inputClass} placeholder="예: 미쯔비시 750HP" />
          </div>
          <div>
            <label htmlFor="capacity" className={labelClass}>승선 정원</label>
            <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} placeholder="예: 8" />
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">가격</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rent-price" className={labelClass}>임대가 (원/일)</label>
            <input id="rent-price" type="text" inputMode="numeric" value={formatPrice(rentPrice)} onChange={(e) => setRentPrice(unformatPrice(e.target.value))} className={inputClass} placeholder="예: 1,500,000" />
          </div>
          <div>
            <label htmlFor="sale-price" className={labelClass}>판매가 (원)</label>
            <input id="sale-price" type="text" inputMode="numeric" value={formatPrice(salePrice)} onChange={(e) => setSalePrice(unformatPrice(e.target.value))} className={inputClass} placeholder="예: 350,000,000" />
          </div>
        </div>
      </section>

      {/* 상세 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">상세정보</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className={labelClass}>설명</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} placeholder="선박 소개를 작성해주세요." />
          </div>
          <div>
            <label htmlFor="features" className={labelClass}>특징/옵션 (쉼표로 구분)</label>
            <input id="features" type="text" value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className={inputClass} placeholder="예: GPS 항법장치, 냉난방, 자동조타장치" />
          </div>
        </div>
      </section>

      {/* 상태 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className={labelClass}>상태</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Vessel["status"])} className={inputClass}>
              <option value="active">운영중</option>
              <option value="inactive">비활성</option>
              <option value="sold">판매완료</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-6">
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">이용 가능</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mt-6">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">추천 선박</span>
          </label>
        </div>
      </section>

      {/* 사진 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">사진</h3>
        <VesselImageUpload images={images} onChange={setImages} />
      </section>

      {/* 제출 */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {saving ? "저장 중..." : mode === "edit" ? "수정 완료" : "선박 등록"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}

# 관리자 선박 CRUD 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관리자 대시보드에서 선박 추가/수정/삭제 + 사진 업로드(미리보기) 기능을 인메모리 방식으로 구현.

**Architecture:** API Route로 인메모리 CRUD. 서버 시작 시 vessels.json + vessels-data.ts 오버라이드를 합쳐 메모리에 로드. 관리자 페이지에서 API 호출로 조작. 사진은 URL.createObjectURL()로 클라이언트 미리보기. 프론트 페이지도 같은 인메모리 데이터 참조.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-04-11-admin-vessel-crud-design.md`

---

## File Structure

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/admin-store.ts` | 인메모리 선박 데이터 스토어 (서버 싱글톤) |
| `app/api/admin/vessels/route.ts` | GET (목록), POST (등록) |
| `app/api/admin/vessels/[id]/route.ts` | GET (단건), PUT (수정), DELETE (삭제) |
| `components/admin/VesselForm.tsx` | 등록/수정 공유 폼 (클라이언트) |
| `components/admin/VesselImageUpload.tsx` | 사진 업로드/미리보기/카테고리/삭제 |
| `components/admin/AdminVesselTable.tsx` | 선박 목록 테이블 (클라이언트) |
| `app/test1/admin/vessels/page.tsx` | 선박 목록 페이지 |
| `app/test1/admin/vessels/new/page.tsx` | 선박 등록 페이지 |
| `app/test1/admin/vessels/[id]/edit/page.tsx` | 선박 수정 페이지 |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `lib/data.ts` | localVessels()가 admin-store를 참조하도록 수정 |

---

## Task 1: 인메모리 스토어

**Files:**
- Create: `lib/admin-store.ts`

- [ ] **Step 1: admin-store.ts 생성**

```ts
// lib/admin-store.ts
import type { Vessel, VesselImage } from "./supabase";
import vesselsJson from "@/data/vessels.json";
import { VESSEL_OVERRIDES } from "@/constants/vessels-data";

function loadInitialVessels(): Vessel[] {
  return (vesselsJson as unknown as Vessel[]).map((v) => {
    const override = VESSEL_OVERRIDES[v.id];
    if (!override) return v;
    return { ...v, ...override, vessel_images: v.vessel_images };
  });
}

let vessels: Vessel[] = loadInitialVessels();

export function getAllVesselsFromStore(): Vessel[] {
  return vessels;
}

export function getVesselFromStore(id: string): Vessel | null {
  return vessels.find((v) => v.id === id) ?? null;
}

export function addVesselToStore(vessel: Vessel): Vessel {
  vessels = [...vessels, vessel];
  return vessel;
}

export function updateVesselInStore(id: string, updates: Partial<Vessel>): Vessel | null {
  const index = vessels.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vessels[index] = { ...vessels[index], ...updates, vessel_images: updates.vessel_images ?? vessels[index].vessel_images };
  vessels = [...vessels];
  return vessels[index];
}

export function deleteVesselFromStore(id: string): boolean {
  const before = vessels.length;
  vessels = vessels.filter((v) => v.id !== id);
  return vessels.length < before;
}

export function addImageToVessel(vesselId: string, image: VesselImage): Vessel | null {
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = [...(vessel.vessel_images ?? []), image];
  return vessel;
}

export function removeImageFromVessel(vesselId: string, imageId: string): Vessel | null {
  const vessel = vessels.find((v) => v.id === vesselId);
  if (!vessel) return null;
  vessel.vessel_images = (vessel.vessel_images ?? []).filter((img) => img.id !== imageId);
  return vessel;
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/admin-store.ts
git commit -m "feat: 인메모리 선박 데이터 스토어 (admin-store.ts)

서버 시작 시 vessels.json + overrides 로드.
CRUD 함수: get/add/update/delete + 이미지 추가/삭제.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: lib/data.ts를 인메모리 스토어 참조로 수정

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 1: localVessels()를 admin-store 참조로 변경**

`lib/data.ts` 상단 import 수정:

기존:
```ts
import { VESSEL_OVERRIDES } from "@/constants/vessels-data";
```

추가:
```ts
import { getAllVesselsFromStore } from "./admin-store";
```

`localVessels()` 함수 변경:

기존:
```ts
function localVessels(): Vessel[] {
  return (vesselsJson as unknown as Vessel[]).map((v) => {
    const override = VESSEL_OVERRIDES[v.id];
    if (!override) return v;
    return { ...v, ...override, vessel_images: v.vessel_images };
  });
}
```

변경:
```ts
function localVessels(): Vessel[] {
  return getAllVesselsFromStore();
}
```

`VESSEL_OVERRIDES` import와 `vesselsJson` import는 admin-store.ts에서 사용하므로 data.ts에서 제거해도 됨. 단, `workPhotosJson`과 `bookingsJson`은 유지.

기존:
```ts
import vesselsJson from "@/data/vessels.json";
import bookingsJson from "@/data/bookings.json";
```

변경:
```ts
import bookingsJson from "@/data/bookings.json";
```

`import { VESSEL_OVERRIDES }` 줄도 제거.

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add lib/data.ts
git commit -m "refactor: localVessels()를 admin-store 참조로 변경

인메모리 스토어의 데이터를 프론트 페이지에서도 참조.
관리자에서 선박 추가/수정하면 프론트에 즉시 반영.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: API Routes

**Files:**
- Create: `app/api/admin/vessels/route.ts`
- Create: `app/api/admin/vessels/[id]/route.ts`

- [ ] **Step 1: 목록 + 등록 API**

```ts
// app/api/admin/vessels/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllVesselsFromStore, addVesselToStore } from "@/lib/admin-store";
import type { Vessel } from "@/lib/supabase";

export async function GET() {
  const vessels = getAllVesselsFromStore();
  return NextResponse.json(vessels);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const vessel: Vessel = {
    id: body.id || `vessel-${Date.now()}`,
    title: body.title,
    slug: body.slug,
    type: body.type || "both",
    vessel_type: body.vessel_type || "화물선",
    year_built: body.year_built ?? null,
    length_m: body.length_m ?? null,
    tonnage: body.tonnage ?? null,
    engine_power: body.engine_power ?? null,
    capacity: body.capacity ?? null,
    location: body.location ?? null,
    description: body.description ?? null,
    features: body.features ?? [],
    rent_price_per_day: body.rent_price_per_day ?? null,
    sale_price: body.sale_price ?? null,
    is_available: body.is_available ?? true,
    is_featured: body.is_featured ?? false,
    status: body.status || "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vessel_images: body.vessel_images ?? [],
  };

  const created = addVesselToStore(vessel);
  return NextResponse.json(created, { status: 201 });
}
```

- [ ] **Step 2: 단건 조회 + 수정 + 삭제 API**

```ts
// app/api/admin/vessels/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getVesselFromStore,
  updateVesselInStore,
  deleteVesselFromStore,
} from "@/lib/admin-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vessel = getVesselFromStore(id);
  if (!vessel) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(vessel);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateVesselInStore(id, {
    ...body,
    updated_at: new Date().toISOString(),
  });
  if (!updated) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteVesselFromStore(id);
  if (!deleted) return NextResponse.json({ error: "선박을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/admin/vessels/
git commit -m "feat: 관리자 선박 CRUD API Routes

GET/POST /api/admin/vessels — 목록, 등록
GET/PUT/DELETE /api/admin/vessels/[id] — 조회, 수정, 삭제
인메모리 admin-store 참조.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: VesselImageUpload 컴포넌트

**Files:**
- Create: `components/admin/VesselImageUpload.tsx`

- [ ] **Step 1: 사진 업로드/미리보기 컴포넌트**

```tsx
// components/admin/VesselImageUpload.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { Plus, X, Star } from "lucide-react";
import { VESSEL_FILTER_CATEGORIES } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselImageUploadProps {
  images: VesselImage[];
  onChange: (images: VesselImage[]) => void;
}

const categoryOptions = VESSEL_FILTER_CATEGORIES.filter((c) => c.key !== "all");

export default function VesselImageUpload({ images, onChange }: VesselImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImages: VesselImage[] = files.map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      vessel_id: "",
      url: URL.createObjectURL(file),
      is_primary: images.length === 0 && i === 0,
      sort_order: images.length + i + 1,
      category: "exterior",
    }));
    onChange([...images, ...newImages]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
      filtered[0].is_primary = true;
    }
    onChange(filtered);
  };

  const setPrimary = (id: string) => {
    onChange(images.map((img) => ({ ...img, is_primary: img.id === id })));
  };

  const setCategory = (id: string, category: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, category } : img)));
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image src={img.url} alt="" fill className="object-cover" sizes="200px" unoptimized />
              {img.is_primary && (
                <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5" /> 대표
                </span>
              )}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(img.id)}
                    className="bg-white/90 hover:bg-white text-gray-600 rounded-full p-1"
                    title="대표 이미지로 설정"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1"
                  title="삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <select
                value={img.category ?? "exterior"}
                onChange={(e) => setCategory(img.id, e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs">사진 추가</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/admin/VesselImageUpload.tsx
git commit -m "feat: VesselImageUpload — 사진 업로드/미리보기/카테고리/대표지정

URL.createObjectURL()로 미리보기.
카테고리 선택, 대표 이미지 지정, 삭제 기능.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: VesselForm 컴포넌트

**Files:**
- Create: `components/admin/VesselForm.tsx`

- [ ] **Step 1: 등록/수정 공유 폼**

```tsx
// components/admin/VesselForm.tsx
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

export default function VesselForm({ vessel, mode }: VesselFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(vessel?.title ?? "");
  const [vesselType, setVesselType] = useState(vessel?.vessel_type ?? "화물선");
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
      vessel_type: vesselType,
      year_built: yearBuilt ? Number(yearBuilt) : null,
      length_m: lengthM ? Number(lengthM) : null,
      tonnage: tonnage ? Number(tonnage) : null,
      engine_power: enginePower || null,
      capacity: capacity ? Number(capacity) : null,
      location: location || null,
      rent_price_per_day: rentPrice ? Number(rentPrice) : null,
      sale_price: salePrice ? Number(salePrice) : null,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* 기본정보 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">기본정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>선박명 *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="예: 수연1호" />
          </div>
          <div>
            <label className={labelClass}>선종</label>
            <select value={vesselType} onChange={(e) => setVesselType(e.target.value)} className={inputClass}>
              <option value="어선">어선</option>
              <option value="화물선">화물선</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>거래유형</label>
            <select value={type} onChange={(e) => setType(e.target.value as Vessel["type"])} className={inputClass}>
              <option value="rent">임대</option>
              <option value="sale">판매</option>
              <option value="both">임대·판매</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>정박 위치</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="예: 인천" />
          </div>
        </div>
      </section>

      {/* 제원 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">제원</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>건조 연도</label>
            <input type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} className={inputClass} placeholder="예: 2015" />
          </div>
          <div>
            <label className={labelClass}>전장 (m)</label>
            <input type="number" step="0.1" value={lengthM} onChange={(e) => setLengthM(e.target.value)} className={inputClass} placeholder="예: 45" />
          </div>
          <div>
            <label className={labelClass}>톤수</label>
            <input type="number" value={tonnage} onChange={(e) => setTonnage(e.target.value)} className={inputClass} placeholder="예: 199" />
          </div>
          <div>
            <label className={labelClass}>엔진 출력</label>
            <input type="text" value={enginePower} onChange={(e) => setEnginePower(e.target.value)} className={inputClass} placeholder="예: 미쯔비시 750HP" />
          </div>
          <div>
            <label className={labelClass}>승선 정원</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} placeholder="예: 8" />
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">가격</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>임대가 (원/일)</label>
            <input type="number" value={rentPrice} onChange={(e) => setRentPrice(e.target.value)} className={inputClass} placeholder="예: 1500000" />
          </div>
          <div>
            <label className={labelClass}>판매가 (원)</label>
            <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={inputClass} placeholder="예: 350000000" />
          </div>
        </div>
      </section>

      {/* 상세 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">상세정보</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} placeholder="선박 소개를 작성해주세요." />
          </div>
          <div>
            <label className={labelClass}>특징/옵션 (쉼표로 구분)</label>
            <input type="text" value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className={inputClass} placeholder="예: GPS 항법장치, 냉난방, 자동조타장치" />
          </div>
        </div>
      </section>

      {/* 상태 */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>상태</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Vessel["status"])} className={inputClass}>
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
```

- [ ] **Step 2: 커밋**

```bash
git add components/admin/VesselForm.tsx
git commit -m "feat: VesselForm — 선박 등록/수정 공유 폼 컴포넌트

기본정보, 제원, 가격, 상세, 상태, 사진 섹션.
등록(POST)/수정(PUT) 모드 공유.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: AdminVesselTable 컴포넌트

**Files:**
- Create: `components/admin/AdminVesselTable.tsx`

- [ ] **Step 1: 선박 목록 테이블**

```tsx
// components/admin/AdminVesselTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Vessel } from "@/lib/supabase";

const typeLabel: Record<string, string> = { rent: "임대", sale: "판매", both: "임대·판매" };
const statusLabel: Record<string, string> = { active: "운영중", inactive: "비활성", sold: "판매완료" };
const statusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-gray-100 text-gray-500",
  sold: "bg-red-50 text-red-600",
};

interface AdminVesselTableProps {
  vessels: Vessel[];
}

export default function AdminVesselTable({ vessels: initial }: AdminVesselTableProps) {
  const router = useRouter();
  const [vessels, setVessels] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 선박을 삭제하시겠습니까?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/vessels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVessels((prev) => prev.filter((v) => v.id !== id));
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-16">사진</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">선박명</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">선종</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">거래</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">가격</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">상태</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vessels.map((v) => {
              const primary = v.vessel_images?.find((img) => img.is_primary) ?? v.vessel_images?.[0];
              return (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="relative w-12 h-9 rounded overflow-hidden bg-gray-100">
                      {primary ? (
                        <Image src={primary.url} alt="" fill className="object-cover" sizes="48px" unoptimized />
                      ) : (
                        <span className="flex items-center justify-center h-full text-gray-300 text-xs">🚢</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">{v.title}</td>
                  <td className="px-6 py-3 text-gray-500">{v.vessel_type}</td>
                  <td className="px-6 py-3 text-gray-500">{typeLabel[v.type]}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {v.rent_price_per_day ? `${v.rent_price_per_day.toLocaleString()}원/일` : ""}
                    {v.rent_price_per_day && v.sale_price ? " / " : ""}
                    {v.sale_price ? (v.sale_price >= 100000000 ? `${(v.sale_price / 100000000).toFixed(1)}억` : `${Math.floor(v.sale_price / 10000).toLocaleString()}만`) : ""}
                    {!v.rent_price_per_day && !v.sale_price ? "-" : ""}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[v.status]}`}>
                      {statusLabel[v.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/test1/admin/vessels/${v.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id, v.title)}
                        disabled={deleting === v.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {vessels.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                  등록된 선박이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/admin/AdminVesselTable.tsx
git commit -m "feat: AdminVesselTable — 선박 목록 테이블 + 수정/삭제

썸네일, 선박명, 선종, 거래유형, 가격, 상태 배지.
삭제 시 confirm 다이얼로그, 인메모리에서 즉시 제거.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: 관리자 페이지 (목록 / 등록 / 수정)

**Files:**
- Create: `app/test1/admin/vessels/page.tsx`
- Create: `app/test1/admin/vessels/new/page.tsx`
- Create: `app/test1/admin/vessels/[id]/edit/page.tsx`

- [ ] **Step 1: 선박 목록 페이지**

```tsx
// app/test1/admin/vessels/page.tsx
import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { getAllVesselsFromStore } from "@/lib/admin-store";
import AdminVesselTable from "@/components/admin/AdminVesselTable";

export default function AdminVesselsPage() {
  const vessels = getAllVesselsFromStore();

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/test1/admin" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
                <ChevronLeft className="w-4 h-4" /> 대시보드
              </Link>
              <h1 className="text-gray-900">선박 관리</h1>
              <p className="text-gray-400 text-sm mt-0.5">총 {vessels.length}척</p>
            </div>
            <Link
              href="/test1/admin/vessels/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              선박 등록
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AdminVesselTable vessels={vessels} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 선박 등록 페이지**

```tsx
// app/test1/admin/vessels/new/page.tsx
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VesselForm from "@/components/admin/VesselForm";

export default function NewVesselPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/test1/admin/vessels" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ChevronLeft className="w-4 h-4" /> 선박 관리
          </Link>
          <h1 className="text-gray-900">선박 등록</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <VesselForm mode="create" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 선박 수정 페이지**

```tsx
// app/test1/admin/vessels/[id]/edit/page.tsx
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getVesselFromStore } from "@/lib/admin-store";
import VesselForm from "@/components/admin/VesselForm";

export default async function EditVesselPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vessel = getVesselFromStore(id);
  if (!vessel) notFound();

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/test1/admin/vessels" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ChevronLeft className="w-4 h-4" /> 선박 관리
          </Link>
          <h1 className="text-gray-900">{vessel.title} 수정</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <VesselForm vessel={vessel} mode="edit" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

- [ ] **Step 5: 커밋**

```bash
git add app/test1/admin/vessels/
git commit -m "feat: 관리자 선박 관리 페이지 — 목록/등록/수정

/test1/admin/vessels — 테이블 목록 + 수정/삭제
/test1/admin/vessels/new — 등록 폼
/test1/admin/vessels/[id]/edit — 수정 폼

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: 빌드 검증 및 동작 확인

- [ ] **Step 1: 전체 빌드**

```bash
npm run build
```

Expected: 빌드 성공

- [ ] **Step 2: 동작 확인**

dev 서버에서:
- `/test1/admin` → "선박 관리" 클릭 → 선박 목록 10척 표시
- "선박 등록" → 폼 작성 → 등록 → 목록에 추가됨
- 수정 버튼 → 기존 데이터 채워진 폼 → 수정 → 반영
- 삭제 버튼 → confirm → 목록에서 제거
- 사진 추가 → 미리보기 → 카테고리 선택 → 대표 지정
- 프론트(`/test1/vessels`) → 추가한 선박이 목록에 보임

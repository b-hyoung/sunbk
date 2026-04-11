# 실제 선박 사진 통합 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 외주작업 폴더의 실제 선박 사진을 사이트에 통합 — 가상 데이터 교체, 갤러리 확장, 작업현장 페이지 신규 추가.

**Architecture:** 사진을 `public/images/vessels/{선박}/`에 영문 리네임 배치. `vessels.json`을 실제 선박 8척으로 재작성하고 vessel_images에 category 필드를 추가. `constants/photo-config.ts`에 데이터 모드 설정을 분리하여 향후 하이브리드 전환 가능. 3개 버전(test1/test2/test3) 모두 적용.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, next/image

**Spec:** `docs/superpowers/specs/2026-04-11-real-photos-integration-design.md`

---

## File Structure

### 신규 파일

| 파일 | 역할 |
|------|------|
| `constants/photo-config.ts` | 사진 카테고리 정의, 데이터 모드 설정 (unified/split) |
| `components/vessels/VesselGallery.tsx` | 공유 선박 갤러리 컴포넌트 (메인 이미지 + 썸네일 + 라이트박스) |
| `app/test1/work/page.tsx` | test1 작업현장 페이지 (서버 컴포넌트) |
| `app/test1/work/_components/WorkGallery.tsx` | test1 작업현장 갤러리 (클라이언트 컴포넌트) |
| `app/test2/work/page.tsx` | test2 작업현장 페이지 |
| `app/test2/work/_components/WorkGallery.tsx` | test2 작업현장 갤러리 |
| `app/test3/work/page.tsx` | test3 작업현장 페이지 |
| `app/test3/work/_components/WorkGallery.tsx` | test3 작업현장 갤러리 |
| `public/images/vessels/{선박별 폴더}/` | 실제 사진 파일들 |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `data/vessels.json` | 가상 → 실제 선박 8척 전면 재작성 |
| `data/work-photos.json` | 빈 배열로 리셋 (split 모드 대비) |
| `lib/supabase.ts` | VesselImage에 category, taken_date 필드 추가 |
| `lib/data.ts` | getAllWorkPhotos(), getVesselPhotos() 함수 추가 |
| `constants/enums.ts` | Routes에 WORK 추가, getNavLinks에 작업현장 메뉴 추가 |
| `components/test2/Header.tsx` | navLinks에 작업현장 메뉴 추가 |
| `app/test1/vessels/[slug]/page.tsx` | 단일 이미지 → VesselGallery 교체 |
| `app/test2/vessels/[slug]/page.tsx` | 단일 이미지 → VesselGallery 교체 |
| `app/test3/vessels/[slug]/page.tsx` | 단일 이미지 → VesselGallery 교체 |
| `app/test1/about/_components/AboutClient.tsx` | 작업사진 갤러리 제거, 회사소개 + /work 링크 |
| `app/test2/about/_components/Test2AboutClient.tsx` | 작업사진 갤러리 제거, 회사소개 + /work 링크 |
| `app/test3/about/_components/Test3AboutClient.tsx` | 작업사진 갤러리 제거, 회사소개 + /work 링크 |

---

## Task 1: 사진 파일 정리 및 배치

**Files:**
- Create: `public/images/vessels/suyeon1/`, `suyeon3/`, `suyeon5/`, `suyeon6/`, `suyeon9/`, `sinseong/`, `youngjin/`, `jinyang2/`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p public/images/vessels/{suyeon1,suyeon3,suyeon5,suyeon6,suyeon9,sinseong,youngjin,jinyang2}
```

- [ ] **Step 2: 수연1호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/20241224 수연1호.jpg" public/images/vessels/suyeon1/exterior.jpg
cp "외주작업/수연선박 사진/260410수연1호 조타실.jpg" public/images/vessels/suyeon1/bridge.jpg
cp "외주작업/수연선박 사진/20250805수연1호 주기관,미쯔비시.jpg" public/images/vessels/suyeon1/main-engine.jpg
cp "외주작업/수연선박 사진/260410수연1호 발전기.jpg" public/images/vessels/suyeon1/generator.jpg
cp "외주작업/수연선박 사진/20250805수연1호 발전기 기관실.jpg" public/images/vessels/suyeon1/engine-room.jpg
cp "외주작업/수연선박 사진/20250805수연1호 발전기 경유휠타.jpg" public/images/vessels/suyeon1/generator-filter.jpg
cp "외주작업/수연선박 사진/20250805수연1호 생활발전기 명판.jpg" public/images/vessels/suyeon1/generator-nameplate.jpg
cp "외주작업/수연선박 사진/20250805수연1호 실외 발전기 오일휠타.jpg" public/images/vessels/suyeon1/generator-oil-filter.jpg
cp "외주작업/수연선박 사진/20241121수연1호상가.jpg" public/images/vessels/suyeon1/dry-dock.jpg
```

- [ ] **Step 3: 수연3호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/20250618 수연3호.jpg" public/images/vessels/suyeon3/exterior.jpg
```

- [ ] **Step 4: 수연5호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/240627수연5호.jpg" public/images/vessels/suyeon5/exterior.jpg
cp "외주작업/수연선박 사진/260410수연5호 조타실.jpg" public/images/vessels/suyeon5/bridge.jpg
cp "외주작업/수연선박 사진/260410수연5호 선실.jpg" public/images/vessels/suyeon5/cabin.jpg
cp "외주작업/수연선박 사진/260409수연5호 주기관.jpg" public/images/vessels/suyeon5/main-engine.jpg
cp "외주작업/수연선박 사진/20241121수연5호 상가.jpg" public/images/vessels/suyeon5/dry-dock.jpg
```

- [ ] **Step 5: 수연6호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/260408수연6호 .jpg" public/images/vessels/suyeon6/exterior.jpg
cp "외주작업/수연선박 사진/260410수연6호 조타실.jpg" public/images/vessels/suyeon6/bridge.jpg
cp "외주작업/수연선박 사진/260410수연6호 선원실.jpg" public/images/vessels/suyeon6/cabin.jpg
cp "외주작업/수연선박 사진/260410수연6호 주기관.jpg" public/images/vessels/suyeon6/main-engine.jpg
cp "외주작업/수연선박 사진/250603수연6호 상가.jpg" public/images/vessels/suyeon6/dry-dock.jpg
cp "외주작업/수연선박 사진/수연6호 환경정화 운동260320.jpg" public/images/vessels/suyeon6/cleanup.jpg
```

- [ ] **Step 6: 수연9호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/20250819수연9호 야마하250마력.jpg" public/images/vessels/suyeon9/exterior.jpg
cp "외주작업/수연선박 사진/20250819수연9호 야마하250마력 (2).jpg" public/images/vessels/suyeon9/engine.jpg
```

- [ ] **Step 7: 신성호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/240627신성호.jpg" public/images/vessels/sinseong/exterior.jpg
cp "외주작업/수연선박 사진/260409신성호 우현 .jpg" public/images/vessels/sinseong/exterior-starboard.jpg
cp "외주작업/수연선박 사진/260410신성호 조타실.jpg" public/images/vessels/sinseong/bridge.jpg
cp "외주작업/수연선박 사진/260410신성호 선실.jpg" public/images/vessels/sinseong/cabin.jpg
cp "외주작업/수연선박 사진/260410신성호 주기관.jpg" public/images/vessels/sinseong/main-engine.jpg
```

- [ ] **Step 8: 영진호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/20240612 영진호.jpg" public/images/vessels/youngjin/exterior.jpg
cp "외주작업/수연선박 사진/20240612 영진호 후면부.jpg" public/images/vessels/youngjin/exterior-rear.jpg
```

- [ ] **Step 9: 진양2호 사진 복사 및 리네임**

```bash
cp "외주작업/수연선박 사진/20240613 진양2호.jpg" public/images/vessels/jinyang2/exterior.jpg
cp "외주작업/수연선박 사진/260410진양2호 선실.jpg" public/images/vessels/jinyang2/cabin.jpg
cp "외주작업/수연선박 사진/260409진양2호 주기관.jpg" public/images/vessels/jinyang2/main-engine.jpg
cp "외주작업/수연선박 사진/20240613진양2호상가.jpg" public/images/vessels/jinyang2/dry-dock.jpg
cp "외주작업/수연선박 사진/251010진양2호 항해중.jpg" public/images/vessels/jinyang2/sailing.jpg
cp "외주작업/수연선박 사진/260409진양2호 항해 .jpg" public/images/vessels/jinyang2/sailing-2.jpg
```

- [ ] **Step 10: 파일 배치 확인**

```bash
find public/images/vessels -type f | sort
```

Expected: 선박 8개 폴더, 총 약 35-40개 jpg 파일

- [ ] **Step 11: 커밋**

```bash
git add public/images/vessels/
git commit -m "chore: 실제 선박 사진 public/images/vessels/에 배치

외주작업 폴더의 사진을 영문 리네임하여 선박별 폴더에 정리.
8척: 수연1/3/5/6/9호, 신성호, 영진호, 진양2호"
```

---

## Task 2: 설정 파일 및 타입 확장

**Files:**
- Create: `constants/photo-config.ts`
- Modify: `lib/supabase.ts:32-38`

- [ ] **Step 1: photo-config.ts 생성**

```ts
// constants/photo-config.ts

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

/** 작업현장 필터에 표시할 메인 카테고리 (세부 카테고리는 그룹핑) */
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
```

- [ ] **Step 2: VesselImage 타입에 category, taken_date 추가**

`lib/supabase.ts` 32-38행의 VesselImage 인터페이스를 수정:

```ts
export interface VesselImage {
  id: string
  vessel_id: string
  url: string
  is_primary: boolean
  sort_order: number
  category?: string
  taken_date?: string
}
```

- [ ] **Step 3: 커밋**

```bash
git add constants/photo-config.ts lib/supabase.ts
git commit -m "feat: 사진 설정 파일 및 VesselImage 타입 확장

photo-config.ts — 카테고리 정의, 데이터 모드 설정 (unified/split 전환 가능)
VesselImage — category, taken_date 필드 추가"
```

---

## Task 3: vessels.json 실제 선박 데이터로 재작성

**Files:**
- Modify: `data/vessels.json` (전면 재작성)
- Modify: `data/work-photos.json` (빈 배열로 리셋)

- [ ] **Step 1: vessels.json 재작성**

실제 선박 8척 데이터. 각 선박의 vessel_images 배열에 Task 1에서 배치한 사진 경로와 category를 포함.

```json
[
  {
    "id": "suyeon-1",
    "title": "수연1호",
    "slug": "suyeon-1",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": "미쯔비시",
    "capacity": null,
    "location": "인천",
    "description": "수연선박의 주력 화물선. 미쯔비시 주기관 탑재, 생활발전기 완비.",
    "features": ["미쯔비시 주기관", "생활발전기", "경유필터", "오일필터"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": true,
    "status": "active",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2026-04-10T12:00:00Z",
    "vessel_images": [
      { "id": "suyeon1-exterior", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2024-12-24" },
      { "id": "suyeon1-bridge", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/bridge.jpg", "is_primary": false, "sort_order": 2, "category": "bridge", "taken_date": "2026-04-10" },
      { "id": "suyeon1-main-engine", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/main-engine.jpg", "is_primary": false, "sort_order": 3, "category": "main-engine", "taken_date": "2025-08-05" },
      { "id": "suyeon1-generator", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/generator.jpg", "is_primary": false, "sort_order": 4, "category": "generator", "taken_date": "2026-04-10" },
      { "id": "suyeon1-engine-room", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/engine-room.jpg", "is_primary": false, "sort_order": 5, "category": "engine-room", "taken_date": "2025-08-05" },
      { "id": "suyeon1-generator-filter", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/generator-filter.jpg", "is_primary": false, "sort_order": 6, "category": "generator-filter", "taken_date": "2025-08-05" },
      { "id": "suyeon1-generator-nameplate", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/generator-nameplate.jpg", "is_primary": false, "sort_order": 7, "category": "generator-nameplate", "taken_date": "2025-08-05" },
      { "id": "suyeon1-generator-oil-filter", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/generator-oil-filter.jpg", "is_primary": false, "sort_order": 8, "category": "generator-oil-filter", "taken_date": "2025-08-05" },
      { "id": "suyeon1-dry-dock", "vessel_id": "suyeon-1", "url": "/images/vessels/suyeon1/dry-dock.jpg", "is_primary": false, "sort_order": 9, "category": "dry-dock", "taken_date": "2024-11-21" }
    ]
  },
  {
    "id": "suyeon-3",
    "title": "수연3호",
    "slug": "suyeon-3",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "수연선박 소속 화물선.",
    "features": [],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": false,
    "status": "active",
    "created_at": "2024-06-06T09:00:00Z",
    "updated_at": "2025-06-18T12:00:00Z",
    "vessel_images": [
      { "id": "suyeon3-exterior", "vessel_id": "suyeon-3", "url": "/images/vessels/suyeon3/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2025-06-18" }
    ]
  },
  {
    "id": "suyeon-5",
    "title": "수연5호",
    "slug": "suyeon-5",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "수연선박 소속 화물선. 선실, 조타실 완비.",
    "features": ["선실", "조타실"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": true,
    "status": "active",
    "created_at": "2024-06-27T09:00:00Z",
    "updated_at": "2026-04-10T12:00:00Z",
    "vessel_images": [
      { "id": "suyeon5-exterior", "vessel_id": "suyeon-5", "url": "/images/vessels/suyeon5/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2024-06-27" },
      { "id": "suyeon5-bridge", "vessel_id": "suyeon-5", "url": "/images/vessels/suyeon5/bridge.jpg", "is_primary": false, "sort_order": 2, "category": "bridge", "taken_date": "2026-04-10" },
      { "id": "suyeon5-cabin", "vessel_id": "suyeon-5", "url": "/images/vessels/suyeon5/cabin.jpg", "is_primary": false, "sort_order": 3, "category": "cabin", "taken_date": "2026-04-10" },
      { "id": "suyeon5-main-engine", "vessel_id": "suyeon-5", "url": "/images/vessels/suyeon5/main-engine.jpg", "is_primary": false, "sort_order": 4, "category": "main-engine", "taken_date": "2026-04-09" },
      { "id": "suyeon5-dry-dock", "vessel_id": "suyeon-5", "url": "/images/vessels/suyeon5/dry-dock.jpg", "is_primary": false, "sort_order": 5, "category": "dry-dock", "taken_date": "2024-11-21" }
    ]
  },
  {
    "id": "suyeon-6",
    "title": "수연6호",
    "slug": "suyeon-6",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "수연선박 소속 화물선. 환경정화 활동 참여 이력.",
    "features": ["선원실", "조타실"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": true,
    "status": "active",
    "created_at": "2025-06-03T09:00:00Z",
    "updated_at": "2026-04-10T12:00:00Z",
    "vessel_images": [
      { "id": "suyeon6-exterior", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2026-04-08" },
      { "id": "suyeon6-bridge", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/bridge.jpg", "is_primary": false, "sort_order": 2, "category": "bridge", "taken_date": "2026-04-10" },
      { "id": "suyeon6-cabin", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/cabin.jpg", "is_primary": false, "sort_order": 3, "category": "cabin", "taken_date": "2026-04-10" },
      { "id": "suyeon6-main-engine", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/main-engine.jpg", "is_primary": false, "sort_order": 4, "category": "main-engine", "taken_date": "2026-04-10" },
      { "id": "suyeon6-dry-dock", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/dry-dock.jpg", "is_primary": false, "sort_order": 5, "category": "dry-dock", "taken_date": "2025-06-03" },
      { "id": "suyeon6-cleanup", "vessel_id": "suyeon-6", "url": "/images/vessels/suyeon6/cleanup.jpg", "is_primary": false, "sort_order": 6, "category": "cleanup", "taken_date": "2026-03-20" }
    ]
  },
  {
    "id": "suyeon-9",
    "title": "수연9호",
    "slug": "suyeon-9",
    "type": "rent",
    "vessel_type": "레저선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": "야마하 250마력",
    "capacity": null,
    "location": "인천",
    "description": "야마하 250마력 선외기 탑재 레저선.",
    "features": ["야마하 250마력 선외기"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": false,
    "status": "active",
    "created_at": "2025-08-19T09:00:00Z",
    "updated_at": "2025-08-19T12:00:00Z",
    "vessel_images": [
      { "id": "suyeon9-exterior", "vessel_id": "suyeon-9", "url": "/images/vessels/suyeon9/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2025-08-19" },
      { "id": "suyeon9-engine", "vessel_id": "suyeon-9", "url": "/images/vessels/suyeon9/engine.jpg", "is_primary": false, "sort_order": 2, "category": "engine", "taken_date": "2025-08-19" }
    ]
  },
  {
    "id": "sinseong",
    "title": "신성호",
    "slug": "sinseong",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "신성호. 선실, 조타실 완비.",
    "features": ["선실", "조타실"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": true,
    "status": "active",
    "created_at": "2024-06-27T09:00:00Z",
    "updated_at": "2026-04-10T12:00:00Z",
    "vessel_images": [
      { "id": "sinseong-exterior", "vessel_id": "sinseong", "url": "/images/vessels/sinseong/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2024-06-27" },
      { "id": "sinseong-exterior-starboard", "vessel_id": "sinseong", "url": "/images/vessels/sinseong/exterior-starboard.jpg", "is_primary": false, "sort_order": 2, "category": "exterior-starboard", "taken_date": "2026-04-09" },
      { "id": "sinseong-bridge", "vessel_id": "sinseong", "url": "/images/vessels/sinseong/bridge.jpg", "is_primary": false, "sort_order": 3, "category": "bridge", "taken_date": "2026-04-10" },
      { "id": "sinseong-cabin", "vessel_id": "sinseong", "url": "/images/vessels/sinseong/cabin.jpg", "is_primary": false, "sort_order": 4, "category": "cabin", "taken_date": "2026-04-10" },
      { "id": "sinseong-main-engine", "vessel_id": "sinseong", "url": "/images/vessels/sinseong/main-engine.jpg", "is_primary": false, "sort_order": 5, "category": "main-engine", "taken_date": "2026-04-10" }
    ]
  },
  {
    "id": "youngjin",
    "title": "영진호",
    "slug": "youngjin",
    "type": "sale",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "영진호. 판매 전용.",
    "features": [],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": false,
    "status": "active",
    "created_at": "2024-06-12T09:00:00Z",
    "updated_at": "2024-06-13T12:00:00Z",
    "vessel_images": [
      { "id": "youngjin-exterior", "vessel_id": "youngjin", "url": "/images/vessels/youngjin/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2024-06-12" },
      { "id": "youngjin-exterior-rear", "vessel_id": "youngjin", "url": "/images/vessels/youngjin/exterior-rear.jpg", "is_primary": false, "sort_order": 2, "category": "exterior-rear", "taken_date": "2024-06-12" }
    ]
  },
  {
    "id": "jinyang-2",
    "title": "진양2호",
    "slug": "jinyang-2",
    "type": "both",
    "vessel_type": "화물선",
    "year_built": null,
    "length_m": null,
    "tonnage": null,
    "engine_power": null,
    "capacity": null,
    "location": "인천",
    "description": "진양2호. 항해 실적 다수.",
    "features": ["선실"],
    "rent_price_per_day": null,
    "sale_price": null,
    "is_available": true,
    "is_featured": true,
    "status": "active",
    "created_at": "2024-06-13T09:00:00Z",
    "updated_at": "2026-04-10T12:00:00Z",
    "vessel_images": [
      { "id": "jinyang2-exterior", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/exterior.jpg", "is_primary": true, "sort_order": 1, "category": "exterior", "taken_date": "2024-06-13" },
      { "id": "jinyang2-cabin", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/cabin.jpg", "is_primary": false, "sort_order": 2, "category": "cabin", "taken_date": "2026-04-10" },
      { "id": "jinyang2-main-engine", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/main-engine.jpg", "is_primary": false, "sort_order": 3, "category": "main-engine", "taken_date": "2026-04-09" },
      { "id": "jinyang2-dry-dock", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/dry-dock.jpg", "is_primary": false, "sort_order": 4, "category": "dry-dock", "taken_date": "2024-06-13" },
      { "id": "jinyang2-sailing", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/sailing.jpg", "is_primary": false, "sort_order": 5, "category": "sailing", "taken_date": "2025-10-10" },
      { "id": "jinyang2-sailing-2", "vessel_id": "jinyang-2", "url": "/images/vessels/jinyang2/sailing-2.jpg", "is_primary": false, "sort_order": 6, "category": "sailing", "taken_date": "2026-04-09" }
    ]
  }
]
```

- [ ] **Step 2: work-photos.json 리셋**

```json
[]
```

- [ ] **Step 3: 커밋**

```bash
git add data/vessels.json data/work-photos.json
git commit -m "data: 가상 선박 → 실제 선박 8척 데이터로 전면 교체

vessels.json — 수연1/3/5/6/9호, 신성호, 영진호, 진양2호
vessel_images에 category, taken_date 필드 포함
work-photos.json — 빈 배열로 리셋 (split 모드 대비)"
```

---

## Task 4: data.ts에 사진 조회 함수 추가

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 1: getAllWorkPhotos, getVesselPhotos 함수 추가**

`lib/data.ts` 끝에 다음 함수를 추가:

```ts
import { PHOTO_DATA_MODE } from "@/constants/photo-config";
import workPhotosJson from "@/data/work-photos.json";

// work-photos.json의 아이템 타입
interface WorkPhotoItem {
  id: string;
  src: string;
  title: string;
  ship: string;
  vessel_id: string;
  category: string;
  taken_date?: string;
}

/** 전체 작업 사진 목록 (work 페이지용) */
export async function getAllWorkPhotos(): Promise<
  Array<{ id: string; src: string; title: string; ship: string; vessel_id: string; category: string; taken_date?: string }>
> {
  if (PHOTO_DATA_MODE === "split") {
    return workPhotosJson as WorkPhotoItem[];
  }

  // unified 모드: 모든 선박의 vessel_images를 합침
  const vessels = USE_LOCAL ? localVessels() : await getVesselsFromSupabase();
  return vessels.flatMap((v) =>
    (v.vessel_images ?? []).map((img) => ({
      id: img.id,
      src: img.url,
      title: getCategoryLabel(img.category ?? "exterior"),
      ship: v.title,
      vessel_id: v.id,
      category: img.category ?? "exterior",
      taken_date: img.taken_date,
    }))
  );
}

/** 특정 선박의 사진 (카테고리 필터 옵션) */
export async function getVesselPhotos(
  vesselId: string,
  category?: string
): Promise<VesselImage[]> {
  const vessel = await getVesselById(vesselId);
  if (!vessel) return [];
  let images = vessel.vessel_images ?? [];
  if (category) {
    images = images.filter((img) => img.category === category);
  }
  return images;
}
```

import를 파일 상단에 추가하고, Supabase에서 선박 목록을 가져오는 헬퍼도 추가:

```ts
import { getCategoryLabel } from "@/constants/photo-config";
```

unified 모드에서 Supabase 호출용 내부 헬퍼:

```ts
async function getVesselsFromSupabase(): Promise<Vessel[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("status", "active");
  return data ?? [];
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공 (또는 dev 모드에서 에러 없음)

- [ ] **Step 3: 커밋**

```bash
git add lib/data.ts
git commit -m "feat: getAllWorkPhotos, getVesselPhotos 함수 추가

unified/split 데이터 모드에 따라 다른 소스에서 사진 조회.
getCategoryLabel로 카테고리 한글 라벨 변환."
```

---

## Task 5: VesselGallery 공유 컴포넌트

**Files:**
- Create: `components/vessels/VesselGallery.tsx`

- [ ] **Step 1: VesselGallery 컴포넌트 생성**

```tsx
// components/vessels/VesselGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryLabel } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselGalleryProps {
  images: VesselImage[];
  vesselTitle: string;
}

export default function VesselGallery({ images, vesselTitle }: VesselGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center text-gray-200 text-8xl select-none">
        🚢
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <>
      {/* 메인 이미지 */}
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={activeImage.url}
          alt={`${vesselTitle} - ${getCategoryLabel(activeImage.category ?? "")}`}
          fill
          className="object-cover"
          priority
        />
        {activeImage.category && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {getCategoryLabel(activeImage.category)}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* 썸네일 스트립 */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-blue-500" : "border-gray-100 hover:border-blue-300"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              {img.category && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 leading-tight">
                  {getCategoryLabel(img.category)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-7 h-7" />
          </button>

          <button
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-4xl mx-16 aspect-[16/9]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].url}
              alt={`${vesselTitle} - ${getCategoryLabel(images[activeIndex].category ?? "")}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p className="text-white font-semibold">
                {vesselTitle} — {getCategoryLabel(images[activeIndex].category ?? "")}
              </p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-5 text-white/50 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/vessels/VesselGallery.tsx
git commit -m "feat: VesselGallery 공유 컴포넌트

메인 이미지 + 카테고리 라벨 + 썸네일 스트립 + 라이트박스.
3개 버전(test1/test2/test3) 공유."
```

---

## Task 6: 선박 상세 페이지에 VesselGallery 적용

**Files:**
- Modify: `app/test1/vessels/[slug]/page.tsx`
- Modify: `app/test2/vessels/[slug]/page.tsx`
- Modify: `app/test3/vessels/[slug]/page.tsx`

- [ ] **Step 1: test1 선박 상세 페이지 수정**

`app/test1/vessels/[slug]/page.tsx`에서 기존 이미지 영역(76~105행)을 VesselGallery로 교체:

기존:
```tsx
{/* 메인 이미지 */}
<div data-fade-up>
  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50">
    {primaryImage ? (
      <Image ... />
    ) : (
      <div ...>🚢</div>
    )}
  </div>
  {images.length > 1 && (
    <div className="flex gap-2 mt-2 overflow-x-auto">
      {images.map((img) => (...))}
    </div>
  )}
</div>
```

교체:
```tsx
import VesselGallery from "@/components/vessels/VesselGallery";

// ... 컴포넌트 내부:
<div data-fade-up>
  <VesselGallery images={images} vesselTitle={vessel.title} />
</div>
```

`Image` import는 다른 곳에서 쓰지 않으면 제거. `primaryImage` 변수도 사용처 없으면 제거.

- [ ] **Step 2: test2 선박 상세 페이지도 동일하게 수정**

`app/test2/vessels/[slug]/page.tsx` — 이미지 영역을 VesselGallery로 교체.

- [ ] **Step 3: test3 선박 상세 페이지도 동일하게 수정**

`app/test3/vessels/[slug]/page.tsx` — 이미지 영역을 VesselGallery로 교체.

- [ ] **Step 4: dev 서버에서 확인**

```bash
npm run dev
```

브라우저에서 `/test1/vessels/suyeon-1` 접속 → 갤러리에 실제 사진 표시, 썸네일 클릭 시 메인 교체, 라이트박스 동작 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/test1/vessels/[slug]/page.tsx app/test2/vessels/[slug]/page.tsx app/test3/vessels/[slug]/page.tsx
git commit -m "feat: 선박 상세 페이지에 VesselGallery 적용

3개 버전 모두 기존 단일 이미지 → 부위별 갤러리로 확장."
```

---

## Task 7: 네비게이션에 작업현장 메뉴 추가

**Files:**
- Modify: `constants/enums.ts`
- Modify: `components/test2/Header.tsx`

- [ ] **Step 1: enums.ts에 WORK 라우트 추가 및 네비게이션 수정**

`constants/enums.ts` Routes enum에 추가:

```ts
export enum Routes {
    ROOT = "/",
    MENU = "menu",
    ABOUT = "about",
    WORK = "work",       // 추가
    CONTACT = "contact",
    // ...
}
```

`getNavLinks` 함수 수정:

```ts
export function getNavLinks(basePath?: string) {
  const base = basePath ? `/${basePath}` : "";
  return [
    { href: `${base}/${Routes.VESSELS}`,                     label: "선박 목록" },
    { href: `${base}/${Routes.VESSELS}?type=rent`,           label: "선박 임대" },
    { href: `${base}/${Routes.VESSELS}?type=sale`,           label: "선박 판매" },
    { href: `${base}/${Routes.WORK}`,                        label: "작업현장" },
    { href: `${base}/${Routes.ABOUT}`,                       label: "회사소개" },
    { href: `${base}/${Routes.CONTACT}`,                     label: "오시는길" },
  ];
}
```

- [ ] **Step 2: test2 Header의 navLinks에 작업현장 추가**

`components/test2/Header.tsx` 8-19행의 navLinks를 수정:

```ts
const navLinks = [
  {
    label: "선박 매물",
    href: "/test2/vessels",
    children: [
      { href: "/test2/vessels?type=rent", label: "선박 임대" },
      { href: "/test2/vessels?type=sale", label: "선박 판매" },
    ],
  },
  { label: "작업현장", href: "/test2/work" },
  { label: "회사소개", href: "/test2/about" },
  { label: "오시는길", href: "/test2/contact" },
];
```

- [ ] **Step 3: Footer의 navIcons에 작업현장 아이콘 추가**

`components/layout/Footer.tsx`에서 navIcons에 추가:

```ts
import { Wrench } from "lucide-react";

const navIcons: Record<string, React.ElementType> = {
  "선박 임대": CalendarDays,
  "선박 판매": Tag,
  "작업현장": Wrench,
  "회사소개": Camera,
  "오시는길": MapPin,
};
```

- [ ] **Step 4: 커밋**

```bash
git add constants/enums.ts components/test2/Header.tsx components/layout/Footer.tsx
git commit -m "feat: 네비게이션에 작업현장 메뉴 추가

enums.ts — WORK 라우트, getNavLinks에 작업현장/회사소개 분리
test2 Header — navLinks 업데이트
Footer — navIcons에 작업현장 아이콘 추가"
```

---

## Task 8: 작업현장 페이지 구현 (/testN/work)

**Files:**
- Create: `app/test1/work/page.tsx`
- Create: `app/test1/work/_components/WorkGallery.tsx`
- Create: `app/test2/work/page.tsx`
- Create: `app/test2/work/_components/WorkGallery.tsx`
- Create: `app/test3/work/page.tsx`
- Create: `app/test3/work/_components/WorkGallery.tsx`

- [ ] **Step 1: WorkGallery 클라이언트 컴포넌트 (test1)**

```tsx
// app/test1/work/_components/WorkGallery.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { WORK_FILTER_CATEGORIES } from "@/constants/photo-config";

interface WorkPhoto {
  id: string;
  src: string;
  title: string;
  ship: string;
  vessel_id: string;
  category: string;
  taken_date?: string;
}

interface WorkGalleryProps {
  photos: WorkPhoto[];
}

export default function WorkGallery({ photos }: WorkGalleryProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shipFilter, setShipFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 선박 목록 추출
  const ships = useMemo(() => {
    const unique = [...new Map(photos.map((p) => [p.vessel_id, p.ship])).entries()];
    return [{ id: "all", name: "전체 선박" }, ...unique.map(([id, name]) => ({ id, name }))];
  }, [photos]);

  // 필터링
  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (categoryFilter !== "all" && !p.category.startsWith(categoryFilter)) return false;
      if (shipFilter !== "all" && p.vessel_id !== shipFilter) return false;
      return true;
    });
  }, [photos, categoryFilter, shipFilter]);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % filtered.length);

  return (
    <>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {WORK_FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
              categoryFilter === cat.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 선박 필터 */}
      <div className="flex gap-2 flex-wrap mb-8">
        {ships.map((s) => (
          <button
            key={s.id}
            onClick={() => setShipFilter(s.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              shipFilter === s.id
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-400 hover:border-gray-400"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo, i) => (
          <div
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={photo.src}
                alt={`${photo.ship} ${photo.title}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                {photo.title}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-800">{photo.ship}</p>
              {photo.taken_date && (
                <p className="text-xs text-gray-400">{photo.taken_date}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          해당 조건의 사진이 없습니다.
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-5 right-5 text-white/70 hover:text-white" onClick={closeLightbox}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl mx-16 aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightboxIndex].src}
              alt={`${filtered[lightboxIndex].ship} ${filtered[lightboxIndex].title}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p className="text-white font-semibold">{filtered[lightboxIndex].ship} — {filtered[lightboxIndex].title}</p>
              {filtered[lightboxIndex].taken_date && (
                <p className="text-white/50 text-sm">{filtered[lightboxIndex].taken_date}</p>
              )}
            </div>
          </div>
          <button className="absolute right-4 text-white/70 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-5 text-white/50 text-sm">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: test1 work 페이지 서버 컴포넌트**

```tsx
// app/test1/work/page.tsx
export const runtime = "edge";
import { getAllWorkPhotos } from "@/lib/data";
import WorkGallery from "./_components/WorkGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "작업현장 | 수연선박",
  description: "수연선박의 정비, 항해, 상가 작업 등 현장 기록을 사진으로 확인하세요.",
};

export default async function WorkPage() {
  const photos = await getAllWorkPhotos();

  return (
    <div className="bg-white min-h-screen">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Work & Maintenance
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            수연선박의 작업현장
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
          </p>
        </div>
      </section>

      {/* 갤러리 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">작업사진</h2>
          <p className="text-sm text-gray-400">❈ 사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>
        <WorkGallery photos={photos} />
      </section>
    </div>
  );
}
```

- [ ] **Step 3: test2, test3에 동일 구조 생성**

test2:
- `app/test2/work/page.tsx` — test1과 동일 구조, 스타일은 test2 디자인에 맞게 (히어로 배경색 `#09388a` 등)
- `app/test2/work/_components/WorkGallery.tsx` — test1 WorkGallery를 복사 (test2 스타일 필요 시 조정)

test3:
- `app/test3/work/page.tsx` — test1과 동일 구조
- `app/test3/work/_components/WorkGallery.tsx` — test1 WorkGallery를 복사

- [ ] **Step 4: dev 서버에서 확인**

```bash
npm run dev
```

`/test1/work` 접속 → 전체 사진 그리드 표시, 카테고리/선박 필터 동작, 라이트박스 동작 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/test1/work/ app/test2/work/ app/test3/work/
git commit -m "feat: 작업현장 페이지 (/testN/work) 신규 추가

카테고리/선박 필터 + 반응형 그리드 + 라이트박스.
3개 버전 모두 적용."
```

---

## Task 9: about 페이지를 회사소개로 정리

**Files:**
- Modify: `app/test1/about/_components/AboutClient.tsx`
- Modify: `app/test2/about/_components/Test2AboutClient.tsx`
- Modify: `app/test3/about/_components/Test3AboutClient.tsx`
- Modify: `app/test1/about/page.tsx`
- Modify: `app/test2/about/page.tsx`
- Modify: `app/test3/about/page.tsx`

- [ ] **Step 1: test1 AboutClient 수정**

기존 작업사진 갤러리를 제거하고 회사소개 콘텐츠 + /work 링크로 교체:

```tsx
// app/test1/about/_components/AboutClient.tsx
"use client";

import Link from "next/link";
import { Phone, Anchor, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/constants/company";

export default function AboutClient() {
  return (
    <div className="bg-white">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            About Us
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            {COMPANY.name}
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            선박 임대·판매 전문기업. 신뢰와 전문성으로 바다 위의 파트너가 되겠습니다.
          </p>
        </div>
      </section>

      {/* 회사 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-gray-900 mb-4">회사 소개</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              {COMPANY.name}은 인천을 기반으로 선박 임대 및 판매 서비스를 제공하는 전문 기업입니다.
              다년간의 경험과 노하우를 바탕으로 고객의 목적에 맞는 최적의 선박을 제안해 드립니다.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Anchor className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">대표자</p>
                  <p className="text-gray-500">{COMPANY.representative}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">주소</p>
                  <p className="text-gray-500">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">운영시간</p>
                  <p className="text-gray-500">{COMPANY.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 작업현장 바로가기 */}
          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-gray-900 font-bold text-lg mb-3">작업현장 사진</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                수연선박의 정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
              </p>
              <Link
                href="/test1/work"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                작업현장 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-600 rounded-2xl px-8 py-14 md:py-16 text-center">
            <h2 className="text-white mb-3">궁금한 점이 있으신가요?</h2>
            <p className="text-blue-100 text-base mb-8 max-w-md mx-auto">
              선박 전문 상담사가 친절하게 안내해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${COMPANY.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-7 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                {COMPANY.phone}
              </a>
              <Link
                href="/test1/contact"
                className="inline-flex items-center justify-center gap-2 border border-blue-400 hover:bg-blue-500 text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                온라인 문의
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: test1 about/page.tsx 수정**

```tsx
// app/test1/about/page.tsx
import AboutClient from "./_components/AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 | 수연선박",
  description: "수연선박 - 선박 임대·판매 전문기업 소개",
};

export default function AboutPage() {
  return <AboutClient />;
}
```

- [ ] **Step 3: test2, test3 about 페이지도 동일 패턴으로 수정**

각 버전의 스타일에 맞게 조정하되 구조는 동일:
- 회사소개 콘텐츠
- /testN/work 바로가기 링크 (basePath 맞게)
- CTA 유지

- [ ] **Step 4: 커밋**

```bash
git add app/test1/about/ app/test2/about/ app/test3/about/
git commit -m "refactor: about 페이지를 회사소개 전용으로 정리

작업사진 갤러리를 /work 페이지로 이관.
회사소개 + 작업현장 바로가기 링크 + CTA."
```

---

## Task 10: 빌드 검증 및 최종 확인

**Files:** (수정 없음, 검증만)

- [ ] **Step 1: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공, 에러 없음.

- [ ] **Step 2: 주요 경로 접속 확인**

dev 서버에서 다음 경로들이 정상 동작하는지 확인:
- `/test1` — 홈, 추천 선박에 실제 사진 표시
- `/test1/vessels` — 실제 선박 8척 목록
- `/test1/vessels/suyeon-1` — 부위별 갤러리 동작
- `/test1/work` — 작업현장 갤러리, 필터 동작
- `/test1/about` — 회사소개 페이지
- test2, test3도 동일

- [ ] **Step 3: 최종 커밋 (필요 시)**

누락된 파일이 있으면 추가 커밋.

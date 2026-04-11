# 실제 선박 사진 통합 — 디자인 스펙

## 개요

외주작업 폴더의 실제 선박 사진(40+장)을 사이트에 통합한다.
가상 선박 데이터를 실제 선박으로 교체하고, 선박 상세 갤러리를 확장하며, 독립 작업현장 페이지를 신규 추가한다.

## 결정 사항

| 항목 | 결정 |
|------|------|
| 가상 데이터 | 전면 삭제, 실제 선박으로 교체 |
| 사진 파일 | 영문 리네임 후 `public/images/vessels/` 배치 |
| 데이터 구조 | 현재 A방식(선박 중심, vessel_images 통합). C방식(하이브리드 분리) 전환 가능하도록 설정 분리 |
| 선박 상세 | 부위별 갤러리 그리드 + 라이트박스 확장 |
| 신규 페이지 | `/testN/work` — 작업현장 전용 갤러리 |
| about 페이지 | 작업사진 → /work로 이관, 회사소개 전용으로 정리 |
| 네비게이션 | "작업현장" 메뉴 추가 |

## 1. 사진 파일 정리

### 파일명 리네임 규칙

```
{선박영문명}-{부위영문명}.jpg
```

### 선박명 매핑

| 원본 | 영문 폴더명 | 슬러그 |
|------|-------------|--------|
| 수연1호 | suyeon1 | suyeon-1 |
| 수연3호 | suyeon3 | suyeon-3 |
| 수연5호 | suyeon5 | suyeon-5 |
| 수연6호 | suyeon6 | suyeon-6 |
| 수연9호 | suyeon9 | suyeon-9 |
| 신성호 | sinseong | sinseong |
| 영진호 | youngjin | youngjin |
| 진양2호 | jinyang2 | jinyang-2 |

### 부위(카테고리) 매핑

| 원본 키워드 | 영문 카테고리 | 한글 라벨 |
|-------------|---------------|-----------|
| 외관, 우현, 해상 | exterior | 외관 |
| 조타실 | bridge | 조타실 |
| 기관실 | engine-room | 기관실 |
| 선실, 선원실 | cabin | 선실 |
| 주기관 | main-engine | 주기관 |
| 발전기 | generator | 발전기 |
| 상가 | dry-dock | 상가(정비) |
| 항해 | sailing | 항해 |
| 환경정화 | cleanup | 환경정화 |

### 디렉토리 구조

```
public/images/vessels/
├── suyeon1/
│   ├── exterior.jpg
│   ├── bridge.jpg
│   ├── main-engine.jpg
│   ├── generator.jpg
│   ├── generator-filter.jpg
│   └── ...
├── suyeon3/
│   └── exterior.jpg
├── suyeon5/
│   ├── exterior.jpg
│   ├── bridge.jpg
│   ├── cabin.jpg
│   ├── main-engine.jpg
│   └── dry-dock.jpg
├── suyeon6/
│   ├── exterior.jpg
│   ├── bridge.jpg
│   ├── cabin.jpg
│   ├── main-engine.jpg
│   └── cleanup.jpg
├── suyeon9/
│   └── exterior.jpg
├── sinseong/
│   ├── exterior.jpg
│   ├── bridge.jpg
│   ├── cabin.jpg
│   └── main-engine.jpg
├── youngjin/
│   ├── exterior.jpg
│   └── exterior-rear.jpg
└── jinyang2/
    ├── exterior.jpg
    ├── bridge.jpg (없으면 생략)
    ├── cabin.jpg
    ├── main-engine.jpg
    ├── dry-dock.jpg
    └── sailing.jpg
```

## 2. 데이터 구조

### 설정 파일 — `constants/photo-config.ts`

```ts
export type PhotoDataMode = "unified" | "split";

export const PHOTO_CONFIG = {
  /** unified = vessel_images에 통합, split = vessel_images + work-photos.json 분리 */
  dataMode: "unified" as PhotoDataMode,

  categories: {
    exterior: "외관",
    bridge: "조타실",
    "engine-room": "기관실",
    cabin: "선실",
    "main-engine": "주기관",
    generator: "발전기",
    "dry-dock": "상가(정비)",
    sailing: "항해",
    cleanup: "환경정화",
  },
} as const;
```

나중에 `dataMode: "split"`으로 변경하면 C방식(하이브리드)으로 전환 가능.

### vessels.json 개편

실제 선박 8척으로 교체. vessel_images에 category 필드 추가:

```json
{
  "id": "suyeon-1",
  "title": "수연1호",
  "slug": "suyeon-1",
  "vessel_images": [
    {
      "id": "suyeon1-exterior",
      "vessel_id": "suyeon-1",
      "url": "/images/vessels/suyeon1/exterior.jpg",
      "is_primary": true,
      "sort_order": 1,
      "category": "exterior"
    },
    {
      "id": "suyeon1-bridge",
      "vessel_id": "suyeon-1",
      "url": "/images/vessels/suyeon1/bridge.jpg",
      "is_primary": false,
      "sort_order": 2,
      "category": "bridge"
    }
  ]
}
```

### VesselImage 타입 확장 — `lib/supabase.ts`

```ts
export interface VesselImage {
  id: string;
  vessel_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  category?: string;       // 추가
  taken_date?: string;     // 추가 (촬영일, 파일명에서 추출)
}
```

### work-photos.json

현재는 빈 배열 유지. split 모드 전환 시 이 파일에 작업 사진 데이터를 넣음:

```json
[]
```

### lib/data.ts 확장

새 함수 추가:

| 함수 | 설명 |
|------|------|
| `getAllWorkPhotos()` | 모든 선박의 vessel_images를 합쳐서 반환 (unified 모드) 또는 work-photos.json에서 반환 (split 모드) |
| `getVesselPhotos(vesselId, category?)` | 특정 선박의 사진 목록 (카테고리 필터 옵션) |

## 3. 선박 상세 페이지 확장 — `vessels/[slug]`

### 변경 내용

현재: 대표 이미지 1장 + 썸네일 스트립

변경 후:
- 메인 이미지 영역 유지 (대표 이미지 = `is_primary: true`)
- 썸네일 스트립에 카테고리 라벨 표시
- 썸네일 클릭 시 메인 이미지 교체 (클라이언트 상태)
- 이미지 클릭 시 라이트박스 오픈 (기존 about 페이지 패턴 재사용)

### 구현 방식

- 갤러리 부분만 클라이언트 컴포넌트로 분리: `_components/VesselGallery.tsx`
- 나머지 제원/설명/사이드바는 서버 컴포넌트 유지
- 3개 버전(test1/test2/test3) 모두 동일한 갤러리 컴포넌트 공유 가능 → `components/vessels/VesselGallery.tsx`

## 4. 작업현장 페이지 — `/testN/work` (신규)

### 구조

```
app/testN/work/
├── page.tsx          # 서버 컴포넌트 — getAllWorkPhotos() 호출
└── _components/
    └── WorkGallery.tsx  # 클라이언트 — 필터 + 그리드 + 라이트박스
```

### 기능

- **카테고리 필터** — 전체 / 외관 / 조타실 / 기관실 / 선실 / 주기관 / 발전기 / 정비 / 항해
- **선박 필터** — 전체 / 수연1호 / 수연5호 / ...
- **사진 그리드** — 반응형 (모바일 2열, 태블릿 3열, 데스크탑 4열)
- **라이트박스** — 기존 about 페이지 패턴 재사용
- **각 사진 카드** — 이미지 + 선박명 + 카테고리 라벨 + 촬영일

### 히어로 영역

기존 about 페이지의 히어로 패턴 유지하되 문구 변경:
- 제목: "수연선박의 작업현장"
- 부제: "정비, 항해, 상가 작업 등 현장의 기록을 확인하세요"

## 5. about 페이지 변경

- 작업사진 갤러리 섹션 제거
- 회사소개 콘텐츠로 교체 (수연선박 소개, 주요 업무, 연혁 등)
- "/testN/work" 바로가기 링크/배너 추가
- CTA (전화문의 / 온라인문의) 유지

## 6. 네비게이션 변경

헤더 메뉴에 "작업현장" 추가:

```
홈 | 선박 목록 | 작업현장(신규) | 회사소개 | 문의하기
```

각 버전(test1/test2/test3)의 layout.tsx 또는 Header 컴포넌트에서 반영.

## 7. 적용 범위

3개 버전(test1/test2/test3) 모두 적용:
- 데이터(vessels.json, photo-config.ts)는 공유
- 갤러리 컴포넌트(VesselGallery.tsx)는 공유
- 작업현장 페이지 레이아웃은 각 버전 스타일에 맞게 개별 구현
- about 페이지 변경도 각 버전별 적용

## 미적용 (향후)

- Supabase Storage 업로드 (현재 로컬 개발 모드)
- 안전교육 동영상 통합 (mp4 파일 존재하나 이번 범위 외)
- 블로그 자료(hwpx) 연동

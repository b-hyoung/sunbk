# 관리자 선박 CRUD — 디자인 스펙

## 개요

관리자 대시보드(`/test1/admin`)에서 선박 추가/수정/삭제 + 사진 관리 기능 구현.
인메모리 방식: 서버 시작 시 JSON 로드, API로 CRUD, 재시작 시 초기화.
Supabase 연동은 이후 세션에서 진행.

## 결정 사항

| 항목 | 결정 |
|------|------|
| 데이터 저장 | 인메모리 (서버 재시작 시 원본 복귀) |
| 사진 처리 | URL.createObjectURL() 미리보기, 파일 저장 없음 |
| 페이지 위치 | `/test1/admin` 기준 구현 |
| 페이지 구조 | 서브 페이지 분리 (목록/등록/수정) |

## 1. API Routes

### 인메모리 스토어 — `lib/admin-store.ts`

서버 시작 시 `data/vessels.json` + `constants/vessels-data.ts` 오버라이드를 합쳐서 메모리에 로드.
이후 모든 CRUD는 이 메모리 배열을 조작.

```ts
// 서버 사이드 싱글톤
let vessels: Vessel[] = []; // 초기 로드 시 채워짐
```

### 엔드포인트

| 엔드포인트 | 메서드 | 기능 |
|-----------|--------|------|
| `/api/admin/vessels` | GET | 전체 선박 목록 |
| `/api/admin/vessels` | POST | 선박 등록 |
| `/api/admin/vessels/[id]` | GET | 선박 단건 조회 |
| `/api/admin/vessels/[id]` | PUT | 선박 수정 |
| `/api/admin/vessels/[id]` | DELETE | 선박 삭제 |

사진은 별도 API 없음. 클라이언트에서 `URL.createObjectURL()`로 미리보기 생성,
vessel_images 배열에 blob URL을 포함해서 POST/PUT으로 전송.

## 2. 관리자 페이지

### 라우트 구조

```
app/test1/admin/
├── page.tsx                     # 대시보드 (기존 유지)
├── vessels/
│   ├── page.tsx                 # 선박 목록 (테이블)
│   ├── new/
│   │   └── page.tsx             # 선박 등록 폼
│   └── [id]/
│       └── edit/
│           └── page.tsx         # 선박 수정 폼
```

### 선박 목록 (`/test1/admin/vessels`)

- 테이블 레이아웃: 대표이미지 썸네일, 선박명, 선종, 거래유형, 가격, 상태
- 각 행에 "수정" / "삭제" 버튼
- 삭제 시 confirm 다이얼로그
- 상단에 "선박 등록" 버튼 → `/test1/admin/vessels/new`

### 선박 등록/수정 폼

동일한 폼 컴포넌트를 공유. 수정 시 기존 데이터를 채워서 렌더.

#### 폼 필드

| 그룹 | 필드 | 타입 | 필수 |
|------|------|------|------|
| 기본정보 | 선박명 | text | O |
| | 슬러그 | text (선박명에서 자동 생성) | O |
| | 선종 | select (어선/화물선) | O |
| | 거래유형 | select (임대/판매/임대·판매) | O |
| 제원 | 건조연도 | number | |
| | 전장(m) | number | |
| | 톤수 | number | |
| | 엔진출력 | text | |
| | 승선정원 | number | |
| | 정박위치 | text | |
| 가격 | 임대가(원/일) | number | |
| | 판매가(원) | number | |
| 상세 | 설명 | textarea | |
| | 특징/옵션 | 태그 입력 (쉼표 구분) | |
| 상태 | 이용가능 | toggle | |
| | 추천 선박 | toggle | |
| | 상태 | select (active/inactive/sold) | |
| 사진 | 파일 업로드 | file (multiple) | |
| | 카테고리 선택 | select per image | |
| | 대표 이미지 지정 | radio | |
| | 삭제 | button per image | |

#### 사진 업로드 플로우

1. 파일 선택 (input type="file" multiple accept="image/*")
2. `URL.createObjectURL(file)`로 즉시 미리보기
3. 각 사진에 카테고리 드롭다운 (외관/조타실/기관실/선실/주기관/발전기)
4. 대표 이미지 라디오 선택
5. 삭제 버튼으로 제거
6. 폼 제출 시 blob URL을 vessel_images 배열에 포함
7. 실제 파일 저장 없음 — Supabase Storage 연동 시 구현

#### 슬러그 자동 생성 규칙

선박명 → 한글을 로마자로 변환하거나 ID 기반.
예: "수연1호" → "suyeon-1", "신성호" → "sinseong"
수정 시 슬러그 변경 불가 (읽기 전용).

## 3. 공유 컴포넌트

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| `VesselForm` | `components/admin/VesselForm.tsx` | 등록/수정 공유 폼 (클라이언트) |
| `VesselImageUpload` | `components/admin/VesselImageUpload.tsx` | 사진 업로드/미리보기/카테고리/삭제 |
| `AdminVesselTable` | `components/admin/AdminVesselTable.tsx` | 선박 목록 테이블 (클라이언트) |

## 4. 데이터 흐름

```
[등록 폼] → POST /api/admin/vessels → 인메모리 배열에 추가 → 목록에 반영
[수정 폼] → PUT /api/admin/vessels/[id] → 인메모리 배열 수정 → 상세에 반영
[삭제 버튼] → DELETE /api/admin/vessels/[id] → 인메모리 배열에서 제거
[사진 업로드] → 클라이언트 URL.createObjectURL() → vessel_images에 blob URL
[새로고침] → 인메모리 초기화 → vessels.json 원본으로 복귀
```

## 5. 프론트 페이지 연동

인메모리 스토어의 데이터가 프론트(선박 목록, 상세) 페이지에도 반영되어야 함.
`lib/data.ts`의 `localVessels()`가 인메모리 스토어를 참조하도록 수정.
→ 관리자에서 선박 추가하면 프론트 페이지에서도 바로 보임.

## 미적용 (이후)

- Supabase 연동 시: 인메모리 → DB 쓰기로 전환
- Supabase Storage: blob URL → 실제 업로드 URL로 전환
- 인증/권한: 현재 admin 페이지 인증 없음 (NextAuth 연동 시 추가)
- 예약 관리 CRUD

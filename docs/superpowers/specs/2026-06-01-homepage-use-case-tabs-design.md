# 홈페이지 — 용도별 추천 선박 (탭+캐러셀) 설계

**날짜**: 2026-06-01
**상태**: 설계 확정
**목표**: 홈페이지에서 "어떤 선박이 어떤 용도에 쓰이는지" 시각적으로 보여주기

## 배경

협력사 피드백: 고객은 선박 종류(통선/예항선 등)를 모르고 자기 일에 맞는 배가 뭔지 알고 싶어함. 이전(d2be6bc) 시도는 "3분류(survey/construction/cargo) 동시 3행 노출" 방식이었으나 폐기됨. 새 방향은 **탭 전환 방식 + 2분류**.

"용도"는 측량/공사 2개로 한정한다. "판매"는 모든 선박이 가능하므로 용도 축이 아닌 카드 배지로 표현.

## 설계 변경 범위

### 그대로 (변경 없음)
- `app/page.tsx` Hero 섹션 (영상 + "최적의 선박을 합리적인 가격으로" + 전화/둘러보기 CTA)
- `components/layout/HeroVideo.tsx`
- 헤더, 푸터, 기타 페이지

### 삭제
- `app/page.tsx`의 통계 섹션 (10척/인천/365일) — 실데이터 변경 시 갱신 부담, 정보가치 낮음
- `app/page.tsx`의 "선박 종류" 섹션 (어선/화물선 2개 카드) — 실제 보유 5종(통선/예항선/작업선/도선/화물선)과 불일치, 사실상 stale

### 신규 — "용도별 추천 선박" 섹션

Hero 아래 바로 배치. 다음 구조:

#### 섹션 헤더
- Eyebrow (작은 라벨): `우리가 잘하는 일`
- Title (h2): `용도별 추천 선박`
- 우측 링크: `전체 선박 보기 →` (→ `/vessels`)

#### 탭 바 (2개)
- 🛰️ `해상측량` — 척수 뱃지 8
- 🚧 `해상공사` — 척수 뱃지 9
- 기본 활성 탭: `해상측량`
- 탭 전환은 클라이언트 사이드 state (URL 동기화 안 함, 홈에서만 사용)

#### Context 스트립 (탭별 다름)
배경 옅은 회색, 한 줄 텍스트, 좌측 아이콘.

| 탭 | 스트립 카피 |
|---|---|
| 해상측량 | "지오스토리·올포랜드·UST 21 등 측량업체 다수 임대" |
| 해상공사 | "현대스틸·유호건설·대양건설 등 건설사 임대 실적" |

#### 선박 카드 그리드
- 데스크탑: 4열 그리드, 4척 노출 (탭당 매칭 선박 중 `is_featured` 우선 → 그 외 → 최대 4척)
- 모바일: 가로 스크롤 (`overflow-x-auto`), 카드 폭 고정
- 카드 구조:
  - 상단: 4:3 이미지 (primary 사진), 우상단 `판매 가능` 작은 배지 (type=both|sale일 때)
  - 본문: 카테고리(작은 파란색, e.g. `통선·FRP`) → 선명 → `톤수 · 길이 · 인원`
  - 카드 전체 클릭 → `/vessels/{slug}`

#### 섹션 하단
- 중앙 정렬 보조 링크: `이 용도의 선박 모두 보기 →` (→ `/vessels?use=<active-tab>`)

## 컴포넌트 분리

### 신규
- `app/_components/UseCaseTabs.tsx` (client) — 탭 바 + 탭 state + Context 스트립 + 카드 그리드 렌더링. Props: `groups: { useCase: UseCase; vessels: Vessel[] }[]`.
- `app/_components/UseCaseVesselCard.tsx` — 그리드용 카드 (기존 `VesselCard`는 vessels 목록 페이지용이라 분리). 판매 가능 배지 포함.

### 신규 라이브러리
- `lib/vessel-types.ts`:
  - `UseCase` re-export (`'survey' | 'construction'`)
  - `USE_CASES: Record<UseCase, { label: string; icon: string; context: string }>`
  - `getVesselCategory(vessel)` — `vessel_type`을 5종 UI 카테고리(통선/예항선/작업선/도선/화물선)로 매핑하는 헬퍼 (카드에서 사용)

### 기존 수정
- `lib/supabase.ts` — `UseCase` 타입 export, `Vessel`에 `use_cases: UseCase[]` 필드 추가
- `lib/data.ts` — `getVesselsByUseCase(useCase: UseCase, limit: number): Promise<Vessel[]>` 함수 추가
- `app/page.tsx` — 통계/카테고리 섹션 제거, `UseCaseTabs` 섹션 추가
- `constants/vessels-data.ts` — 10척 전부 `use_cases` 필드 추가, `영진호` type을 `"sale"` → `"both"`로
- `data/vessels.json` — 위와 동기

## 용도 태깅 (10척)

| ID | 선명 | survey | construction | 근거 |
|---|---|---|---|---|
| suyeon-1 | 수연1호 | | ● | 예항력 15.55t, 현대스틸·대양건설 실적 |
| suyeon-3 | 수연3호 | ● | ● | 한글카드 비고 "해상공사 통선, 측량선" |
| suyeon-5 | 수연5호 | | ● | 현대스틸·삼원개발 실적 |
| suyeon-6 | 수연6호 | ● | ● | UST 21, 지오뷰 측량작업 |
| suyeon-8 | 수연8호 | ● | ● | 한글카드 비고 |
| suyeon-9 | 수연9호 | ● | ● | 한글카드 비고 |
| sinseong | 신성호 | ● | ● | 올포랜드, 지오스토리 |
| youngjin | 영진호 | ● | | 지오스토리 3회 임대 (전용) |
| jinyang-2 | 진양2호 | ● | ● | 지오스토리, 유호건설 |
| incheon-9 | 인천 9호 | ● | ● | 한글카드 비고 |

탭별 합계:
- 해상측량: 8척 (3,6,8,9, 신성호, 영진호, 진양2, 인천9)
- 해상공사: 9척 (1,3,5,6,8,9, 신성호, 진양2, 인천9)

## 데이터 흐름

```
app/page.tsx (Server Component)
  └─ Promise.all([
       getVesselsByUseCase('survey', 4),
       getVesselsByUseCase('construction', 4)
     ])
  └─ <UseCaseTabs groups={[
       { useCase: 'survey', vessels: [...] },
       { useCase: 'construction', vessels: [...] }
     ]} />
        └─ tab state → UseCaseVesselCard × 4
```

`getVesselsByUseCase` 정렬: `is_featured` 우선 → `type === 'rent'/'both'` 우선 → 나머지.

## 판매 가능 배지

- 위치: 카드 이미지 우상단
- 스타일: `bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm bg-opacity-90`
- 표시 조건: `vessel.type === 'sale' || vessel.type === 'both'`
- 현재 데이터 기준 10척 중 9척에 표시됨 (영진호도 both로 변경 후 10척 전부)

## 에러/엣지 케이스

- 탭 선택했는데 선박 0척: 그리드 자리에 중앙 정렬 안내 메시지 `"이 용도의 선박을 추가 중입니다."` (Ship 아이콘 + 회색 텍스트)
- 사진 없는 선박 (현재 없음, 향후 신규 추가 대비): `vessel_images` 빈 배열일 때 placeholder (회색 배경 + Ship 아이콘)
- 데이터 로딩 실패: Next.js 기본 에러 바운더리 (현재 다른 서버 컴포넌트와 동일하게)

## 비목표 (out of scope)

- URL `?use=...` 파라미터로 탭 상태 동기화 (홈에서만 쓰는 일회성 UI, 깊은 링크 필요성 낮음)
- 자동 캐러셀 (회전), 슬라이드 애니메이션 — YAGNI, 탭 클릭만으로 충분
- 모바일 스와이프 제스처
- 화물·판매 탭 (사용자 결정: 판매는 모든 선박 공통이므로 용도 축에서 제외)
- 진양2호 비고의 소유주 변경 이력, 선원공제 만료일 같은 메타데이터 노출

## 테스트

- 수동: 데스크탑/모바일에서 홈 접속, 탭 전환 시 카드 교체 확인
- 수동: 카드 클릭 → 정확한 `/vessels/{slug}`로 이동
- 수동: 영진호는 해상측량 탭에만 보이고 해상공사 탭에는 안 보임 (단일 use_case 케이스 검증)
- `tsc --noEmit` 무에러
- 기존 `/vessels` 페이지 영향 없음 (use_cases 필드 추가만 했고 readVessels 무관)

## 향후 확장 (이 spec 범위 밖)

- 비고 기반 자동 태깅 (현재는 수동 태깅, 추후 admin UI에서 편집 가능하게)
- 탭 추가 ('환경정화', '예인' 등) — 데이터 충분히 쌓이면
- `/vessels?use=...` 필터 페이지 추가 (전체 보기 링크 대상)

# 수연선박 프로젝트 참고 문서

## 프로젝트 개요

선박 임대·판매 사이트. 동일한 데이터를 공유하면서 디자인이 다른 여러 버전(test1/test2/test3)을 병렬로 개발·비교하는 구조.

---

## 폴더 구조

```
sunbk/
├── app/
│   ├── test1/                  # 디자인 버전 1
│   │   ├── layout.tsx          # 버전별 Header/Footer 레이아웃
│   │   ├── page.tsx            # 홈
│   │   ├── vessels/
│   │   │   ├── page.tsx        # 선박 목록
│   │   │   └── [slug]/page.tsx # 선박 상세
│   │   ├── booking/
│   │   │   ├── [vesselId]/page.tsx  # 예약/문의 폼
│   │   │   └── confirm/page.tsx     # 접수 완료
│   │   └── admin/page.tsx      # 관리자 대시보드
│   │
│   ├── test2/                  # 디자인 버전 2 (동일 구조 복사)
│   ├── test3/                  # 디자인 버전 3 (동일 구조 복사)
│   │
│   └── api/
│       └── bookings/route.ts   # POST /api/bookings
│
├── components/
│   ├── vessels/                # 공유 선박 컴포넌트
│   │   ├── VesselCard.tsx      # basePath prop 필수
│   │   ├── VesselFilter.tsx    # basePath prop 필수
│   │   ├── BookingButton.tsx   # basePath prop 필수
│   │   └── BookingForm.tsx
│   └── layout/                 # 레이아웃 공통 컴포넌트
│
├── lib/
│   ├── data.ts                 # 데이터 접근 레이어 (핵심)
│   └── supabase.ts             # Supabase 클라이언트 & 타입 정의
│
└── data/
    ├── vessels.json            # 목 선박 데이터 (6척)
    └── bookings.json           # 목 예약 데이터 (5건)
```

---

## 데이터 소스 전환 (local ↔ Supabase)

`.env.local`의 `DATA_SOURCE` 값으로 제어.

```env
# 개발 — JSON 파일 사용
DATA_SOURCE=local

# 운영 — Supabase 사용
DATA_SOURCE=supabase
```

`lib/data.ts`가 이 값을 읽어 자동으로 분기.  
페이지나 컴포넌트는 데이터 소스를 신경 쓸 필요 없음.

### data.ts 제공 함수

| 함수 | 설명 |
|------|------|
| `getFeaturedVessels()` | 추천 선박 최대 6척 |
| `getVessels(searchParams)` | 필터링된 선박 목록 |
| `getVesselBySlug(slug)` | slug로 선박 단건 조회 |
| `getVesselById(id)` | id로 선박 단건 조회 |
| `getAdminStats()` | 관리자 통계 (선박수, 예약수, 대기수) |
| `getRecentBookings()` | 최근 예약 10건 |
| `createBooking(input)` | 예약 생성 (local 모드에선 저장 없이 성공 반환) |

---

## 새 디자인 버전 추가 방법 (예: test2)

### 1. 폴더 복사

`app/test1/` 전체를 `app/test2/`로 복사.

### 2. basePath 변경

test2 내 모든 파일에서 `basePath="test1"` → `basePath="test2"` 로 변경.

**변경 대상 파일:**
- `app/test2/page.tsx` — VesselCard의 basePath, vesselCategories href
- `app/test2/vessels/page.tsx` — VesselCard, VesselFilter의 basePath
- `app/test2/vessels/[slug]/page.tsx` — BookingButton의 basePath, 브레드크럼 href
- `app/test2/booking/[vesselId]/page.tsx` — 브레드크럼 href

### 3. 디자인 변경

`app/test2/layout.tsx`에서 다른 Header/Footer 적용.  
각 page.tsx의 JSX와 Tailwind 클래스만 수정하면 됨.  
데이터 호출(`lib/data.ts`)은 그대로 재사용.

---

## 공유 컴포넌트 사용 규칙

`components/vessels/` 하위 컴포넌트는 **반드시 `basePath` prop을 받아야** 올바른 라우팅이 동작함.

```tsx
// vessels/page.tsx
<VesselCard vessel={vessel} basePath="test1" />
<VesselFilter basePath="test1" currentType={params.type} />

// vessels/[slug]/page.tsx
<BookingButton vessel={vessel} basePath="test1" />
```

basePath를 빠뜨리면 TypeScript 오류 발생.

---

## 환경변수 목록

| 변수 | 용도 | 필수 |
|------|------|------|
| `DATA_SOURCE` | `local` 또는 `supabase` | 개발 필수 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 운영 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | 운영 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서버 전용 key (노출 금지) | 운영 필수 |
| `NEXTAUTH_URL` | NextAuth 콜백 URL | 인증 사용 시 |
| `NEXTAUTH_SECRET` | 세션 서명 키 (`openssl rand -base64 32`) | 인증 사용 시 |
| `NEXT_PUBLIC_SITE_URL` | sitemap/robots 기준 URL | 선택 |
| `NEXT_PUBLIC_API_BASE_URL` | 외부 API 서버 주소 | 선택 |
| `RESEND_API_KEY` | 이메일 알림 (TODO) | 선택 |

---

## Supabase 테이블 구조

### vessels
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| title | text | 선박명 |
| slug | text | URL용 고유 식별자 |
| type | enum | `rent` / `sale` / `both` |
| vessel_type | text | 레저선, 어선, 화물선, 여객선 등 |
| year_built | int | 건조 연도 |
| length_m | float | 전장(m) |
| tonnage | float | 톤수 |
| engine_power | text | 엔진 출력 |
| capacity | int | 승선 정원 |
| location | text | 정박 위치 |
| description | text | 선박 설명 |
| features | text[] | 특징/옵션 목록 |
| rent_price_per_day | int | 임대가(원/일) |
| sale_price | int | 판매가(원) |
| is_available | bool | 이용 가능 여부 |
| is_featured | bool | 추천 선박 여부 |
| status | enum | `active` / `inactive` / `sold` |

### bookings
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| vessel_id | uuid | FK → vessels.id |
| booking_type | enum | `rent` / `inquiry` |
| customer_name | text | 고객명 |
| customer_phone | text | 연락처 |
| customer_email | text | 이메일 (선택) |
| start_date | date | 임대 시작일 |
| end_date | date | 임대 종료일 |
| total_price | int | 총 금액 |
| status | enum | `pending` / `confirmed` / `cancelled` / `completed` |
| message | text | 고객 메시지 |
| admin_memo | text | 관리자 메모 |

---

## 개발 시작

```bash
npm run dev
# http://localhost:3000/test1 접속
```

# 수연선박 프로젝트 참고 문서

## 프로젝트 개요

선박 임대·판매 사이트. 로컬 JSON(`data/*.json`) 또는 Supabase에서 데이터를 읽어 동일한 UI로 렌더링.

---

## 폴더 구조

```
sunbk/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Header/Footer 포함)
│   ├── page.tsx                # 홈
│   ├── _components/            # 페이지 전용 컴포넌트
│   │   ├── VesselCard.tsx
│   │   ├── VesselFilter.tsx
│   │   ├── BookingButton.tsx
│   │   └── BookingForm.tsx
│   ├── vessels/
│   │   ├── page.tsx            # 선박 목록
│   │   └── [slug]/page.tsx     # 선박 상세
│   ├── booking/
│   │   ├── [vesselId]/page.tsx # 예약/문의 폼
│   │   └── confirm/page.tsx    # 접수 완료
│   ├── about/page.tsx          # 회사소개
│   ├── contact/page.tsx        # 오시는길
│   ├── work/page.tsx           # 작업현장
│   ├── admin/                  # 관리자 대시보드
│   │   ├── page.tsx
│   │   └── vessels/            # 선박 CRUD
│   └── api/                    # 서버 라우트 (admin, bookings)
│
├── components/
│   ├── layout/                 # Header, Footer, HeroVideo, ScrollAnimations
│   ├── vessels/VesselGallery.tsx
│   ├── admin/                  # AdminCharts, AdminVesselTable, VesselForm, VesselImageUpload
│   ├── work/
│   └── ui/
│
├── constants/                  # company, enums, photo-config, vessels-data
├── lib/
│   ├── data.ts                 # 데이터 접근 레이어 (핵심)
│   └── supabase.ts             # Supabase 클라이언트 & 타입 정의
│
└── data/
    ├── vessels.json
    ├── bookings.json
    └── work-photos.json
```

---

## 데이터 소스 전환 (local ↔ Supabase)

`.env.local`의 `DATA_SOURCE` 값으로 제어.

```env
DATA_SOURCE=local       # JSON 파일
DATA_SOURCE=supabase    # Supabase
```

`lib/data.ts`가 이 값을 읽어 분기. 페이지/컴포넌트는 데이터 소스를 신경 쓸 필요 없음.

### data.ts 주요 함수

| 함수 | 설명 |
|------|------|
| `getFeaturedVessels()` | 추천 선박 최대 6척 |
| `getVessels(searchParams)` | 필터링된 선박 목록 |
| `getVesselBySlug(slug)` | slug로 선박 단건 조회 |
| `getVesselById(id)` | id로 선박 단건 조회 |
| `getVesselPhotos(vesselId)` | 선박 사진 목록 |
| `getAdminStats()` | 관리자 통계 (선박수, 예약수, 대기수) |
| `getRecentBookings()` | 최근 예약 10건 |
| `createBooking(input)` | 예약 생성 (local 모드에선 저장 없이 성공 반환) |

---

## 환경변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `DATA_SOURCE` | `local` 또는 `supabase` | 개발 필수 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 운영 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | 운영 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 key (노출 금지) | 운영 필수 |
| `NEXTAUTH_URL` | NextAuth 콜백 URL | 인증 사용 시 |
| `NEXTAUTH_SECRET` | 세션 서명 키 (`openssl rand -base64 32`) | 인증 사용 시 |
| `NEXT_PUBLIC_SITE_URL` | sitemap/robots 기준 URL | 선택 |
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
| vessel_type | text | 어선, 화물선 등 |
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
# http://localhost:3000
```

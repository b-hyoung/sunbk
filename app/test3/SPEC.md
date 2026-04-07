# test3 기능 명세

test1을 참고하되, 레이아웃과 디자인은 완전히 다르게 구성.
데이터는 `lib/data.ts` 공유, 네비게이션은 `getNavLinks("test3")` 사용.

---

## 필수 페이지 목록

### 1. 홈 (`/test3`)
- 히어로 섹션 (핵심 CTA 포함)
- 추천 선박 목록 → `getFeaturedVessels()` 사용
- 선박 카테고리 진입점 (레저선/어선/화물선/여객선)
- 회사 통계 또는 신뢰 지표

### 2. 선박 목록 (`/test3/vessels`)
- 필터: 거래 유형(전체/임대/판매), 선박 종류
- 선박 카드 그리드 → `getVessels(searchParams)` 사용
- 빈 결과 상태 처리

### 3. 선박 상세 (`/test3/vessels/[slug]`)
- 선박 이미지 (대표 + 썸네일)
- 선박 제원 테이블 (전장/톤수/엔진/정원/위치 등)
- 특징/옵션 목록
- 가격 (임대가/판매가)
- 예약·문의 버튼 → `/test3/booking/[vesselId]`로 이동

### 4. 예약/문의 폼 (`/test3/booking/[vesselId]`)
- 고객 정보 입력 (이름, 연락처, 이메일)
- 임대 기간 선택 (임대 타입일 때만)
- 예상 금액 자동 계산
- 문의 내용 입력
- 제출 → `POST /api/bookings`

### 5. 접수 완료 (`/test3/booking/confirm`)
- 접수 완료 메시지
- 전화 문의 CTA
- 홈 또는 목록으로 복귀

### 6. 관리자 대시보드 (`/test3/admin`)
- 통계 카드 (등록 선박 수, 전체 예약, 처리 대기)
- 최근 예약/문의 목록
- 선박 관리·예약 관리 링크

---

## 공유 데이터 함수 (lib/data.ts)

| 함수 | 사용 페이지 |
|------|------------|
| `getFeaturedVessels()` | 홈 |
| `getVessels(searchParams)` | 선박 목록 |
| `getVesselBySlug(slug)` | 선박 상세 |
| `getVesselById(id)` | 예약 폼 |
| `getAdminStats()` | 관리자 |
| `getRecentBookings()` | 관리자 |

---

## 라우팅 규칙

- basePath = `"test3"` 고정
- 레이아웃에서 `<Header basePath="test3" />`, `<Footer basePath="test3" />`
- 컴포넌트 내부 링크는 `/test3/...` prefix 사용
- BookingForm confirm → `/test3/booking/confirm`

---

## 컴포넌트 구성

```
app/test3/
  _components/         ← test3 전용 (디자인 완전 자유)
    VesselCard.tsx
    VesselFilter.tsx
    BookingButton.tsx
    BookingForm.tsx
  layout.tsx
  page.tsx
  vessels/
    page.tsx
    [slug]/page.tsx
  booking/
    [vesselId]/page.tsx
    confirm/page.tsx
  admin/
    page.tsx
```

---

## 디자인 방향 (미정 — 작업 전 결정)

- [ ] 레이아웃 콘셉트 (예: 풀스크린 스크롤 / 매거진형 / 미니멀 테이블형 등)
- [ ] 선박 카드 형태 (가로형 / 세로형 / 리스트형)
- [ ] 필터 위치 (상단 탭 / 사이드 드로어 / 인라인)
- [ ] 컬러 팔레트

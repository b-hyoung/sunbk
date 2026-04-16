# 제일산업공사(조선소) 통합 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- []`) syntax for tracking.

**Goal:** 수연선박 사이트에 제일산업공사(건조·수리) 서비스 페이지 `/shipyard`를 추가하고, 헤더 네비를 서비스 중심으로 재편한다.

**Architecture:** 2사 운영 주체를 한 사이트에 담되, 사용자는 서비스 기준으로 탐색하고 각 서비스 페이지 Hero에 제공 법인 뱃지를 작게 명시한다(B안). 연락처·주소는 공유(`constants/company.ts`).

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind · lucide-react. 테스트 프레임워크 부재이므로 검증은 `npm run build` + 라우트 smoke test로 대체.

**Spec:** `docs/superpowers/specs/2026-04-16-shipyard-integration-design.md`

---

## 파일 구조

**신규**
- `app/shipyard/page.tsx` — 메인 페이지 (server component, metadata 포함)
- `app/shipyard/_components/ServiceCards.tsx` — 4개 서비스 카드 그리드 (server)
- `app/shipyard/_components/RepairGallery.tsx` — Before/After 페어 갤러리 + 카테고리 필터 (client — useState)

**수정**
- `constants/enums.ts` — `Routes.SHIPYARD` 추가, `getNavLinks()` 재구성

---

### Task 1: 라우트·네비 뼈대

**Files:**
- Modify: `constants/enums.ts`

- [ ] **Step 1: `Routes` enum에 SHIPYARD 추가**

`constants/enums.ts:4-16` 영역의 enum 맨 끝에 `SHIPYARD`를 추가한다. 기존 enum 값은 그대로.

```ts
export enum Routes {
    ROOT = "/",
    MENU = "menu",
    ABOUT = "about",
    WORK = "work",
    CONTACT = "contact",
    AUTH = "auth",

    PROFILE = "profile",
    ADMIN = "admin",

    // 선박
    VESSELS = "vessels",
    BOOKING = "booking",
    SHIPYARD = "shipyard",
}
```

- [ ] **Step 2: `getNavLinks()`를 5개 메뉴로 재구성**

`constants/enums.ts`의 `getNavLinks()` 함수를 아래로 교체. "선박 목록"과 필터링된 "선박 임대/판매"는 제거하고, 하나의 "선박 임대·판매"(필터 없음)와 신규 "선박 건조·수리"로 단순화.

```ts
// 네비게이션 링크 정의
export function getNavLinks() {
  return [
    { href: `/${Routes.VESSELS}`,   label: "선박 임대·판매" },
    { href: `/${Routes.SHIPYARD}`,  label: "선박 건조·수리" },
    { href: `/${Routes.WORK}`,      label: "작업현장" },
    { href: `/${Routes.ABOUT}`,     label: "회사소개" },
    { href: `/${Routes.CONTACT}`,   label: "오시는길" },
  ];
}
```

- [ ] **Step 3: 빌드로 타입·임포트 확인**

Run: `npm run build`
Expected: `Route (app)` 목록에 기존 라우트가 모두 표시되고 타입 에러 없음. `/shipyard`는 아직 없어서 목록에 없어도 정상. ESLint·TS 에러 없어야 함.

- [ ] **Step 4: Dev 서버에서 헤더 노출 smoke test**

Run: 기존 dev 서버(background)가 돌고 있다면 HMR로 반영됨. 없으면 `npm run dev`. 그리고:

```bash
curl -s http://localhost:3000/ | grep -E "선박 임대·판매|선박 건조·수리|작업현장"
```
Expected: 세 문자열 모두 HTML에 포함됨 (Header 서버 렌더 결과).

- [ ] **Step 5: 커밋**

```bash
git add constants/enums.ts
git commit -m "feat: 헤더 네비 재구성 — 선박 임대·판매 통합 + 선박 건조·수리 추가"
```

---

### Task 2: `/shipyard` 페이지 스켈레톤 + Hero

**Files:**
- Create: `app/shipyard/page.tsx`

- [ ] **Step 1: 최소 페이지 파일 생성**

`app/shipyard/page.tsx`를 아래 내용으로 생성. Hero 섹션 + 서브타이틀 인라인 뱃지 + 전화 CTA만. 서비스/갤러리 섹션은 이후 Task에서 주입.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Anchor } from "lucide-react";
import { COMPANY } from "@/constants/company";

export const metadata: Metadata = {
  title: "선박 건조·수리",
  description: "선체·FRP 수리, 도장, 기관 정비, 신조 건조. 제일산업공사에서 제공하는 선박 건조·수리 전문 서비스.",
};

export default function ShipyardPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="border-b border-gray-100 bg-gray-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Anchor className="w-4 h-4" />
            <span>선박 건조·수리 <span className="text-gray-300">·</span> 제일산업공사</span>
          </div>
          <h1 className="text-gray-900 mb-4">선박을 짓고, 고치고, 지킵니다</h1>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            신조 건조부터 선체·FRP 수리, 도장, 기관 정비까지.
            현장에서 축적한 기술로 귀하의 선박을 책임집니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              오시는길
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: 빌드·라우트 smoke**

Run:
```bash
npm run build
```
Expected: 빌드 목록에 `├ ○ /shipyard` 표시 (정적 라우트).

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/shipyard
```
Expected: `200`

- [ ] **Step 3: 커밋**

```bash
git add app/shipyard/page.tsx
git commit -m "feat(shipyard): 제일산업공사 Hero 스켈레톤"
```

---

### Task 3: 서비스 카드 4종

**Files:**
- Create: `app/shipyard/_components/ServiceCards.tsx`
- Modify: `app/shipyard/page.tsx`

- [ ] **Step 1: 서비스 카드 컴포넌트 작성**

`app/shipyard/_components/ServiceCards.tsx`:

```tsx
import { Hammer, Wrench, PaintBucket, Cog } from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "신조 건조",
    desc: "신규 선박 설계·제작. 어선, 작업선, 레저선 등 용도별 맞춤 건조.",
  },
  {
    icon: Wrench,
    title: "선체·FRP 수리",
    desc: "파손부 복원, FRP 보강, 강판 교체. 침수·충돌 손상 전문.",
  },
  {
    icon: PaintBucket,
    title: "도장·방오 작업",
    desc: "선체 도장, 방오도료 시공, 부식 방지. 정기 도장 주기 관리.",
  },
  {
    icon: Cog,
    title: "기관·설비 정비",
    desc: "엔진, 조타, 전기설비 점검·수리. 긴급 출동 대응 가능.",
  },
];

export default function ServiceCards() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="text-gray-900 mb-2">서비스</h2>
      <p className="text-sm text-gray-400 mb-10">건조부터 수리까지, 한 곳에서 해결합니다</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 페이지에 주입**

`app/shipyard/page.tsx`에서 import 추가 + Hero 섹션 바로 아래 `<ServiceCards />` 렌더. 변경 사항:

파일 상단 import 추가:
```tsx
import ServiceCards from "./_components/ServiceCards";
```

Hero의 `</section>` 바로 다음, `</div>` 바로 앞에 삽입:
```tsx
      <ServiceCards />
```

- [ ] **Step 3: 빌드·렌더 smoke**

Run: `npm run build`
Expected: 에러 없음. `/shipyard` 번들 사이즈 증가.

Run:
```bash
curl -s http://localhost:3000/shipyard | grep -E "신조 건조|선체·FRP 수리|도장·방오|기관·설비"
```
Expected: 4개 서비스 타이틀 모두 HTML에 포함.

- [ ] **Step 4: 커밋**

```bash
git add app/shipyard/_components/ServiceCards.tsx app/shipyard/page.tsx
git commit -m "feat(shipyard): 서비스 카드 4종 (신조·수리·도장·기관)"
```

---

### Task 4: Before/After 갤러리 (플레이스홀더) + 카테고리 필터

**Files:**
- Create: `app/shipyard/_components/RepairGallery.tsx`
- Modify: `app/shipyard/page.tsx`

- [ ] **Step 1: 갤러리 컴포넌트 작성**

`app/shipyard/_components/RepairGallery.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";

type Category = "all" | "build" | "hull" | "paint" | "engine";

const categoryLabel: Record<Category, string> = {
  all: "전체",
  build: "신조",
  hull: "수리",
  paint: "도장",
  engine: "기관",
};

interface RepairCase {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  desc: string;
}

const cases: RepairCase[] = [
  { id: "case-1", category: "hull", title: "FRP 선체 파손 복원", desc: "측면 충돌로 뚫린 선체 FRP 보강 후 도장 마감" },
  { id: "case-2", category: "paint", title: "선체 도장 재시공", desc: "방오도료 재도포 + 상부 색상 정비" },
  { id: "case-3", category: "engine", title: "메인 엔진 정비", desc: "실린더 헤드 오버홀, 냉각 계통 점검" },
  { id: "case-4", category: "build", title: "신조 작업선 건조", desc: "15m급 작업선 신규 제작 (설계~인도)" },
  { id: "case-5", category: "hull", title: "강판 용접 보수", desc: "선저 강판 부식부 절삭 후 신강판 용접" },
  { id: "case-6", category: "paint", title: "데크 논슬립 코팅", desc: "갑판 미끄럼 방지 에폭시 코팅 시공" },
];

const categories: Category[] = ["all", "build", "hull", "paint", "engine"];

export default function RepairGallery() {
  const [active, setActive] = useState<Category>("all");

  const filtered = useMemo(
    () => (active === "all" ? cases : cases.filter((c) => c.category === active)),
    [active]
  );

  return (
    <section className="bg-gray-50/60 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-gray-900 mb-2">작업 사례</h2>
        <p className="text-sm text-gray-400 mb-6">Before · After 비교로 보는 실제 작업</p>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                active === c
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {categoryLabel[c]}
            </button>
          ))}
        </div>

        {/* 페어 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <Placeholder label="Before" />
                <Placeholder label="After" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {categoryLabel[c.category]}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">해당 카테고리 작업 사례가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300">
      <ImageIcon className="w-8 h-8" />
      <span className="text-xs font-medium tracking-wide">{label}</span>
      <span className="text-[10px] text-gray-300">사진 준비 중</span>
    </div>
  );
}
```

- [ ] **Step 2: 페이지에 주입**

`app/shipyard/page.tsx` import에 추가:
```tsx
import RepairGallery from "./_components/RepairGallery";
```

`<ServiceCards />` 바로 아래에 삽입:
```tsx
      <RepairGallery />
```

- [ ] **Step 3: 빌드 smoke**

Run: `npm run build`
Expected: 에러 없음. `/shipyard` 번들에 클라이언트 컴포넌트 청크 증가.

Run:
```bash
curl -s http://localhost:3000/shipyard | grep -E "작업 사례|Before|After|사진 준비 중"
```
Expected: 모든 문자열 HTML에 포함 (서버 렌더 시 초기 상태 "all"로 전체 6개 페어 노출).

- [ ] **Step 4: 커밋**

```bash
git add app/shipyard/_components/RepairGallery.tsx app/shipyard/page.tsx
git commit -m "feat(shipyard): Before/After 갤러리 + 카테고리 필터 (플레이스홀더)"
```

---

### Task 5: 하단 상담 CTA 섹션

**Files:**
- Modify: `app/shipyard/page.tsx`

- [ ] **Step 1: 페이지 하단 CTA 섹션 추가**

`app/shipyard/page.tsx`의 `<RepairGallery />` 바로 다음, 최외곽 `</div>` 바로 앞에 삽입:

```tsx
      {/* ── 상담 CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-gray-900 mb-3">상담 문의</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          선박 상태, 작업 범위, 일정은 전화로 상담하시는 것이 가장 빠릅니다.
          현장 방문 실사도 가능합니다.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            {COMPANY.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            오시는길 보기
          </Link>
        </div>
      </section>
```

(참고: `COMPANY`, `Phone`, `Link`는 Task 2에서 이미 import 됨.)

- [ ] **Step 2: 빌드·렌더 smoke**

Run: `npm run build`
Expected: 에러 없음.

Run:
```bash
curl -s http://localhost:3000/shipyard | grep -E "상담 문의|오시는길 보기"
```
Expected: 두 문자열 포함.

- [ ] **Step 3: 커밋**

```bash
git add app/shipyard/page.tsx
git commit -m "feat(shipyard): 하단 상담 CTA 섹션"
```

---

### Task 6: 통합 검증 + 코드리뷰

**Files:** (검증 전용, 파일 수정 없음 — 발견된 이슈만 후속 커밋)

- [ ] **Step 1: 전체 라우트 smoke**

Run:
```bash
for path in / /vessels /shipyard /work /about /contact /admin; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  echo "$code  $path"
done
```
Expected: 모두 `200`.

- [ ] **Step 2: 헤더 active 상태 확인**

`/shipyard`에 접속 시 헤더의 "선박 건조·수리"가 활성(파란 굵은 글씨) 상태인지 수동 확인. 기존 `components/layout/Header.tsx`의 active 판정 로직:
```ts
const isActive = currentUrl === link.href || currentUrl.startsWith(link.href + "&");
```
`/shipyard` 경로에선 정확히 매치되므로 정상 동작해야 함. 브라우저에서 확인.

- [ ] **Step 3: 모바일 반응형 확인**

DevTools iPhone 모드로 `/shipyard` 접속 후:
- Hero: 제목·CTA 버튼 줄바꿈 정상
- 서비스 카드: 1열로 쌓임
- 갤러리: 페어 카드가 세로로, 각 카드 안 Before/After는 2열 유지
- 필터 버튼: 줄바꿈 됨, 터치 타겟 충분

- [ ] **Step 4: code-reviewer 에이전트 리뷰 요청**

`superpowers:code-reviewer` 에이전트로 이번 feature 커밋 전체를 리뷰. 프롬프트에 포함할 컨텍스트:
- 스펙 문서 경로: `docs/superpowers/specs/2026-04-16-shipyard-integration-design.md`
- 변경 파일 목록: `constants/enums.ts`, `app/shipyard/page.tsx`, `app/shipyard/_components/*.tsx`
- 확인 요청 사항: impeccable 디자인 원칙 준수 여부, 모바일 터치 타겟, 미사용 import, a11y(aria-current, 의미있는 heading 계층)

- [ ] **Step 5: 리뷰 지적사항 반영 (있을 경우)**

리뷰 결과에 따라 파일 수정. 각 수정은 개별 커밋으로 분리.

```bash
git add <수정파일>
git commit -m "fix(shipyard): <구체적 수정 내용>"
```

- [ ] **Step 6: 푸시**

```bash
git push
```

---

## 자체 검토

**Spec coverage:**
- ✅ 네비 변경 (Task 1)
- ✅ `/shipyard` 라우트 (Task 2)
- ✅ Hero + 인라인 뱃지 (Task 2)
- ✅ 서비스 카테고리 4카드 (Task 3)
- ✅ Before/After 페어 갤러리 + 필터 + 플레이스홀더 (Task 4)
- ✅ 상담 CTA (Task 5)
- ✅ 빌드·smoke 검증 (Task 6)
- ✅ 스펙의 "범위 밖" 항목들은 의도적으로 미포함

**타입 일관성:** `Category` 타입이 `RepairGallery.tsx` 내부 정의이며 외부 사용 없음. `cases` 배열 타입 `RepairCase`도 같은 파일 내 일관. `COMPANY.phone`은 기존 `constants/company.ts`에 존재.

**누락된 요소:** 없음.

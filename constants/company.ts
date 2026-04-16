/**
 * 회사 정보 중앙 관리
 * 실제 정보 확인 후 여기만 수정하면 footer/contact 모두 반영됩니다.
 */

export const COMPANY = {
  /** 상호 */
  name: "수연선박",
  nameEn: "Sooyeon Ship Trading Co.",

  /** 대표자 */
  representative: "홍길동",

  /** 사업자등록번호 */
  businessNumber: "000-00-00000",

  /** 연락처 */
  phone: "010-0000-0000",
  fax: "032-000-0000",
  email: "info@sooyeonship.com",

  /** 주소 */
  address: "인천광역시 중구 항동7가 1-1",
  addressShort: "인천 중구 항동",

  /** 운영시간 */
  hours: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)",

  /** 좌표 (네비 딥링크용) */
  lat: 37.4563,
  lng: 126.6175,

  /** Google Maps embed URL (실제 좌표로 교체 필요) */
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.0!2d126.6175!3d37.4563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7J247LKc6rSR7Jet7IucIOykkeq1rCDtla3rj5k!5e0!3m2!1sko!2skr!4v1700000000000",

  /** 교통편 안내 */
  directions: {
    car: [
      "인천항 방면 → 연안부두 방향 진입",
      "중구 항동 사거리 직진 약 500m",
      "수연선박 간판 확인 후 좌회전",
      "전용 주차장 이용 가능 (무료)",
    ],
    publicTransport: [
      "지하철 1호선 인천역 1번 출구 → 연안부두 방향 도보 10분",
      "버스 2, 23, 45번 → 항동입구 정류장 하차",
      "정류장에서 도보 약 5분",
    ],
  },

  /** 저작권 연도 */
  copyrightYear: 2025,
} as const;

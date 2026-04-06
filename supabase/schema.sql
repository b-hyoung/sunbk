-- ================================================
-- 선박 임대/판매 사이트 Supabase 스키마
-- ================================================

-- 선박 테이블
CREATE TABLE vessels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('rent', 'sale', 'both')),
  vessel_type VARCHAR(100) NOT NULL, -- 어선, 레저선, 화물선, 여객선 등
  year_built INTEGER,
  length_m DECIMAL(6,2),            -- 전장 (미터)
  tonnage DECIMAL(8,2),             -- 톤수
  engine_power VARCHAR(100),        -- 엔진 출력
  capacity INTEGER,                 -- 승선 정원
  location VARCHAR(200),            -- 정박 위치
  description TEXT,
  features TEXT[],                  -- 특징/옵션 배열
  rent_price_per_day INTEGER,       -- 임대가 (원/일)
  sale_price INTEGER,               -- 판매가 (원)
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 선박 이미지 테이블
CREATE TABLE vessel_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES vessels(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES vessels(id) ON DELETE CASCADE,
  booking_type VARCHAR(10) NOT NULL CHECK (booking_type IN ('rent', 'inquiry')),
  -- 고객 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(200),
  -- 임대 정보
  start_date DATE,
  end_date DATE,
  total_days INTEGER GENERATED ALWAYS AS (
    CASE WHEN end_date IS NOT NULL AND start_date IS NOT NULL
    THEN (end_date - start_date)
    ELSE NULL END
  ) STORED,
  total_price INTEGER,
  -- 상태
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  message TEXT,                     -- 고객 메모
  admin_memo TEXT,                  -- 관리자 메모
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 문의 테이블
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(200),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vessels_updated_at
  BEFORE UPDATE ON vessels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 인덱스
CREATE INDEX idx_vessels_type ON vessels(type);
CREATE INDEX idx_vessels_status ON vessels(status);
CREATE INDEX idx_vessels_slug ON vessels(slug);
CREATE INDEX idx_vessel_images_vessel_id ON vessel_images(vessel_id);
CREATE INDEX idx_bookings_vessel_id ON bookings(vessel_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

-- RLS (Row Level Security)
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 허용 (선박 목록/상세)
CREATE POLICY "vessels_public_read" ON vessels
  FOR SELECT USING (status = 'active');

CREATE POLICY "vessel_images_public_read" ON vessel_images
  FOR SELECT USING (true);

-- 예약/문의는 누구나 생성 가능
CREATE POLICY "bookings_insert" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "inquiries_insert" ON inquiries
  FOR INSERT WITH CHECK (true);

-- 샘플 데이터
INSERT INTO vessels (title, slug, type, vessel_type, year_built, length_m, tonnage, capacity, location, description, rent_price_per_day, sale_price, is_featured) VALUES
(
  '32ft 레저 보트',
  '32ft-leisure-boat',
  'both',
  '레저선',
  2020,
  9.8,
  5.5,
  8,
  '부산 수영만 요트경기장',
  '최신형 32ft 레저 보트입니다. 낚시 및 해상 레저에 최적화된 선박으로 안전하고 편안한 승선감을 제공합니다.',
  500000,
  85000000,
  true
),
(
  '65ft 어업용 선박',
  '65ft-fishing-vessel',
  'sale',
  '어선',
  2018,
  19.8,
  47.5,
  12,
  '인천 연안부두',
  '대형 어업용 선박으로 원양 조업에 적합합니다. 냉동 설비 완비, 최신 항법장치 탑재.',
  NULL,
  320000000,
  true
),
(
  '45ft 크루저 요트',
  '45ft-cruiser-yacht',
  'rent',
  '레저선',
  2021,
  13.7,
  12.0,
  10,
  '경기도 화성 전곡항',
  '프리미엄 크루저 요트. 숙박 가능한 캐빈 구조로 가족 여행 및 기업 행사에 적합합니다.',
  1200000,
  NULL,
  false
);

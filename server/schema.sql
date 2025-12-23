-- COZY 커피 주문 앱 데이터베이스 스키마
-- Render PostgreSQL 데이터베이스용

-- 기존 테이블 삭제 (주의: 프로덕션 환경에서는 사용하지 마세요)
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS options CASCADE;
-- DROP TABLE IF EXISTS menus CASCADE;

-- Menus 테이블 생성
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블 생성
CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블 생성
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  menu_id INTEGER NOT NULL REFERENCES menus(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('received', 'making', 'completed')),
  selected_options JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id);

-- 초기 메뉴 데이터 삽입 (선택사항 - 이미 데이터가 있으면 건너뜀)
INSERT INTO menus (name, description, price, image, stock) 
SELECT * FROM (VALUES
  ('아메리카노(ICE)', '시원한 아이스 아메리카노', 4000, '/patrick-tomasso-fMntI8HAAB8-unsplash.jpg', 10),
  ('아메리카노(HOT)', '따뜻한 핫 아메리카노', 4000, '/blake-wisz-Kx3o6_m1Yv8-unsplash.jpg', 10),
  ('카페라떼', '부드러운 카페라떼', 5000, '/blake-wisz-Kx3o6_m1Yv8-unsplash.jpg', 10),
  ('카푸치노', '고소한 카푸치노', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 10),
  ('에스프레소', '진한 에스프레소', 3500, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop', 10),
  ('카라멜 마키아토', '달콤한 카라멜 마키아토', 5500, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop', 10)
) AS v(name, description, price, image, stock)
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE menus.name = v.name);

-- 초기 옵션 데이터 삽입 (선택사항)
-- 메뉴별로 샷 추가, 시럽 추가 옵션 생성
INSERT INTO options (name, price, menu_id) 
SELECT '샷 추가', 500, id FROM menus 
WHERE name IN ('아메리카노(ICE)', '아메리카노(HOT)', '카페라떼', '카푸치노', '에스프레소', '카라멜 마키아토')
AND NOT EXISTS (
  SELECT 1 FROM options 
  WHERE options.menu_id = menus.id AND options.name = '샷 추가'
);

INSERT INTO options (name, price, menu_id) 
SELECT '시럽 추가', 0, id FROM menus 
WHERE name IN ('아메리카노(ICE)', '아메리카노(HOT)', '카페라떼', '카푸치노', '에스프레소', '카라멜 마키아토')
AND NOT EXISTS (
  SELECT 1 FROM options 
  WHERE options.menu_id = menus.id AND options.name = '시럽 추가'
);


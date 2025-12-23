-- COZY 커피 주문 앱 데이터베이스 스키마 (초기화용)
-- Render PostgreSQL 데이터베이스용
-- 이 파일은 테이블만 생성하고 샘플 데이터는 삽입하지 않습니다.

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


# COZY 커피 주문 앱 - 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음과 같은 환경 변수를 설정하세요:

```
# 서버 포트
PORT=3000

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=your_password

# 환경
NODE_ENV=development
```

## 실행

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 메뉴 상세 조회
- `GET /api/menus/:id/options` - 메뉴 옵션 목록 조회
- `PUT /api/menus/:id/stock` - 메뉴 재고 수정

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회
- `PUT /api/orders/:id/status` - 주문 상태 변경

### 재고 관련
- `GET /api/inventory` - 재고 현황 조회
- `PUT /api/inventory/:menu_id` - 재고 수정

### 통계 관련
- `GET /api/orders/stats` - 주문 통계 조회

## 기술 스택

- Node.js
- Express.js
- PostgreSQL (pg)
- CORS
- dotenv

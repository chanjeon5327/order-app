# 데이터베이스 스키마 설정 가이드

Render PostgreSQL 데이터베이스에 스키마를 적용하는 방법입니다.

## 방법 1: Node.js 스크립트 사용 (권장)

이 방법은 이미 구현된 Node.js 스크립트를 사용합니다. 환경 변수가 올바르게 설정되어 있다면 가장 간단합니다.

### 로컬에서 실행:
```bash
cd server
npm run init-db
```

또는

```bash
cd server
npm run create-schema
```

### Render에서 실행:

1. Render Dashboard에서 백엔드 서비스로 이동
2. **Shell** 탭 클릭
3. 다음 명령어 실행:
```bash
cd server
npm run init-db
```

## 방법 2: SQL 파일 직접 실행

### 로컬에서 실행:

1. Render Dashboard에서 PostgreSQL 데이터베이스로 이동
2. **Connections** 탭에서 **Internal Database URL** 또는 **External Connection String** 복사
3. psql을 사용하여 연결:
```bash
psql "postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
```

4. SQL 파일 실행:
```sql
\i server/schema-init.sql
```

또는 SQL 내용을 직접 붙여넣기

### Render Shell에서 실행:

1. Render Dashboard에서 백엔드 서비스로 이동
2. **Shell** 탭 클릭
3. 다음 명령어 실행:
```bash
cd server
psql $DATABASE_URL -f schema-init.sql
```

> 참고: `$DATABASE_URL` 환경 변수가 설정되어 있어야 합니다.

## 생성되는 테이블

### 1. `menus` (메뉴 테이블)
- `id`: 메뉴 고유 ID (SERIAL, PRIMARY KEY)
- `name`: 메뉴 이름 (VARCHAR(100), NOT NULL)
- `description`: 메뉴 설명 (TEXT)
- `price`: 기본 가격 (INTEGER, NOT NULL, >= 0)
- `image`: 이미지 URL (VARCHAR(500))
- `stock`: 재고 수량 (INTEGER, NOT NULL, DEFAULT 0, >= 0)
- `created_at`: 생성 일시 (TIMESTAMP)
- `updated_at`: 수정 일시 (TIMESTAMP)

### 2. `options` (옵션 테이블)
- `id`: 옵션 고유 ID (SERIAL, PRIMARY KEY)
- `name`: 옵션 이름 (VARCHAR(100), NOT NULL)
- `price`: 옵션 추가 가격 (INTEGER, NOT NULL, DEFAULT 0, >= 0)
- `menu_id`: 연결된 메뉴 ID (INTEGER, FOREIGN KEY → menus.id)
- `created_at`: 생성 일시 (TIMESTAMP)
- `updated_at`: 수정 일시 (TIMESTAMP)

### 3. `orders` (주문 테이블)
- `id`: 주문 고유 ID (VARCHAR(50), PRIMARY KEY)
- `order_date`: 주문 일시 (TIMESTAMP, NOT NULL)
- `menu_id`: 주문한 메뉴 ID (INTEGER, FOREIGN KEY → menus.id)
- `quantity`: 주문 수량 (INTEGER, NOT NULL, > 0)
- `total_price`: 주문 총 금액 (INTEGER, NOT NULL, >= 0)
- `status`: 주문 상태 (VARCHAR(20), NOT NULL, 'received'/'making'/'completed')
- `selected_options`: 선택한 옵션 정보 (JSONB)
- `created_at`: 생성 일시 (TIMESTAMP)
- `updated_at`: 수정 일시 (TIMESTAMP)

## 인덱스

다음 인덱스들이 자동으로 생성됩니다:
- `idx_orders_status`: 주문 상태 검색 최적화
- `idx_orders_order_date`: 주문 일시 정렬 최적화
- `idx_options_menu_id`: 메뉴별 옵션 조회 최적화

## 초기 데이터

`schema.sql` 파일에는 초기 메뉴와 옵션 데이터가 포함되어 있습니다. 
스키마만 생성하려면 `schema-init.sql` 파일을 사용하세요.

## 환경 변수 확인

스키마를 생성하기 전에 다음 환경 변수들이 올바르게 설정되어 있는지 확인하세요:

```
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=order_app
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

Render에서는 데이터베이스 서비스의 **Connections** 탭에서 Internal Database URL을 확인하고, 이를 파싱하여 환경 변수로 설정할 수 있습니다.


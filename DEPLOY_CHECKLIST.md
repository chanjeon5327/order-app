# 🚀 Render.com 배포 체크리스트

## 빠른 배포 가이드 (3단계)

### ✅ 1단계: PostgreSQL 데이터베이스 생성
1. Render Dashboard → **New +** → **PostgreSQL**
2. 설정:
   - Name: `order-app-db`
   - Database: `order_app`
   - Plan: Free
3. 생성 후 **Connections** 탭에서 **Internal Database URL** 복사

### ✅ 2단계: 백엔드 서버 배포
1. Render Dashboard → **New +** → **Web Service**
2. GitHub 레포지토리 연결
3. 설정:
   - **Name**: `order-app-backend`
   - **Environment**: Node
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables** 추가:
   ```
   NODE_ENV=production
   PORT=10000
   ```
   Internal Database URL을 파싱하여:
   ```
   DB_HOST=<호스트>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<사용자>
   DB_PASSWORD=<비밀번호>
   ```
5. 배포 완료 후 URL 확인 (예: `https://order-app-backend.onrender.com`)

### ✅ 3단계: 프론트엔드 배포
1. Render Dashboard → **New +** → **Static Site**
2. GitHub 레포지토리 연결
3. 설정:
   - **Name**: `order-app-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables** 추가:
   ```
   VITE_API_URL=https://order-app-backend.onrender.com
   ```
   (위에서 확인한 백엔드 URL)

## 🔧 배포 후 작업

### 데이터베이스 초기화
Render Dashboard → 백엔드 서비스 → **Shell** 탭:
```bash
cd server
npm run init-db
```

### 확인사항
- [ ] 백엔드: `https://order-app-backend.onrender.com/api/health` 접속 확인
- [ ] 프론트엔드: 배포된 URL 접속하여 메뉴 표시 확인
- [ ] 데이터베이스: 로그에서 연결 성공 메시지 확인

## ⚠️ 주의사항
- Free 플랜은 15분 비활성 시 sleep 상태가 됩니다
- 첫 요청 시 깨어나는 데 30초~1분 소요됩니다
- 프로덕션에서는 Paid 플랜 권장


# Render.com 배포 가이드

이 문서는 Render.com에 COZY 커피 주문 앱을 배포하는 방법을 설명합니다.

## 📋 배포 순서

### 1단계: Render.com 계정 생성 및 로그인
1. [Render.com](https://render.com)에 접속하여 계정 생성
2. GitHub 계정으로 연동 (권장) 또는 이메일로 가입

### 2단계: GitHub에 코드 푸시 (선택사항)
1. GitHub 레포지토리 생성
2. 프로젝트 코드 푸시
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 3단계: PostgreSQL 데이터베이스 생성
1. Render Dashboard에서 **"New +"** 클릭
2. **"PostgreSQL"** 선택
3. 설정:
   - **Name**: `order-app-db` (원하는 이름)
   - **Database**: `order_app`
   - **User**: `order_app_user` (자동 생성 또는 선택)
   - **Region**: `Singapore` (가장 가까운 지역 선택)
   - **PostgreSQL Version**: 최신 버전
   - **Plan**: Free (또는 원하는 플랜)
4. **"Create Database"** 클릭
5. 데이터베이스 생성 완료 후 **"Connections"** 탭에서 연결 정보 확인:
   - `Internal Database URL` (서버용)
   - `External Database URL` (로컬 테스트용)

### 4단계: 백엔드 서버 배포
1. Render Dashboard에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. GitHub 레포지토리 연결 (또는 직접 배포)
4. 설정:
   - **Name**: `order-app-backend`
   - **Environment**: `Node`
   - **Region**: 데이터베이스와 동일한 지역
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `server` (서버 폴더가 루트)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (또는 원하는 플랜)
5. **"Environment Variables"** 섹션에서 다음 변수 추가:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<데이터베이스 Internal Database URL에서 추출한 호스트>
   DB_PORT=<데이터베이스 Internal Database URL에서 추출한 포트>
   DB_NAME=order_app
   DB_USER=<데이터베이스 Internal Database URL에서 추출한 사용자>
   DB_PASSWORD=<데이터베이스 Internal Database URL에서 추출한 비밀번호>
   ```
   
   또는 **Internal Database URL 전체를 사용**하는 경우:
   ```
   DATABASE_URL=<Internal Database URL 전체>
   ```
   (이 경우 `server/config/database.js` 파일을 수정해야 함)
6. **"Advanced"** 설정 (선택):
   - **Auto-Deploy**: `Yes` (GitHub 푸시 시 자동 배포)
7. **"Create Web Service"** 클릭
8. 배포 완료 후 서버 URL 확인 (예: `https://order-app-backend.onrender.com`)

### 5단계: 데이터베이스 초기화
1. 로컬에서 `.env` 파일 생성:
   ```env
   DB_HOST=<External Database URL의 호스트>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<External Database URL의 사용자>
   DB_PASSWORD=<External Database URL의 비밀번호>
   ```
2. 데이터베이스 초기화 실행:
   ```bash
   cd server
   npm run init-db
   ```
3. 또는 Render의 **"Shell"** 탭에서 직접 실행:
   ```bash
   cd server
   npm run init-db
   ```

### 6단계: 프론트엔드 배포
1. Render Dashboard에서 **"New +"** 클릭
2. **"Static Site"** 선택
3. GitHub 레포지토리 연결
4. 설정:
   - **Name**: `order-app-frontend`
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `/` (프로젝트 루트)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. **"Environment Variables"** 섹션에서 다음 변수 추가:
   ```
   VITE_API_URL=https://order-app-backend.onrender.com
   ```
   (백엔드 서버 URL을 입력)
6. **"Create Static Site"** 클릭
7. 배포 완료 후 프론트엔드 URL 확인

### 7단계: 프론트엔드에서 API URL 설정 확인
프론트엔드 코드에서 API 호출 시 `VITE_API_URL` 환경변수를 사용하도록 확인:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

## 🔧 추가 설정

### 데이터베이스 연결 정보 확인
Render Dashboard → 데이터베이스 서비스 → **"Connections"** 탭에서:
- **Internal Database URL**: 백엔드 서버에서 사용 (같은 네트워크 내)
- **External Database URL**: 로컬 개발 환경에서 사용

### 백엔드 CORS 설정 확인
`server/server.js`에서 프론트엔드 URL을 CORS 허용 목록에 추가해야 할 수 있습니다:
```javascript
app.use(cors({
  origin: ['https://order-app-frontend.onrender.com', 'http://localhost:5173']
}))
```

### 무료 플랜 제한사항
- **Free 플랜**: 15분간 요청이 없으면 서비스가 "sleep" 상태가 됩니다
- 첫 요청 시 깨어나는 데 약 30초~1분 소요됩니다
- 프로덕션 환경에서는 Paid 플랜을 권장합니다

## 🚀 배포 후 확인사항

1. ✅ 백엔드 서버가 정상 실행되는지 확인:
   - `https://order-app-backend.onrender.com/api/health` 접속
   - `{"status":"OK"}` 응답 확인

2. ✅ 데이터베이스 연결 확인:
   - 백엔드 로그에서 "데이터베이스에 연결되었습니다" 메시지 확인

3. ✅ 프론트엔드에서 백엔드 API 호출 확인:
   - 브라우저 개발자 도구 → Network 탭에서 API 요청 확인

## 📝 문제 해결

### 서버가 시작되지 않는 경우
- 로그 확인: Render Dashboard → 서비스 → **"Logs"** 탭
- 환경 변수 확인: 모든 환경 변수가 올바르게 설정되었는지 확인
- 빌드 명령 확인: `package.json`의 `start` 스크립트 확인

### 데이터베이스 연결 오류
- 환경 변수 확인: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- Internal Database URL 사용 확인 (External URL이 아닌)
- 방화벽 설정 확인

### CORS 오류
- 백엔드에서 프론트엔드 URL을 CORS 허용 목록에 추가
- 환경 변수에서 프론트엔드 URL 확인

## 🔗 유용한 링크
- [Render 공식 문서](https://render.com/docs)
- [Render PostgreSQL 가이드](https://render.com/docs/databases)
- [Render 환경 변수 설정](https://render.com/docs/environment-variables)


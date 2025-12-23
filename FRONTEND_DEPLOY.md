# 프론트엔드 Render 배포 가이드

이 문서는 프론트엔드 코드를 Render.com에 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

1. ✅ GitHub 레포지토리에 코드가 푸시되어 있어야 합니다
2. ✅ 백엔드 서버가 이미 배포되어 있어야 합니다 (백엔드 URL 필요)
3. ✅ Render 계정이 있어야 합니다 (https://render.com)

## 🔧 코드 수정 사항

### 1. 환경 변수 설정 파일 생성

프로젝트 루트에 `.env.example` 파일이 이미 생성되어 있습니다. 
로컬 개발을 위해 `.env` 파일을 생성하세요:

```bash
# 프로젝트 루트에서
cp .env.example .env
```

`.env` 파일 내용:
```
VITE_API_URL=http://localhost:3000
```

> **참고**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
> Render에서는 환경 변수를 대시보드에서 직접 설정합니다.

### 2. API URL 사용 방법 (선택사항)

현재 코드는 하드코딩된 메뉴 데이터를 사용하고 있습니다. 
백엔드 API와 연동하려면 `src/config/api.js` 파일의 API 헬퍼 함수를 사용하세요.

**예시:**
```javascript
import { api } from './config/api'

// 메뉴 목록 가져오기
const menus = await api.getMenus()
```

### 3. 이미지 경로 확인

`public` 폴더의 이미지들은 빌드 시 자동으로 포함되므로 경로는 그대로 유지됩니다.
- `/patrick-tomasso-fMntI8HAAB8-unsplash.jpg` ✅
- `/blake-wisz-Kx3o6_m1Yv8-unsplash.jpg` ✅

외부 URL 이미지도 그대로 사용 가능합니다.

## 🚀 Render 배포 과정

### 1단계: Render에서 Static Site 생성

1. **Render Dashboard** 접속 (https://dashboard.render.com)
2. **"New +"** 버튼 클릭
3. **"Static Site"** 선택

### 2단계: GitHub 레포지토리 연결

1. **"Connect GitHub"** 또는 **"Connect GitLab"** 클릭
2. 권한 승인
3. 레포지토리 선택

### 3단계: 빌드 설정

다음 설정을 입력합니다:

| 설정 항목 | 값 |
|---------|-----|
| **Name** | `order-app-frontend` (또는 원하는 이름) |
| **Branch** | `main` (또는 기본 브랜치) |
| **Root Directory** | `/` (프로젝트 루트, 기본값) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

> **중요**: Root Directory는 비워두거나 `/`로 설정합니다.
> `src` 폴더가 루트에 있으므로 별도의 루트 디렉토리 지정이 필요 없습니다.

### 4단계: 환경 변수 설정

**"Environment Variables"** 섹션에서 다음 변수를 추가합니다:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://order-app-backend.onrender.com` |

> **주의**: `VITE_API_URL` 값은 실제 배포된 백엔드 서버 URL로 변경해야 합니다.
> 예: `https://order-app-backend.onrender.com` 또는 실제 백엔드 서버 URL

### 5단계: 배포 생성

1. **"Create Static Site"** 버튼 클릭
2. 빌드 과정을 기다립니다 (약 1-2분 소요)
3. 배포 완료 후 프론트엔드 URL이 생성됩니다
   - 예: `https://order-app-frontend.onrender.com`

## ✅ 배포 후 확인사항

### 1. 빌드 성공 확인

Render Dashboard → 프론트엔드 서비스 → **"Logs"** 탭에서:
- ✅ 빌드 로그에 에러가 없는지 확인
- ✅ `dist` 폴더가 생성되었는지 확인

### 2. 프론트엔드 접속 확인

1. 배포된 URL로 접속
2. 페이지가 정상적으로 로드되는지 확인
3. 브라우저 개발자 도구 (F12) → **Console** 탭에서 에러 확인

### 3. API 연동 확인 (백엔드 연동 시)

1. 브라우저 개발자 도구 → **Network** 탭
2. 페이지 로드 후 API 요청이 발생하는지 확인
3. CORS 오류가 없는지 확인

## 🔧 문제 해결

### 빌드 실패

**증상**: 빌드가 실패하거나 에러 발생

**해결 방법**:
1. **Logs** 탭에서 에러 메시지 확인
2. `package.json`의 `build` 스크립트 확인
3. 로컬에서 빌드 테스트:
   ```bash
   npm install
   npm run build
   ```
4. `node_modules` 문제인 경우:
   - Render 대시보드에서 **"Manual Deploy"** → **"Clear build cache & deploy"** 시도

### 환경 변수가 적용되지 않음

**증상**: API 호출이 실패하거나 잘못된 URL로 요청

**해결 방법**:
1. 환경 변수가 올바르게 설정되었는지 확인
   - Render Dashboard → 서비스 → **"Environment"** 탭
2. 환경 변수 이름이 `VITE_`로 시작하는지 확인 (Vite 필수)
3. 재배포: **"Manual Deploy"** → **"Deploy latest commit"**

### 이미지가 표시되지 않음

**증상**: 이미지가 깨진 아이콘으로 표시

**해결 방법**:
1. 이미지 경로가 `/`로 시작하는지 확인 (절대 경로)
2. 이미지가 `public` 폴더에 있는지 확인
3. 빌드된 `dist` 폴더에 이미지가 포함되어 있는지 확인

### CORS 오류

**증상**: 브라우저 콘솔에 CORS 관련 에러

**해결 방법**:
1. 백엔드 서버의 CORS 설정 확인
2. 프론트엔드 URL을 백엔드 CORS 허용 목록에 추가
   ```javascript
   // server/server.js
   app.use(cors({
     origin: [
       'https://order-app-frontend.onrender.com',
       'http://localhost:5173' // 개발 환경
     ]
   }))
   ```

## 📝 추가 참고사항

### Vite 환경 변수 규칙

- 환경 변수는 반드시 `VITE_` 접두사로 시작해야 합니다
- 빌드 시 환경 변수가 코드에 포함됩니다 (클라이언트 번들에 포함됨)
- 보안상 민감한 정보는 환경 변수로 사용하지 마세요

### Free 플랜 제한사항

- **Free 플랜**: Static Site는 항상 활성 상태를 유지합니다
- **커스텀 도메인**: 무료로 설정 가능
- **자동 배포**: Git 푸시 시 자동 배포

### 커스텀 도메인 설정 (선택사항)

1. Render Dashboard → 서비스 → **"Settings"** 탭
2. **"Custom Domains"** 섹션
3. 도메인 추가 및 DNS 설정

## 🎯 다음 단계

배포가 완료된 후:

1. ✅ 프론트엔드와 백엔드 연동 테스트
2. ✅ 실제 API 호출로 데이터 가져오기 (현재는 하드코딩된 데이터 사용)
3. ✅ 주문 기능 테스트
4. ✅ 관리자 대시보드 테스트

---

**문제가 발생하면**: Render Dashboard → 서비스 → **"Logs"** 탭에서 에러 메시지를 확인하세요.


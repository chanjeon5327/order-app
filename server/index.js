import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 미들웨어 설정
app.use(cors()) // CORS 허용 (프런트엔드와 통신을 위해)
app.use(express.json()) // JSON 파싱
app.use(express.urlencoded({ extended: true })) // URL 인코딩된 데이터 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'COZY 커피 주문 앱 API 서버',
    version: '1.0.0'
  })
})

// API 라우트 (추후 추가 예정)
// app.use('/api/menus', menusRoutes)
// app.use('/api/orders', ordersRoutes)
// app.use('/api/inventory', inventoryRoutes)

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.'
    }
  })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || '서버 내부 오류가 발생했습니다.'
    }
  })
})

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)
  console.log(`http://localhost:${PORT}`)
})

export default app


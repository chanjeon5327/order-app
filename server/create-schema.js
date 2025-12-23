import { initDatabase } from './config/initDatabase.js'

initDatabase().catch(error => {
  console.error('스키마 생성 실패:', error)
  process.exit(1)
})


import { initDatabase } from '../config/initDatabase.js'

initDatabase().catch(error => {
  console.error('초기화 실패:', error)
  process.exit(1)
})


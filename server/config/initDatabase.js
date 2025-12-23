import pool from './database.js'

// 테이블 생성 SQL
const createTables = async () => {
  const client = await pool.connect()
  
  try {
    // Menus 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL CHECK (price >= 0),
        image VARCHAR(500),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Menus 테이블 생성 완료')

    // Options 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
        menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Options 테이블 생성 완료')

    // Orders 테이블 생성
    await client.query(`
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
      )
    `)
    console.log('✅ Orders 테이블 생성 완료')

    // 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `)
    console.log('✅ Orders status 인덱스 생성 완료')

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC)
    `)
    console.log('✅ Orders order_date 인덱스 생성 완료')

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id)
    `)
    console.log('✅ Options menu_id 인덱스 생성 완료')

    console.log('\n🎉 모든 테이블이 성공적으로 생성되었습니다!')
  } catch (error) {
    console.error('❌ 테이블 생성 중 오류 발생:', error)
    throw error
  } finally {
    client.release()
  }
}

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ 데이터베이스 연결 성공!')
    console.log('연결 시간:', result.rows[0].now)
    client.release()
    return true
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message)
    return false
  }
}

// 메인 함수
const initDatabase = async () => {
  console.log('데이터베이스 초기화를 시작합니다...\n')
  
  // 연결 테스트
  const connected = await testConnection()
  if (!connected) {
    console.error('\n데이터베이스 연결에 실패했습니다. .env 파일의 설정을 확인해주세요.')
    process.exit(1)
  }

  console.log('\n테이블 생성을 시작합니다...\n')
  
  // 테이블 생성
  await createTables()
  
  // 연결 풀 종료
  await pool.end()
  console.log('\n데이터베이스 연결을 종료합니다.')
}

export { initDatabase, testConnection, createTables }

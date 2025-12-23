// API 설정
// Vite 환경 변수는 import.meta.env로 접근합니다
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default API_URL

// API 호출 헬퍼 함수들
export const api = {
  // 메뉴 목록 조회
  async getMenus() {
    const response = await fetch(`${API_URL}/api/menus`)
    if (!response.ok) {
      throw new Error('메뉴를 불러오는데 실패했습니다.')
    }
    return response.json()
  },

  // 메뉴 상세 조회
  async getMenu(id) {
    const response = await fetch(`${API_URL}/api/menus/${id}`)
    if (!response.ok) {
      throw new Error('메뉴를 불러오는데 실패했습니다.')
    }
    return response.json()
  },

  // 메뉴 옵션 조회
  async getMenuOptions(id) {
    const response = await fetch(`${API_URL}/api/menus/${id}/options`)
    if (!response.ok) {
      throw new Error('옵션을 불러오는데 실패했습니다.')
    }
    return response.json()
  },

  // 주문 생성
  async createOrder(orderData) {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      throw new Error('주문 생성에 실패했습니다.')
    }
    return response.json()
  },

  // 주문 목록 조회
  async getOrders() {
    const response = await fetch(`${API_URL}/api/orders`)
    if (!response.ok) {
      throw new Error('주문 목록을 불러오는데 실패했습니다.')
    }
    return response.json()
  },

  // 주문 상태 변경
  async updateOrderStatus(id, status) {
    const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error('주문 상태 변경에 실패했습니다.')
    }
    return response.json()
  },

  // 재고 현황 조회
  async getInventory() {
    const response = await fetch(`${API_URL}/api/inventory`)
    if (!response.ok) {
      throw new Error('재고 현황을 불러오는데 실패했습니다.')
    }
    return response.json()
  },

  // 재고 수정
  async updateInventory(menuId, stock) {
    const response = await fetch(`${API_URL}/api/inventory/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock }),
    })
    if (!response.ok) {
      throw new Error('재고 수정에 실패했습니다.')
    }
    return response.json()
  },

  // 주문 통계 조회
  async getOrderStats() {
    const response = await fetch(`${API_URL}/api/orders/stats`)
    if (!response.ok) {
      throw new Error('주문 통계를 불러오는데 실패했습니다.')
    }
    return response.json()
  },
}


import { useState } from 'react'
import Header from './components/Header'
import MenuItem from './components/MenuItem'
import ShoppingCart from './components/ShoppingCart'
import AdminDashboard from './components/AdminDashboard'
import InventoryStatus from './components/InventoryStatus'
import OrderStatus from './components/OrderStatus'
import './App.css'

// 임시 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: '/patrick-tomasso-fMntI8HAAB8-unsplash.jpg',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    image: '/blake-wisz-Kx3o6_m1Yv8-unsplash.jpg',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    image: '/blake-wisz-Kx3o6_m1Yv8-unsplash.jpg',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '에스프레소',
    price: 3500,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '카라멜 마키아토',
    price: 5500,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 }
    ]
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cartItems, setCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노 (ICE)', stock: 10 },
    { id: 2, name: '아메리카노 (HOT)', stock: 10 },
    { id: 3, name: '카페라떼', stock: 10 }
  ])

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleAddToCart = (item) => {
    // 동일한 메뉴와 옵션 조합이 있는지 확인
    const existingItemIndex = cartItems.findIndex(cartItem => 
      cartItem.menuId === item.menuId && 
      cartItem.optionsText === item.optionsText
    )

    if (existingItemIndex >= 0) {
      // 기존 항목의 수량 증가
      setCartItems(prev => 
        prev.map((cartItem, index) => 
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      // 새 항목 추가 (고유 ID 생성)
      const cartItemId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setCartItems(prev => [...prev, { ...item, quantity: 1, cartItemId }])
    }
  }

  const handleRemoveFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const handleUpdateCartQuantity = (cartItemId, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    
    const totalAmount = cartItems.reduce((sum, item) => {
      const optionPrice = item.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0)
      return sum + (item.basePrice + optionPrice) * item.quantity
    }, 0)

    // 각 장바구니 아이템을 개별 주문으로 추가
    const newOrders = cartItems.map((item, index) => {
      const optionPrice = (item.selectedOptions || []).reduce((optSum, opt) => optSum + opt.price, 0)
      const itemPrice = (item.basePrice + optionPrice) * item.quantity
      
      // 고유한 주문 ID 생성
      const orderId = `order_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
      
      return {
        id: orderId,
        orderDate: new Date().toISOString(),
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        totalPrice: itemPrice,
        optionsText: item.optionsText || '',
        selectedOptions: item.selectedOptions || [],
        status: 'received' // 주문 접수 상태로 시작
      }
    })

    setOrders(prev => [...newOrders, ...prev])
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
    setCartItems([])
  }

  const handleUpdateInventory = (menuId, change) => {
    setInventory(prev => prev.map(item => {
      if (item.id === menuId) {
        const newStock = Math.max(0, item.stock + change)
        return { ...item, stock: newStock }
      }
      return item
    }))
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ))
  }

  if (currentPage === 'order') {
  return (
      <div className="App">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content">
          <section className="menu-section">
            <div className="menu-grid">
              {menuData.map(menu => (
                <MenuItem 
                  key={menu.id} 
                  menu={menu} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
          <section className="cart-section">
            <ShoppingCart 
              cartItems={cartItems} 
              onOrder={handleOrder}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateCartQuantity}
            />
          </section>
        </main>
      </div>
    )
  }

  if (currentPage === 'admin') {
    return (
      <div className="App">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content admin-main">
          <AdminDashboard orders={orders} />
          <InventoryStatus 
            inventory={inventory} 
            onUpdateInventory={handleUpdateInventory}
          />
          <OrderStatus 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </main>
      </div>
  )
  }

  return null
}

export default App

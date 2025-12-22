import { useState } from 'react'
import Header from './components/Header'
import MenuItem from './components/MenuItem'
import ShoppingCart from './components/ShoppingCart'
import './App.css'

// 임시 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
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

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page === 'admin') {
      alert('관리자 화면은 추후 구현 예정입니다.')
    }
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
      // 새 항목 추가
      setCartItems(prev => [...prev, { ...item, quantity: 1 }])
    }
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

    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
    setCartItems([])
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
            />
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        <p>관리자 화면은 추후 구현 예정입니다.</p>
      </main>
    </div>
  )
}

export default App

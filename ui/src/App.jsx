import { useState } from 'react'
import Header from './components/Header'
import AdminDashboard from './components/AdminDashboard'
import InventoryStatus from './components/InventoryStatus'
import OrderStatus from './components/OrderStatus'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('admin')
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노 (ICE)', stock: 10 },
    { id: 2, name: '아메리카노 (HOT)', stock: 10 },
    { id: 3, name: '카페라떼', stock: 10 }
  ])

  const handleNavigate = (page) => {
    setCurrentPage(page)
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

export default App

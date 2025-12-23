import './AdminDashboard.css'

function AdminDashboard({ orders }) {
  const totalOrders = orders.length
  const receivedOrders = orders.filter(order => order.status === 'received').length
  const makingOrders = orders.filter(order => order.status === 'making').length
  const completedOrders = orders.filter(order => order.status === 'completed').length

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <span>총 주문 {totalOrders}</span>
        <span>/</span>
        <span>주문 접수 {receivedOrders}</span>
        <span>/</span>
        <span>제조 중 {makingOrders}</span>
        <span>/</span>
        <span>제조 완료 {completedOrders}</span>
      </div>
    </div>
  )
}

export default AdminDashboard


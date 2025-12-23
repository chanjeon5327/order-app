import './OrderStatus.css'

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const formatItemText = (order) => {
    const optionsText = order.optionsText ? ` (${order.optionsText})` : ''
    return `${order.menuName}${optionsText} x ${order.quantity}`
  }

  const getStatusButton = (order) => {
    if (order.status === 'received') {
      return (
        <button 
          className="status-button status-button-making"
          onClick={() => onUpdateOrderStatus(order.id, 'making')}
        >
          제조 시작
        </button>
      )
    } else if (order.status === 'making') {
      return (
        <button 
          className="status-button status-button-completed"
          onClick={() => onUpdateOrderStatus(order.id, 'completed')}
        >
          제조 완료
        </button>
      )
    } else {
      return (
        <span className="status-text-completed">완료</span>
      )
    }
  }

  // 최신 주문이 위에 오도록 정렬
  const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

  return (
    <div className="order-status">
      <h2 className="order-title">주문 현황</h2>
      <div className="order-list">
        {sortedOrders.length === 0 ? (
          <p className="order-empty">주문이 없습니다.</p>
        ) : (
          sortedOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="order-date">{formatDate(order.orderDate)}</div>
                <div className="order-content">
                  {formatItemText(order)} - {order.totalPrice.toLocaleString()}원
                </div>
              </div>
              <div className="order-action">
                {getStatusButton(order)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OrderStatus


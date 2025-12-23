import './InventoryStatus.css'

function InventoryStatus({ inventory, onUpdateInventory }) {
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'status-out' }
    if (quantity < 5) return { text: '주의', className: 'status-warning' }
    return { text: '정상', className: 'status-normal' }
  }

  const handleIncrease = (menuId) => {
    onUpdateInventory(menuId, 1)
  }

  const handleDecrease = (menuId) => {
    onUpdateInventory(menuId, -1)
  }

  return (
    <div className="inventory-status">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map(item => {
          const status = getStockStatus(item.stock)
          return (
            <div key={item.id} className="inventory-card">
              <div className="inventory-menu-name">{item.name}</div>
              <div className="inventory-stock-info">
                <span className="inventory-quantity">{item.stock}개</span>
                <span className={`inventory-status-badge ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="inventory-controls">
                <button 
                  className="inventory-button decrease"
                  onClick={() => handleDecrease(item.id)}
                  disabled={item.stock <= 0}
                >
                  -
                </button>
                <button 
                  className="inventory-button increase"
                  onClick={() => handleIncrease(item.id)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InventoryStatus


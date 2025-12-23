import './ShoppingCart.css'

function ShoppingCart({ cartItems, onOrder, onRemoveItem, onUpdateQuantity }) {
  const totalAmount = cartItems.reduce((sum, item) => {
    const optionPrice = (item.selectedOptions || []).reduce((optSum, opt) => optSum + opt.price, 0)
    return sum + (item.basePrice + optionPrice) * item.quantity
  }, 0)

  const formatItemText = (item) => {
    const optionsText = item.optionsText ? ` (${item.optionsText})` : ''
    return `${item.menuName}${optionsText}`
  }

  const getItemPrice = (item) => {
    const optionPrice = (item.selectedOptions || []).reduce((sum, opt) => sum + opt.price, 0)
    return (item.basePrice + optionPrice) * item.quantity
  }

  return (
    <div className="shopping-cart">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">장바구니가 비어있습니다.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="cart-item">
                  <div className="cart-item-left">
                    <span className="cart-item-name">
                      {formatItemText(item)}
                    </span>
                    <div className="cart-item-quantity-controls">
                      <button 
                        className="quantity-button"
                        onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="cart-item-quantity">{item.quantity}</span>
                      <button 
                        className="quantity-button"
                        onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-price">
                      {getItemPrice(item).toLocaleString()}원
                    </span>
                    <button 
                      className="remove-button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="cart-total">
              총 금액 {totalAmount.toLocaleString()}원
            </div>
            <button className="order-button" onClick={onOrder}>
              주문하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingCart


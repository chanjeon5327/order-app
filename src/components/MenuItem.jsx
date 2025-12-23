import { useState } from 'react'
import './MenuItem.css'

function MenuItem({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId)
      } else {
        return [...prev, optionId]
      }
    })
  }

  const handleAddToCart = () => {
    const selectedOptionDetails = menu.options.filter(opt => 
      selectedOptions.includes(opt.id)
    )
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptionDetails,
      optionsText: selectedOptionDetails.map(opt => opt.name).join(', ')
    })
    
    // 옵션 초기화
    setSelectedOptions([])
  }

  return (
    <div className="menu-item-card">
      <div className="menu-item-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <div className="image-placeholder">이미지</div>
        )}
      </div>
      <div className="menu-item-info">
        <h3 className="menu-item-name">{menu.name}</h3>
        <p className="menu-item-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-item-description">{menu.description}</p>
        <div className="menu-item-options">
          {menu.options.map(option => (
            <label key={option.id} className="option-checkbox">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <span>
                {option.name} {option.price > 0 && `(+${option.price.toLocaleString()}원)`}
              </span>
            </label>
          ))}
        </div>
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          담기
        </button>
      </div>
    </div>
  )
}

export default MenuItem


import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({
  cart,
  updatingItem,
  onUpdateQuantity,
  onRemoveItem
}) => (
  <div className="lg:col-span-2 space-y-4">
    {cart.chiTiet.map((item, index) => {
      const itemId = item.sanPhamId || item.idSanPham || item.id;
      return (
        <CartItem
          key={itemId || `item-${index}`}
          item={item}
          updatingItem={updatingItem}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );
    })}
  </div>
);

export default CartItemList;

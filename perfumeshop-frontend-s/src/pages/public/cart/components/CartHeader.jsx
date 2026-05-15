import React from 'react';

const CartHeader = ({ onClearCart, isEmptyCart }) => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
      Giỏ hàng của bạn
    </h1>
    {!isEmptyCart && (
      <button
        onClick={onClearCart}
        className="text-red-500 hover:text-red-700 flex items-center gap-2"
      >
        <span className="material-symbols-outlined">delete_sweep</span>
        Xóa toàn bộ
      </button>
    )}
  </div>
);

export default CartHeader;

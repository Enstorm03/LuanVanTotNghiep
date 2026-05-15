import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useCart from '../../hooks/useCart';
import { isCartEmpty } from '../../utils/cartUtils';
import CartHeader from './cart/components/CartHeader';
import EmptyCart from './cart/components/EmptyCart';
import CartItemList from './cart/components/cart-items/CartItemList';
import CartSummary from './cart/components/summary/CartSummary';

const GioHangPage = () => {
  const { user } = useAuth();
  const {
    cart,
    loading,
    error,
    updatingItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    fetchCart
  } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
          <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải giỏ hàng</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const emptyCart = isCartEmpty(cart);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <CartHeader onClearCart={clearCart} isEmptyCart={emptyCart} />

        {emptyCart ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItemList
              cart={cart}
              updatingItem={updatingItem}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
            />
            <CartSummary cart={cart} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GioHangPage;

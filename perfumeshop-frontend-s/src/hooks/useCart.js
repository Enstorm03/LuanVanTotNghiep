import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const cartData = await api.getCart(user.id_nguoi_dung);
      setCart(cartData);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (sanPhamId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(sanPhamId);
      return;
    }

    try {
      setUpdatingItem(sanPhamId);
      console.log('Updating quantity to:', newQuantity);

      // Use API service method
      await api.updateCartItem(user.id_nguoi_dung, sanPhamId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Update quantity error:', error);
      alert('Không thể cập nhật số lượng: ' + error.message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (sanPhamId) => {
    try {
      setUpdatingItem(sanPhamId);

      // Use API service method
      await api.removeCartItem(user.id_nguoi_dung, sanPhamId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert('Không thể xóa sản phẩm: ' + error.message);
    } finally {
      setUpdatingItem(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;

    try {
      setLoading(true);
      await api.clearCart(user.id_nguoi_dung);
      setCart(null);
    } catch (error) {
      alert('Không thể xóa giỏ hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    updatingItem,
    fetchCart,
    updateItemQuantity,
    removeItem,
    clearCart
  };
};

export default useCart;

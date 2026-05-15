import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const useCheckoutData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [preOrderData, setPreOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, try to fetch cart data
        const cartData = await api.getCart(user.id_nguoi_dung);

        if (cartData && cartData.chiTiet && cartData.chiTiet.length > 0) {
          // User has cart items - proceed with cart checkout
          setCart(cartData);
          setPreOrderData(null); // Ensure no pre-order data interferes
          setLoading(false);
        } else {
          // No cart items - check for pre-order data
          const savedPreOrderData = localStorage.getItem('pre-order-data');
          if (savedPreOrderData) {
            try {
              const preOrder = JSON.parse(savedPreOrderData);
              setPreOrderData(preOrder);
            } catch (error) {
              console.error('Error parsing pre-order data:', error);
              localStorage.removeItem('pre-order-data');
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        setError('Không thể tải dữ liệu thanh toán');
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const cartData = await api.getCart(user.id_nguoi_dung);

      if (!cartData || !cartData.chiTiet || cartData.chiTiet.length === 0) {
        navigate('/cart');
        return;
      }

      setCart(cartData);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasItems = () => {
    return (preOrderData && preOrderData.items && preOrderData.items.length > 0) ||
           (cart && cart.chiTiet && cart.chiTiet.length > 0);
  };

  const isPreOrder = () => {
    return !!preOrderData;
  };

  const getItems = () => {
    return preOrderData ? preOrderData.items : cart?.chiTiet || [];
  };

  return {
    cart,
    preOrderData,
    loading,
    error,
    user,
    fetchCart,
    hasItems: hasItems(),
    isPreOrder: isPreOrder(),
    items: getItems()
  };
};

export default useCheckoutData;

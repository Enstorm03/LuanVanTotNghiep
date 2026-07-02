import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const useCheckoutData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const cartData = await api.getCart(user.id_nguoi_dung);

        if (cartData && cartData.chiTiet && cartData.chiTiet.length > 0) {
          setCart(cartData);
        }

        // Fetch active campaign for discount
        try {
          const campaignData = await api.getActiveCampaign();
          if (campaignData && campaignData.active) {
            setCampaign(campaignData);
          }
        } catch (campaignErr) {
          // No active campaign available
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu thanh toán:', err);
        setError('Không thể tải dữ liệu thanh toán');
      } finally {
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
      console.error('Lỗi lấy giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasItems = cart && cart.chiTiet && cart.chiTiet.length > 0;
  const items = cart?.chiTiet || [];

  return {
    cart,
    campaign,
    loading,
    error,
    user,
    fetchCart,
    hasItems,
    items,
  };
};

export default useCheckoutData;

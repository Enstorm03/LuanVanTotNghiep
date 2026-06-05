import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

/**
 * Trang kết quả thanh toán PayOS.
 * PayOS redirect về đây với query params:
 *   ?orderId=123&code=00&status=PAID       (thành công)
 *   ?orderId=123&code=01&status=CANCELLED  (hủy)
 */
const ThanhToanKetQuaPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const orderId = searchParams.get('orderId');

  const [checking, setChecking] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success'|'cancelled'|'pending'

  useEffect(() => {
    const verify = async () => {
      try {
        const id = parseInt(orderId);

        // Luôn hỏi BE làm nguồn sự thật — BE tự xử lý hủy đơn + hoàn kho
        const res = await api.checkPaymentStatus(id);

        if (res?.status === 'PAID') {
          setPaymentStatus('success');
          // Xóa giỏ hàng sau khi thanh toán thành công
          if (user?.id_nguoi_dung) {
            try { await api.clearCart(user.id_nguoi_dung); } catch {}
          }
        } else if (res?.status === 'CANCELLED' || res?.status === 'EXPIRED') {
          setPaymentStatus('cancelled');
          // BE đã tự hủy đơn + hoàn kho trong checkPaymentStatus, FE không cần làm gì thêm
        } else {
          setPaymentStatus('pending');
        }
      } catch {
        setPaymentStatus('pending');
      } finally {
        setChecking(false);
      }
    };

    if (orderId) {
      verify();
    } else {
      setPaymentStatus('pending');
      setChecking(false);
    }
  }, [orderId, user]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="bg-white dark:bg-content-dark rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

        {/* ── Thành công ── */}
        {paymentStatus === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Đơn hàng <span className="font-semibold text-gray-800 dark:text-gray-200">#{orderId}</span> đã được thanh toán.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Chúng tôi sẽ xử lý và giao hàng sớm nhất có thể.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/lich-su-don-hang"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Xem lịch sử đơn hàng
              </Link>
              <Link to="/products"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}

        {/* ── Hủy ── */}
        {paymentStatus === 'cancelled' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Thanh toán bị hủy</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Đơn hàng <span className="font-semibold text-gray-800 dark:text-gray-200">#{orderId}</span> đã bị hủy do không hoàn tất thanh toán.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Giỏ hàng của bạn vẫn còn. Bạn có thể đặt lại bất cứ lúc nào.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/cart')}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Quay lại giỏ hàng
              </button>
              <Link to="/"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Về trang chủ
              </Link>
            </div>
          </>
        )}

        {/* ── Đang xử lý ── */}
        {paymentStatus === 'pending' && (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">Đang xử lý</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Thanh toán đơn hàng <span className="font-semibold text-gray-800 dark:text-gray-200">#{orderId}</span> đang được xác nhận.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Vui lòng kiểm tra lịch sử đơn hàng sau ít phút.
            </p>
            <Link to="/lich-su-don-hang"
              className="block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Xem lịch sử đơn hàng
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default ThanhToanKetQuaPage;

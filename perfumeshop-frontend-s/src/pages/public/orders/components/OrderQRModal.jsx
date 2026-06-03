import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const PUBLIC_BASE_URL = process.env.REACT_APP_PUBLIC_URL || window.location.origin;

/**
 * Modal hiển thị mã QR để khách hàng xác nhận nhận hàng.
 * Hiện trên trang Lịch sử đơn hàng khi đơn đang giao.
 */
const OrderQRModal = ({ show, onClose, order }) => {
  const canvasRef = useRef(null);
  const qrUrl = order ? `${PUBLIC_BASE_URL}/don-hang/${order.idDonHang}/xac-nhan` : '';

  useEffect(() => {
    if (!show || !canvasRef.current || !qrUrl) return;
    QRCode.toCanvas(canvasRef.current, qrUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
  }, [show, qrUrl]);

  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xs overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold">Xác nhận nhận hàng</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            ✕
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-500">
            Đơn hàng <span className="font-bold text-gray-800">#{order.idDonHang}</span> đang trên đường đến bạn.
          </p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-white">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-xs text-gray-400">
            Quét mã QR này khi nhận hàng để{' '}
            <strong>xác nhận đã nhận</strong> hoặc{' '}
            <strong>yêu cầu đổi trả</strong>.
          </p>
        </div>

        <div className="px-6 pb-5">
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-center hover:bg-indigo-600 transition-colors text-sm"
          >
            Mở trang xác nhận
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderQRModal;

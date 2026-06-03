import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const PUBLIC_BASE_URL = process.env.REACT_APP_PUBLIC_URL || window.location.origin;

const QRDialog = ({ show, onClose, order }) => {
  const canvasRef = useRef(null);
  const printRef  = useRef(null);

  const qrUrl = order ? `${PUBLIC_BASE_URL}/don-hang/${order.idDonHang}/xac-nhan` : '';

  // Vẽ QR vào canvas khi dialog mở
  useEffect(() => {
    if (!show || !canvasRef.current || !qrUrl) return;
    QRCode.toCanvas(canvasRef.current, qrUrl, {
      width: 180,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
  }, [show, qrUrl]);

  if (!show || !order) return null;

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank', 'width=420,height=620');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Đơn hàng #${order.idDonHang}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: flex-start; padding: 20px; }
            .card { border: 2px dashed #333; border-radius: 12px; padding: 18px 20px; width: 280px; text-align: center; }
            .shop { font-size: 11px; color: #999; letter-spacing: 1px; text-transform: uppercase; }
            .order-id { font-size: 20px; font-weight: bold; margin: 4px 0 2px; }
            .info { font-size: 12px; color: #444; line-height: 1.6; margin-bottom: 10px; }
            img { width: 180px; height: 180px; }
            .caption { font-size: 11px; color: #555; margin-top: 8px; font-weight: 600; }
            .url { font-size: 8px; color: #bbb; word-break: break-all; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="card">
            <p class="shop">Enstorm Perfume</p>
            <p class="order-id">Đơn hàng #${order.idDonHang}</p>
            <div class="info">
              <div>${order.tenNguoiNhan || ''}</div>
              <div>${order.soDienThoai || ''}</div>
              <div>${order.diaChiGiaoHang || ''}</div>
            </div>
            <img src="${dataUrl}" alt="QR Code" />
            <p class="caption">Quét để xác nhận nhận hàng hoặc đổi trả</p>
            <p class="url">${qrUrl}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">QR Đơn hàng #{order.idDonHang}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex flex-col items-center gap-3" ref={printRef}>
          {/* Thông tin đơn */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-0.5 w-full">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{order.tenNguoiNhan}</p>
            <p>{order.soDienThoai}</p>
            <p className="text-xs">{order.diaChiGiaoHang}</p>
          </div>

          {/* Canvas QR */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-white">
            <canvas ref={canvasRef} />
          </div>

          <p className="text-xs text-gray-400 text-center">
            Dán tem này lên thùng hàng. Khách quét để <strong>xác nhận nhận hàng</strong> hoặc <strong>yêu cầu đổi trả</strong>.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">print</span>
            In tem QR
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRDialog;

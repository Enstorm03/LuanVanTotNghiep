import React from 'react';
import { Link } from 'react-router-dom';
import { calculateCartTotal, formatCurrency } from '../../../../../utils/checkoutCalculations';

const OrderSummary = ({
  items,
  paymentMethod,
  processing,
  onSubmitOrder,
}) => {
  const totalAmount = calculateCartTotal({ chiTiet: items });

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Tạm tính ({items.length} sản phẩm):</span>
          <span className="font-medium">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span className="font-medium text-green-600">Miễn phí</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmitOrder}
        disabled={processing}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
      >
        {processing ? 'Đang xử lý...' : 'Đặt hàng ngay'}
      </button>

      <div className="mt-4 text-center">
        <Link to="/cart" className="text-primary hover:underline text-sm">
          Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;

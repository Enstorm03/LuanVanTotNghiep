import React from 'react';
import { Link } from 'react-router-dom';
import { calculateCartTotal, calculatePreOrderTotal, calculateDepositAmount, calculateRemainingAmount, formatCurrency } from '../../../../../utils/checkoutCalculations';

const OrderSummary = ({
  items,
  isPreOrder,
  preOrderData,
  paymentMethod,
  processing,
  onSubmitOrder,
  stockCheck,
  onSubmitBackorder
}) => {
  const totalAmount = isPreOrder
    ? calculatePreOrderTotal(items)
    : calculateCartTotal({ chiTiet: items });

  const depositAmount = isPreOrder ? calculateDepositAmount(totalAmount) : 0;
  const remainingAmount = isPreOrder ? calculateRemainingAmount(totalAmount, depositAmount) : 0;
  const finalAmount = isPreOrder ? depositAmount : totalAmount;

  const backLink = isPreOrder
    ? `/product/${preOrderData?.items[0]?.id_san_pham}`
    : "/cart";

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
        {isPreOrder && (
          <div className="flex justify-between">
            <span>Đặt cọc (50%):</span>
            <span className="font-medium text-orange-600">-{formatCurrency(depositAmount)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>{isPreOrder ? 'Cần thanh toán:' : 'Tổng cộng:'}</span>
            <span className="text-primary">
              {formatCurrency(finalAmount)}
            </span>
          </div>
          {isPreOrder && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Còn lại: {formatCurrency(remainingAmount)} (thanh toán khi nhận hàng)
            </p>
          )}
        </div>
      </div>

      {/* Show out-of-stock warning if applicable */}
      {stockCheck && !stockCheck.isAllInStock && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Một số sản phẩm đã hết hàng</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                {stockCheck.outOfStockItems.map((item, index) => (
                  <li key={index}>
                    • {item.tenSanPham} (Còn lại: {item.soLuongConLai})
                  </li>
                ))}
              </ul>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                Bạn có thể đặt hàng trước và chúng tôi sẽ liên hệ khi có hàng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show appropriate buttons based on stock status */}
      {stockCheck && !stockCheck.isAllInStock ? (
        <div className="space-y-3 mt-6">
          <button
            onClick={onSubmitOrder}
            disabled={processing}
            className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Đặt hàng với sản phẩm có sẵn'}
          </button>
          <button
            onClick={onSubmitBackorder}
            disabled={processing}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {processing ? 'Đang xử lý...' : 'Đặt hàng trước (chờ nhập hàng)'}
          </button>
        </div>
      ) : (
        <button
          onClick={onSubmitOrder}
          disabled={processing}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
        >
          {processing ? 'Đang xử lý...' : (isPreOrder ? 'Đặt cọc ngay' : 'Đặt hàng ngay')}
        </button>
      )}

      <div className="mt-4 text-center">
        <Link to={backLink} className="text-primary hover:underline text-sm">
          {isPreOrder ? 'Quay lại sản phẩm' : 'Quay lại giỏ hàng'}
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;

import React from 'react';
import { Link } from 'react-router-dom';
import { calculateTotal, formatCurrency } from '../../../../../utils/cartUtils';

const CartSummary = ({ cart, campaign }) => {
  const subtotal = calculateTotal(cart);
  const discountPercent = campaign?.giamGiaHangLoat || 0;
  const discountAmount = campaign && campaign.active && discountPercent > 0 
    ? (subtotal * discountPercent) / 100 
    : 0;
  const total = Math.max(0, subtotal - discountAmount);
  
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
        <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Tạm tính ({cart.chiTiet.length} sản phẩm):</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span className="font-medium">Miễn phí</span>
          </div>
          
          {campaign && campaign.active && discountPercent > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Giảm giá ({discountPercent}%):</span>
              <span className="font-medium">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <Link
          to="/thanh-toan"
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">shopping_cart_checkout</span>
          Tiến hành thanh toán
        </Link>

        <div className="mt-4 text-center">
          <Link to="/products" className="text-primary hover:underline text-sm">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

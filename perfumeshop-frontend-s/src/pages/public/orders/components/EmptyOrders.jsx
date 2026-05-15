import React from 'react';
import { Link } from 'react-router-dom';

const EmptyOrders = () => (
  <div className="text-center py-12">
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 max-w-md mx-auto">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h3>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
        Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm!
      </p>
      <Link
        to="/products"
        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Mua sắm ngay
      </Link>
    </div>
  </div>
);

export default EmptyOrders;

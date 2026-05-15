import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl text-gray-400">shopping_cart</span>
    </div>
    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-2">
      Giỏ hàng trống
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-8">
      Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
    </p>
    <Link
      to="/products"
      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
    >
      <span className="material-symbols-outlined">shopping_bag</span>
      Tiếp tục mua sắm
    </Link>
  </div>
);

export default EmptyCart;

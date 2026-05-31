import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutHeader = () => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link to="/cart" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
        <span className="material-symbols-outlined">arrow_back</span>
      </Link>
      <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
        Thanh toán
      </h1>
    </div>
  );
};

export default CheckoutHeader;

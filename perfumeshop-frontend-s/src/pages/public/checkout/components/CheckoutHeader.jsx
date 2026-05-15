import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutHeader = ({ isPreOrder, preOrderData }) => {
  const backLink = isPreOrder
    ? `/product/${preOrderData?.items[0]?.id_san_pham}`
    : "/cart";

  const title = isPreOrder ? 'Đặt hàng trước' : 'Thanh toán';

  return (
    <div className="flex items-center gap-4 mb-8">
      <Link to={backLink} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
        <span className="material-symbols-outlined">arrow_back</span>
      </Link>
      <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
        {title}
      </h1>
    </div>
  );
};

export default CheckoutHeader;

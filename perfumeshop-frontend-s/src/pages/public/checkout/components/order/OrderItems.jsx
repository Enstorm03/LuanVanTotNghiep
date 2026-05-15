import React from 'react';
import { getOrderItemId } from '../../../../../utils/checkoutUtils';
import OrderItem from './OrderItem';

const OrderItems = ({ items, isPreOrder }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
        <p className="text-gray-500 text-center py-8">Không có sản phẩm nào trong đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng ({items.length} sản phẩm)</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div key={getOrderItemId(item, isPreOrder)} className="border-b border-gray-200 pb-2">
            <OrderItem
              item={item}
              isPreOrder={isPreOrder}
            />
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;

import React from 'react';
import OrderProductItem from './OrderProductItem';

const OrderProductsList = ({ order, productDetails, brandDetails }) => {
  // Determine which data structure to use
  let itemsToDisplay = [];

  if (order.chiTiet && order.chiTiet.length > 0) {
    itemsToDisplay = order.chiTiet;
  } else if (order.chiTietDonHangs && order.chiTietDonHangs.length > 0) {
    itemsToDisplay = order.chiTietDonHangs;
  }

  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Các sản phẩm</h3>
      <div className="space-y-4">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item, index) => (
            <OrderProductItem
              key={`order-item-${index}`}
              item={item}
              productDetails={productDetails}
              brandDetails={brandDetails}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">inventory_2</span>
            <p className="text-text-subtle-light dark:text-text-subtle-dark">
              Không có sản phẩm nào trong đơn hàng này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProductsList;

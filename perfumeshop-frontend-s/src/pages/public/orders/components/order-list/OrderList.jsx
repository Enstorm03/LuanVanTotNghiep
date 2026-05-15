import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({
  orders,
  returnStatuses,
  cancelLoading,
  onCancelOrder,
  onWriteReview,
  onRequestReturn,
  onOrderUpdate
}) => (
  <div className="space-y-6">
    {orders.map((order) => (
      <OrderCard
        key={order.idDonHang}
        order={order}
        returnStatuses={returnStatuses}
        cancelLoading={cancelLoading}
        onCancelOrder={onCancelOrder}
        onWriteReview={onWriteReview}
        onRequestReturn={onRequestReturn}
        onOrderUpdate={onOrderUpdate}
      />
    ))}
  </div>
);

export default OrderList;

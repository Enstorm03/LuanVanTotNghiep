import React from 'react';
import { getStatusClass } from '../../../../utils/orderStatus';
// file này để hiển thị badge trạng thái đơn hàng trên trang danh sách đơn hàng admin, tránh gọi API nhiều lần
const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(status)}`}>
      {status || 'N/A'}
    </span>
  );
};

export default OrderStatusBadge;

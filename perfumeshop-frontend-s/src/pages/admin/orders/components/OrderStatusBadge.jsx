import React from 'react';
import { getStatusClass } from '../../../../utils/orderStatus';

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(status)}`}>
      {status || 'N/A'}
    </span>
  );
};

export default OrderStatusBadge;

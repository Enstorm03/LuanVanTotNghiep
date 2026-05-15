import React from 'react';
import { getStockStatus } from '../../../../utils/productMapper';

const ProductStockBadge = ({ stockQuantity }) => {
  const { status, className } = getStockStatus(stockQuantity);

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
      {status}
    </span>
  );
};

export default ProductStockBadge;

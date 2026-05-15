import React from 'react';

const ProductInfo = ({ product, brandName }) => (
  <div>
    <h2 className="text-sm font-medium text-primary uppercase tracking-wide">
      {brandName}
    </h2>
    <h1 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mt-2">
      {product.ten_san_pham}
    </h1>
  </div>
);

export default ProductInfo;

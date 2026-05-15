import React from 'react';

const ProductImage = ({ product, productName }) => (
  <div className="w-full bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm p-4">
    <img
      src={product.url_hinh_anh || "https://placehold.co/600x800?text=No+Image"}
      alt={productName}
      className="w-full h-auto object-cover rounded-lg aspect-[3/4]"
    />
  </div>
);

export default ProductImage;

import React from 'react';
import ProductCard from '../../../../components/product/ProductCard';

const ProductGrid = ({ products, campaign }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id_san_pham}
        {...product}
        campaign={campaign}
      />
    ))}
  </div>
);

export default ProductGrid;

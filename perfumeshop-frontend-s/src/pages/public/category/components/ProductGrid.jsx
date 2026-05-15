import React from 'react';
import ProductCard from '../../../../components/product/ProductCard';

const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id_san_pham}
        id_san_pham={product.id_san_pham}
        ten_san_pham={product.ten_san_pham}
        gia_ban={product.gia_ban}
        url_hinh_anh={product.url_hinh_anh}
        id_thuong_hieu={product.id_thuong_hieu}
      />
    ))}
  </div>
);

export default ProductGrid;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../../utils/productUtils';

const RelatedProducts = ({ relatedProducts }) => {
  const navigate = useNavigate();

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Sản phẩm cùng thương hiệu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id_san_pham}
            className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/product/${product.id_san_pham}`)}
          >
            <img
              src={product.url_hinh_anh || "https://placehold.co/200x200?text=No+Image"}
              alt={product.ten_san_pham}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.ten_san_pham}</h3>
              <p className="text-primary font-bold">{formatPrice(product.gia_ban)}</p>
              <p className="text-xs text-gray-500 mt-1">Còn {product.so_luong_ton_kho || 0} sản phẩm</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;

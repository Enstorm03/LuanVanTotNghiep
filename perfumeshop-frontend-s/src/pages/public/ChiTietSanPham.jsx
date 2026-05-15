import React from 'react';
import { useParams } from 'react-router-dom';
import useChiTietSanPham from '../../hooks/useChiTietSanPham';
import Breadcrumbs from './product-detail/components/Breadcrumbs';
import ProductImage from './product-detail/components/ProductImage';
import ProductInfo from './product-detail/components/ProductInfo';
import QuantitySelector from './product-detail/components/QuantitySelector';
import ProductSpecs from './product-detail/components/ProductSpecs';
import ActionButtons from './product-detail/components/ActionButtons';
import ServiceFeatures from './product-detail/components/ServiceFeatures';
import RelatedProducts from './product-detail/components/RelatedProducts';
import { formatPrice } from '../../utils/productUtils';

const ChiTietSanPham = () => {
  const { id } = useParams();

  const {
    product,
    loading,
    error,
    quantity,
    cartLoading,
    relatedProducts,
    processCartAction,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    getStockStatus,
    getBrandName
  } = useChiTietSanPham(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.so_luong_ton_kho === 0;
  const brandName = getBrandName();
  const stockStatus = getStockStatus();

  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-5 sm:py-8 flex flex-1 justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">

        {/* Breadcrumbs */}
        <Breadcrumbs productName={product.ten_san_pham} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4">
          {/* Image Section */}
          <ProductImage product={product} productName={product.ten_san_pham} />

          {/* Info Section */}
          <div className="flex flex-col gap-6 py-4">
            <ProductInfo product={product} brandName={brandName} />

            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.gia_ban)}
            </p>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={updateQuantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                maxStock={product.so_luong_ton_kho}
                stockStatus={stockStatus}
              />
            )}

            <ProductSpecs product={product} brandName={brandName} isOutOfStock={isOutOfStock} />

            {product.mo_ta && (
              <div>
                <h3 className="text-lg font-bold mb-2">Mô tả sản phẩm</h3>
                <p className="text-text-subtle-light dark:text-text-subtle-dark leading-relaxed whitespace-pre-line">
                  {product.mo_ta}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <ActionButtons
              onAddToCart={() => processCartAction('add_to_cart')}
              onBuyNow={() => processCartAction('buy_now')}
              onPreOrder={() => processCartAction('pre_order')}
              cartLoading={cartLoading}
              isOutOfStock={isOutOfStock}
            />

            <ServiceFeatures />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </main>
  );
};

export default ChiTietSanPham;

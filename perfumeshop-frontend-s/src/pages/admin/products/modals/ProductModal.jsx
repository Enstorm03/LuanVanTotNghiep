import React from 'react';
import ProductForm from '../forms/ProductForm';

const ProductModal = ({ product, onClose, onSave, saving, categories, brands }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <ProductForm
          product={product}
          categories={categories}
          brands={brands}
          onSubmit={onSave}
          onCancel={onClose}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default ProductModal;

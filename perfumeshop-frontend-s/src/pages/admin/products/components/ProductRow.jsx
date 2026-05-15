import React from 'react';
import ProductStockBadge from './ProductStockBadge';

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
      <td className="p-4 align-middle font-medium text-text-light dark:text-text-dark">{product.ten_san_pham}</td>
      <td className="p-4 align-middle hidden md:table-cell">
        <ProductStockBadge stockQuantity={product.so_luong_ton_kho || 0} />
      </td>
      <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">
        {product.gia_ban ? product.gia_ban.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
      </td>
      <td className="p-4 align-middle hidden sm:table-cell text-text-subtle-light dark:text-text-subtle-dark">{product.so_luong_ton_kho || 0}</td>
      <td className="p-4 align-middle text-right">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Sửa"
          >
            <span className="material-symbols-outlined text-lg text-blue-500">edit</span>
          </button>
          <button
            onClick={() => onDelete(product.id_san_pham)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-lg text-red-500">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;

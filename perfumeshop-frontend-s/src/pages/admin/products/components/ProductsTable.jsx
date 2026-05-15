import React from 'react';
import ProductRow from './ProductRow';

const ProductsTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
            <tr className="text-text-subtle-light dark:text-text-subtle-dark">
              <th className="h-12 px-4 text-left align-middle font-medium">Tên sản phẩm</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Trạng thái</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Giá</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Tồn kho</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow
                  key={product.id_san_pham}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-text-subtle-light dark:text-text-subtle-dark">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inventory_2</span>
                    <p className="text-lg font-medium">Không có sản phẩm nào</p>
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào được tạo hoặc phù hợp với bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;

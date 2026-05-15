import React from 'react';

const ProductsFilter = ({ searchTerm, onSearchChange, categoryFilter, onCategoryFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
      <input
        type="text"
        placeholder="Tìm theo tên sản phẩm..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="form-input w-full sm:flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
        className="form-select w-full sm:w-auto rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
      >
        <option value="All">Tất cả danh mục</option>
        <option value="Nước hoa nữ">Nước hoa nữ</option>
        <option value="Nước hoa nam">Nước hoa nam</option>
        <option value="Nước hoa Unisex">Nước hoa Unisex</option>
      </select>
    </div>
  );
};

export default ProductsFilter;

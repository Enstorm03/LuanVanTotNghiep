import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBreadcrumb = ({ categoryTitle }) => (
  <div className="mb-8">
    <div className="flex flex-wrap gap-2 mb-4">
      <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary" to="/">Trang chủ</Link>
      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/</span>
      <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{categoryTitle}</span>
    </div>
  </div>
);

export default CategoryBreadcrumb;

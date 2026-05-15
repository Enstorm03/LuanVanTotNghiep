import React from 'react';

const ProductGridSkeleton = () => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
    </div>
  </div>
);

export default ProductGridSkeleton;

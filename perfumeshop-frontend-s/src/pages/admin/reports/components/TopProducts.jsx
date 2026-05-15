import React from 'react';

const TopProducts = ({ topProducts }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Sản phẩm bán chạy</h3>
      <div className="space-y-4">
        {topProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có dữ liệu bán hàng</p>
        ) : (
          topProducts.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium truncate max-w-32">{product.name}</p>
                  <p className="text-xs text-gray-500">Doanh thu: {product.revenue.toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{product.quantity}</p>
                <p className="text-xs text-gray-500">đã bán</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;

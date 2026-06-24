import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

const ProductInsights = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lowStock'); // lowStock, topSelling, slowMoving

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Lấy tất cả sản phẩm với thông tin velocity
      const data = await api.procurementGetLowStock(1000); // Lấy tất cả
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Phân loại sản phẩm
  const lowStockCritical = products.filter(p => p.soLuongTonKho < 5);
  const lowStockWarning = products.filter(p => p.soLuongTonKho >= 5 && p.soLuongTonKho < 10);
  const topSelling = products
    .filter(p => p.tocDoBan != null && p.tocDoBan > 0)
    .sort((a, b) => b.tocDoBan - a.tocDoBan)
    .slice(0, 10);
  const slowMoving = products
    .filter(p => p.tocDoBan != null && p.tocDoBan >= 0 && p.soLuongTonKho > 10)
    .sort((a, b) => a.tocDoBan - b.tocDoBan)
    .slice(0, 10);

  const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';

  const renderProduct = (product, showBadge = true) => (
    <div
      key={product.idSanPham}
      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      {product.urlHinhAnh && (
        <img
          src={product.urlHinhAnh.startsWith('http') ? product.urlHinhAnh : `http://localhost:8080${product.urlHinhAnh}`}
          alt=""
          className="w-12 h-12 rounded-lg object-cover shrink-0"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.tenSanPham}</p>
        <div className="flex items-center gap-2 text-xs mt-1">
          {showBadge && (
            <span className={`px-2 py-0.5 rounded-full font-semibold ${
              product.soLuongTonKho < 5
                ? 'bg-red-100 text-red-700'
                : product.soLuongTonKho < 10
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              Tồn: {product.soLuongTonKho}
            </span>
          )}
          {product.tocDoBan != null && (
            <span className="text-blue-600">
              📊 {product.tocDoBan.toFixed(2)} sp/ngày
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {fmt(product.giaBan)}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
          Phân tích Sản phẩm
        </h2>
        <button
          onClick={fetchProducts}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Làm mới"
        >
          <span className="material-symbols-outlined text-gray-500">refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeTab === 'lowStock'
              ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
              : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-red-200'
          }`}
          onClick={() => setActiveTab('lowStock')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cảnh báo tồn kho</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockCritical.length + lowStockWarning.length}
              </p>
            </div>
            <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="text-red-600 font-semibold">{lowStockCritical.length}</span> dưới 5 •{' '}
            <span className="text-yellow-600 font-semibold">{lowStockWarning.length}</span> dưới 10
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeTab === 'topSelling'
              ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
              : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-green-200'
          }`}
          onClick={() => setActiveTab('topSelling')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bán chạy</p>
              <p className="text-2xl font-bold text-green-600">{topSelling.length}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-green-500">trending_up</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Top {topSelling.length} sản phẩm
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeTab === 'slowMoving'
              ? 'bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700'
              : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-orange-200'
          }`}
          onClick={() => setActiveTab('slowMoving')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bán chậm</p>
              <p className="text-2xl font-bold text-orange-600">{slowMoving.length}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-orange-500">trending_down</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Cần xem xét chiến lược
          </div>
        </div>

        <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-blue-500">inventory_2</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Đang quản lý
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {activeTab === 'lowStock' && (
          <>
            {lowStockCritical.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  Cảnh báo đỏ (Dưới 5 sản phẩm) - {lowStockCritical.length} SP
                </h3>
                <div className="space-y-2">
                  {lowStockCritical.map(product => renderProduct(product))}
                </div>
              </div>
            )}

            {lowStockWarning.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">warning</span>
                  Cảnh báo vàng (Dưới 10 sản phẩm) - {lowStockWarning.length} SP
                </h3>
                <div className="space-y-2">
                  {lowStockWarning.map(product => renderProduct(product))}
                </div>
              </div>
            )}

            {lowStockCritical.length === 0 && lowStockWarning.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">check_circle</span>
                <p>Không có cảnh báo tồn kho</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'topSelling' && (
          <>
            {topSelling.length > 0 ? (
              <>
                <h3 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">star</span>
                  Top 10 Sản phẩm bán chạy nhất
                </h3>
                <div className="space-y-2">
                  {topSelling.map((product, index) => (
                    <div key={product.idSanPham} className="relative">
                      <span className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {renderProduct(product, false)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">analytics</span>
                <p>Chưa có dữ liệu bán hàng</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'slowMoving' && (
          <>
            {slowMoving.length > 0 ? (
              <>
                <h3 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">slow_motion_video</span>
                  Top 10 Sản phẩm bán chậm (Tồn kho {'>'}  10)
                </h3>
                <div className="space-y-2">
                  {slowMoving.map(product => renderProduct(product, false))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">analytics</span>
                <p>Không có sản phẩm bán chậm</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInsights;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ThuongHieuPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBrands = await api.getBrands();
        setBrands(fetchedBrands);
      } catch (err) {
        setError('Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Thương hiệu</span>
        </div>
      </div>

      {/* PageHeading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">Tất Cả Thương Hiệu</h1>
        <p className="mt-2 text-text-subtle-light dark:text-text-subtle-dark">Khám phá thế giới hương thơm từ các nhà mốt danh tiếng.</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải thương hiệu...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải thương hiệu</p>
            <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Brands Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {brands.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Không có thương hiệu nào.</p>
            </div>
          ) : (
            brands.map((brand) => (
              <Link to={`/products?brand=${brand.idThuongHieu}`} key={brand.idThuongHieu} className="group flex justify-center items-center p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark aspect-video transition-all duration-300 hover:shadow-lg hover:border-primary">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                    {brand.tenThuongHieu}
                  </h3>
                  <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark mt-1">
                    Khám phá ngay
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default ThuongHieuPage;

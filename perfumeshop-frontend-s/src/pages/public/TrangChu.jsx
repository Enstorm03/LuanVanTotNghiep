import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';

// Import ảnh local
import bannerImg from '../../assets/images/banner-home.png';
import chanelImg from '../../assets/images/unnamed.png';
import diorImg from '../../assets/images/dior.png';

// Ảnh dùng cho danh mục (không thay đổi → để ngoài tránh re-render)
const CATEGORY_IMAGES = [diorImg, chanelImg, bannerImg];

// Component Loading
const LoadingBlock = ({ text }) => (
  <div className="flex justify-center items-center py-12 text-center">
    <div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  </div>
);

// Component Error
const ErrorBlock = ({ message }) => (
  <div className="text-center py-12">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
      <p className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi tải dữ liệu</p>
      <p className="text-red-600 dark:text-red-300 text-sm">{message}</p>
    </div>
  </div>
);

const HomePage = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    brands: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch API
  const loadData = async () => {
    try {
      setLoading(true);
      const [allProducts, categories, brands] = await Promise.all([
        api.getAllProducts(),
        api.getCategories(),
        api.getBrands(),
      ]);

      setData({
        products: allProducts.slice(0, 4),
        categories,
        brands,
      });

    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const { products, categories } = data;

  return (
    <main className="flex-1 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">

      {/* === HERO BANNER === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="relative rounded-xl overflow-hidden">
          <div
            className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center items-center justify-center p-6 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${bannerImg})`
            }}
          >
            <div className="flex flex-col gap-4 max-w-3xl z-10">
              <h1 className="text-white text-4xl font-black tracking-tight md:text-6xl">
                Bộ Sưu Tập Mùa Hè 2025
              </h1>
              <p className="text-white/90 text-base md:text-lg font-medium">
                Tỏa Sáng Dưới Nắng Vàng — Giảm giá 30%.
              </p>
            </div>

            <Link
              to="/products"
              className="z-10 mt-4 h-12 px-8 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center"
            >
              Khám Phá Ngay
            </Link>
          </div>
        </div>
      </section>

      {/* === FEATURED PRODUCTS === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight px-4 pb-6">
          Sản Phẩm Bán Chạy Nhất
        </h2>

        {loading && <LoadingBlock text="Đang tải sản phẩm..." />}
        {error && <ErrorBlock message={error} />}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                Không có sản phẩm nào.
              </p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id_san_pham}
                  id_san_pham={product.id_san_pham}
                  ten_san_pham={product.ten_san_pham}
                  gia_ban={product.gia_ban}
                  url_hinh_anh={product.url_hinh_anh}
                  id_thuong_hieu={product.id_thuong_hieu}
                />
              ))
            )}
          </div>
        )}
      </section>

      {/* === CATEGORIES === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight px-4 pb-6">
          Khám Phá Theo Phong Cách
        </h2>

        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
          {categories.map((cat, idx) => (
            <Link
              key={cat.idDanhMuc}
              to={`/products?category=${cat.idDanhMuc}`}
              className="relative block rounded-lg overflow-hidden group h-64"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${CATEGORY_IMAGES[idx % CATEGORY_IMAGES.length]})` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold tracking-wide">
                  {cat.tenDanhMuc}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;

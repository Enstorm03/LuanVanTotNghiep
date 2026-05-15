import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Brands cache to avoid multiple API calls
let brandsCache = null;
let brandsPromise = null;

const getBrands = async () => {
  if (brandsCache) {
    return brandsCache;
  }
  if (brandsPromise) {
    return brandsPromise;
  }

  brandsPromise = import('../../services/api').then(async (api) => {
    try {
      const brands = await api.default.getBrands();
      brandsCache = brands;
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  });

  const brands = await brandsPromise;
  brandsCache = brands;
  return brands;
};

// ProductCard component
const ProductCard = ({ id_san_pham, ten_san_pham, gia_ban, url_hinh_anh, id_thuong_hieu }) => {
  const [brandName, setBrandName] = useState('Đang tải...');

  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const brands = await getBrands();
        const brand = brands.find(b => b.idThuongHieu === id_thuong_hieu);
        setBrandName(brand ? brand.tenThuongHieu : 'N/A');
      } catch (error) {
        console.error('Error fetching brand:', error);
        setBrandName('N/A');
      }
    };

    fetchBrandName();
  }, [id_thuong_hieu]);

  return (
    <Link to={`/product/${id_san_pham}`} className="flex flex-col gap-4 group">
      <div className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
        <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={url_hinh_anh}
            alt={ten_san_pham}
        />
      </div>
      <div className="px-2">
        <p className="text-base font-bold leading-normal">{ten_san_pham}</p>
        <p className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-normal leading-normal">{brandName}</p>
        <p className="text-primary text-sm font-bold leading-normal mt-1">{gia_ban.toLocaleString('vi-VN')}₫</p>
      </div>
    </Link>
  );
};

export default ProductCard;

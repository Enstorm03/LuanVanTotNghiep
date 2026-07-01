import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Cache thương hiệu để tránh gọi API nhiều lần
let brandsCache = null;
let brandsPromise = null;

const getBrands = async () => {
  if (brandsCache) return brandsCache;
  if (brandsPromise) return brandsPromise;
  brandsPromise = import('../../services/api').then(async (api) => {
    try {
      const brands = await api.default.getBrands();
      brandsCache = brands;
      return brands;
    } catch {
      return [];
    }
  });
  brandsCache = await brandsPromise;
  return brandsCache;
};

const ProductCard = ({
  id_san_pham,
  ten_san_pham,
  gia_ban,
  gia_hien_tai,
  url_hinh_anh,
  id_thuong_hieu,
  phan_tram_giam,
  ang_giam_gia,
  campaign,
}) => {
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    getBrands().then((brands) => {
      const brand = brands.find((b) => b.idThuongHieu === id_thuong_hieu);
      setBrandName(brand ? brand.tenThuongHieu : 'N/A');
    });
  }, [id_thuong_hieu]);

  // Kiểm tra sản phẩm có trong campaign không
  const isInCampaign = campaign?.danhSachSanPham?.some(p => p.idSanPham === id_san_pham);
  const campaignDiscount = isInCampaign ? campaign?.giamGiaHangLoat : 0;
  
  // Giá hiển thị: nếu đang sale thì dùng gia_hien_tai, không thì dùng gia_ban
  const displayPrice = ang_giam_gia && gia_hien_tai ? gia_hien_tai : gia_ban;
  const isOnSale = ang_giam_gia && phan_tram_giam > 0;
  const hasCampaignDiscount = campaignDiscount > 0;

  return (
    <Link to={`/product/${id_san_pham}`} className="flex flex-col gap-4 group">
      {/* Ảnh sản phẩm + badge giảm giá */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={url_hinh_anh}
          alt={ten_san_pham}
        />
         {isOnSale && (
           <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
             -{phan_tram_giam}%
           </span>
         )}
         {hasCampaignDiscount && !isOnSale && (
           <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
             -{campaignDiscount}%
           </span>
         )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="px-2">
        <p className="text-base font-bold leading-normal line-clamp-2">{ten_san_pham}</p>
        <p className="text-text-subtle-light dark:text-text-subtle-dark text-sm leading-normal">{brandName}</p>

        {isOnSale ? (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-primary text-sm font-bold">
              {Number(displayPrice).toLocaleString('vi-VN')}₫
            </p>
            <p className="text-gray-400 text-xs line-through">
              {Number(gia_ban).toLocaleString('vi-VN')}₫
            </p>
          </div>
        ) : (
          <p className="text-primary text-sm font-bold mt-1">
            {Number(displayPrice).toLocaleString('vi-VN')}₫
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

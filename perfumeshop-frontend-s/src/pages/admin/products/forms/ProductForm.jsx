import React, { useState } from 'react';

const ProductForm = ({ product, categories, brands, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState(
    product ? {
      tenSanPham: product.ten_san_pham || '',
      giaBan: product.gia_ban || '',
      soLuongTonKho: product.so_luong_ton_kho || 0,
      moTa: product.mo_ta || '',
      dungTichMl: product.dung_tich_ml || '',
      nongDo: product.nong_do || '',
      idDanhMuc: product.id_danh_muc || '',
      idThuongHieu: product.id_thuong_hieu || ''
    } : {
      tenSanPham: '',
      giaBan: '',
      soLuongTonKho: 0,
      moTa: '',
      dungTichMl: '',
      nongDo: '',
      idDanhMuc: '',
      idThuongHieu: ''
    }
  );
  const [imageUrl, setImageUrl] = useState(product?.url_hinh_anh || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data with image URL and proper category/brand objects
    const selectedCategory = categories?.find(cat => cat.idDanhMuc === parseInt(formData.idDanhMuc));
    const selectedBrand = brands?.find(br => br.idThuongHieu === parseInt(formData.idThuongHieu));

    const productData = {
      ...formData,
      urlHinhAnh: imageUrl, // Add the image URL
      danhMuc: selectedCategory || null, // Add full category object
      thuongHieu: selectedBrand || null, // Add full brand object
    };

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
        <input
          name="tenSanPham"
          value={formData.tenSanPham}
          onChange={handleChange}
          className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Giá bán</label>
        <input
          name="giaBan"
          type="number"
          value={formData.giaBan}
          onChange={handleChange}
          className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tồn kho</label>
        <input
          name="soLuongTonKho"
          type="number"
          value={formData.soLuongTonKho}
          onChange={handleChange}
          className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dung tích (ml)</label>
        <input
          name="dungTichMl"
          type="number"
          value={formData.dungTichMl}
          onChange={handleChange}
          className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nồng độ</label>
        <input
          name="nongDo"
          value={formData.nongDo}
          onChange={handleChange}
          className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Danh mục</label>
        <select
          name="idDanhMuc"
          value={formData.idDanhMuc}
          onChange={handleChange}
          className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          required
        >
          <option value="">Chọn danh mục</option>
          {categories?.map(category => (
            <option key={category.idDanhMuc} value={category.idDanhMuc}>
              {category.tenDanhMuc}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Thương hiệu</label>
        <select
          name="idThuongHieu"
          value={formData.idThuongHieu}
          onChange={handleChange}
          className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
          required
        >
          <option value="">Chọn thương hiệu</option>
          {brands?.map(brand => (
            <option key={brand.idThuongHieu} value={brand.idThuongHieu}>
              {brand.tenThuongHieu}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hình ảnh URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="http://..."
          className="form-input w-full rounded-lg"
        />
        {imageUrl && (
          <div className="mt-3">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full h-48 object-contain rounded-lg border"
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
              }}
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          name="moTa"
          value={formData.moTa}
          onChange={handleChange}
          rows={3}
          className="form-textarea w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
        />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onCancel} disabled={saving} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">Hủy</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

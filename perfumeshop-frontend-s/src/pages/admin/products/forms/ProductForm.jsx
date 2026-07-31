import React, { useState } from 'react';

// Chuyển datetime-local string sang ISO (BE nhận LocalDateTime)
const toISOOrNull = (val) => (val ? new Date(val).toISOString() : null);

// Chuyển ISO string sang datetime-local string (input[type=datetime-local])
const toDatetimeLocal = (iso) => {
  if (!iso) return '';
  // Cắt bỏ phần giây lẻ, giữ "yyyy-MM-ddTHH:mm"
  return iso.slice(0, 16);
};

const ProductForm = ({ product, categories, brands, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState(
    product ? {
      tenSanPham:     product.ten_san_pham || '',
      giaBan:         product.gia_ban || '',
      soLuongTonKho:  product.so_luong_ton_kho || 0,
      moTa:           product.mo_ta || '',
      dungTichMl:     product.dung_tich_ml || '',
      nongDo:         product.nong_do || '',
      idDanhMuc:      String(product.id_danh_muc || ''),
      idThuongHieu:   String(product.id_thuong_hieu || ''),
      // Giảm giá
      phanTramGiam:       product.phan_tram_giam || '',
      ngayBatDauGiam:     toDatetimeLocal(product.ngay_bat_dau_giam),
      ngayKetThucGiam:    toDatetimeLocal(product.ngay_ket_thuc_giam),
    } : {
      tenSanPham: '', giaBan: '', soLuongTonKho: 0,
      moTa: '', dungTichMl: '', nongDo: '',
      idDanhMuc: '', idThuongHieu: '',
      phanTramGiam: '', ngayBatDauGiam: '', ngayKetThucGiam: '',
    }
  );
  const [imageUrl, setImageUrl] = useState(product?.url_hinh_anh || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate giảm giá
    const pct = parseInt(formData.phanTramGiam);
    if (formData.phanTramGiam !== '' && (isNaN(pct) || pct < 1 || pct > 99)) {
      alert('Phần trăm giảm giá phải từ 1 đến 99');
      return;
    }
    if (formData.phanTramGiam && formData.ngayBatDauGiam && formData.ngayKetThucGiam) {
      if (new Date(formData.ngayBatDauGiam) >= new Date(formData.ngayKetThucGiam)) {
        alert('Ngày kết thúc phải sau ngày bắt đầu');
        return;
      }
    }

    const selectedCategory = categories?.find(c => String(c.idDanhMuc) === String(formData.idDanhMuc));
    const selectedBrand    = brands?.find(b => String(b.idThuongHieu) === String(formData.idThuongHieu));

    const productData = {
      ...formData,
      urlHinhAnh:  imageUrl,
      danhMuc:     selectedCategory || null,
      thuongHieu:  selectedBrand || null,
      // Giảm giá — gửi null nếu để trống
      phanTramGiam:    formData.phanTramGiam !== '' ? parseInt(formData.phanTramGiam) : null,
      ngayBatDauGiam:  toISOOrNull(formData.ngayBatDauGiam),
      ngayKetThucGiam: toISOOrNull(formData.ngayKetThucGiam),
    };

    onSubmit(productData);
  };

  const inputCls = 'form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm';
  const labelCls = 'block text-sm font-medium mb-1';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* ── Thông tin cơ bản ── */}
      <div>
        <label className={labelCls}>Tên sản phẩm</label>
        <input name="tenSanPham" value={formData.tenSanPham} onChange={handleChange} className={inputCls} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Giá bán (₫)</label>
          <input name="giaBan" type="number" min="0" value={formData.giaBan} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Tồn kho</label>
          <input name="soLuongTonKho" type="number" min="0" value={formData.soLuongTonKho} onChange={handleChange} className={inputCls} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Dung tích (ml)</label>
          <input name="dungTichMl" type="number" min="0" value={formData.dungTichMl} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Nồng độ</label>
          <input name="nongDo" value={formData.nongDo} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Danh mục</label>
          <select name="idDanhMuc" value={formData.idDanhMuc} onChange={handleChange} className={inputCls} required>
            <option value="">Chọn danh mục</option>
            {categories?.map(c => <option key={c.idDanhMuc} value={String(c.idDanhMuc)}>{c.tenDanhMuc}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Thương hiệu</label>
          <select name="idThuongHieu" value={formData.idThuongHieu} onChange={handleChange} className={inputCls} required>
            <option value="">Chọn thương hiệu</option>
            {brands?.map(b => <option key={b.idThuongHieu} value={String(b.idThuongHieu)}>{b.tenThuongHieu}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Hình ảnh URL</label>
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className={inputCls} />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 h-36 object-contain rounded-lg border border-border-light dark:border-border-dark"
            onError={e => { e.target.style.display = 'none'; }} />
        )}
      </div>

      <div>
        <label className={labelCls}>Mô tả</label>
        <textarea name="moTa" value={formData.moTa} onChange={handleChange} rows={3} className={inputCls} />
      </div>

      {/* ── Giảm giá ── */}
      <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
        <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
          <span>🏷️</span> Cài đặt giảm giá
        </h3>

        <div className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>
              Phần trăm giảm giá (%)
              <span className="text-gray-400 font-normal ml-1">— để trống nếu không giảm</span>
            </label>
            <div className="relative">
              <input
                name="phanTramGiam"
                type="number"
                min="1"
                max="99"
                value={formData.phanTramGiam}
                onChange={handleChange}
                placeholder="Ví dụ: 20"
                className={inputCls + ' pr-8'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
            {/* Preview giá sau giảm */}
            {formData.phanTramGiam && formData.giaBan && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Giá sau giảm:{' '}
                <strong>
                  {Math.round(Number(formData.giaBan) * (100 - Number(formData.phanTramGiam)) / 100).toLocaleString('vi-VN')}₫
                </strong>
                {' '}(gốc: {Number(formData.giaBan).toLocaleString('vi-VN')}₫)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Ngày bắt đầu</label>
              <input
                name="ngayBatDauGiam"
                type="datetime-local"
                value={formData.ngayBatDauGiam}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Ngày kết thúc</label>
              <input
                name="ngayKetThucGiam"
                type="datetime-local"
                value={formData.ngayKetThucGiam}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          {/* Nút xóa giảm giá nhanh */}
          {(formData.phanTramGiam || formData.ngayBatDauGiam || formData.ngayKetThucGiam) && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, phanTramGiam: '', ngayBatDauGiam: '', ngayKetThucGiam: '' }))}
              className="text-xs text-red-500 hover:text-red-700 self-start underline"
            >
              Xóa giảm giá
            </button>
          )}
        </div>
      </div>

      {/* ── Buttons ── */}
      <div className="flex justify-end gap-3 mt-2">
        <button type="button" onClick={onCancel} disabled={saving}
          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
          Hủy
        </button>
        <button type="submit" disabled={saving}
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

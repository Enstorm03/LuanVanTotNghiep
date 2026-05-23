import React, { useState, useEffect } from 'react';

const BrandModal = ({ brand, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    tenThuongHieu: '',
    quocGia: '',
    urlHinhAnh: ''
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        tenThuongHieu: brand.tenThuongHieu || '',
      
        urlHinhAnh: brand.urlHinhAnh || ''
      });
    } else {
      setFormData({
        tenThuongHieu: '',
        
        urlHinhAnh: ''
      });
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
            {brand ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
          <form id="brandForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                Tên thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tenThuongHieu"
                value={formData.tenThuongHieu}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark-surface dark:border-gray-700"
                placeholder="Nhập tên thương hiệu..."
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                Quốc gia
              </label>
              <input
                type="text"
               
               
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark-surface dark:border-gray-700"
                placeholder="Nhập quốc gia (nếu có)..."
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                URL Hình ảnh
              </label>
              <input
                type="text"
                name="urlHinhAnh"
                value={formData.urlHinhAnh}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark-surface dark:border-gray-700"
                placeholder="Nhập link hình ảnh..."
              />
            </div>
            
            {/* Image Preview */}
            {formData.urlHinhAnh && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Xem trước hình ảnh:</p>
                <div className="h-32 w-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                  <img
                    src={formData.urlHinhAnh}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128?text=Lỗi+Hình';
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border-light dark:border-border-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="brandForm"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                Đang lưu...
              </>
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;

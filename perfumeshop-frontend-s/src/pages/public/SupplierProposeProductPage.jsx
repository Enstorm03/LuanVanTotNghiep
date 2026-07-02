import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplier } from '../../contexts/SupplierContext';
import procurementApi from '../../services/api/procurementApi';
import { calculateMonthsToExpiry } from '../../utils/csvFormatUtils';

/**
 * Trang cho Nhà Cung Cấp tự đề xuất sản phẩm mới
 * KHÔNG cần phiếu gọi thầu — NCC có thể chủ động gửi đề nghị bán hàng.
 * Tự động điền thông tin NCC nếu đã đăng nhập.
 */
const SupplierProposeProductPage = () => {
  const navigate = useNavigate();
  const { supplier } = useSupplier();

  const [formData, setFormData] = useState({
    tenNCC: '',
    lienHeNCC: '',
    tenSanPham: '',
    moTa: '',
    urlHinhAnh: '',
    giaDeXuat: '',
    soLuongCoTheCungCap: '',
    dungTichMl: '',
    nongDo: '',
    hanSuDung: '',
    soLo: '',
    ghiChu: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState({});

  // Tự động điền thông tin NCC từ context nếu đã đăng nhập
  useEffect(() => {
    if (supplier) {
      setFormData((prev) => ({
        ...prev,
        tenNCC: supplier.tenNCC || supplier.tenCongTy || '',
        lienHeNCC: supplier.lienHe || supplier.email || supplier.sdt || '',
      }));
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Kiểm tra cảnh báo HSD
    if (name === 'hanSuDung' && value) {
      const months = calculateMonthsToExpiry(value);
      if (months !== null && months < 6) {
        setWarnings((prev) => ({
          ...prev,
          hanSuDung: `⚠️ Hạn sử dụng quá ngắn (${months} tháng). Vui lòng xác nhận lại!`,
        }));
      } else {
        setWarnings((prev) => ({ ...prev, hanSuDung: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.tenNCC.trim() || !formData.tenSanPham.trim()) {
      setError('Vui lòng nhập tên nhà cung cấp và tên sản phẩm');
      return;
    }

    // Kiểm tra HSD không được trong quá khứ
    if (formData.hanSuDung) {
      const selectedDate = new Date(formData.hanSuDung);
      const today = new Date();
      if (selectedDate < today) {
        setError('Hạn sử dụng không được là ngày trong quá khứ');
        return;
      }
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        giaDeXuat: formData.giaDeXuat ? Number(formData.giaDeXuat) : null,
        soLuongCoTheCungCap: formData.soLuongCoTheCungCap ? Number(formData.soLuongCoTheCungCap) : null,
        dungTichMl: formData.dungTichMl ? Number(formData.dungTichMl) : null,
        nongDo: formData.nongDo ? Number(formData.nongDo) : null,
        hanSuDung: formData.hanSuDung || null,
        soLo: formData.soLo || null,
      };
      await procurementApi.submitIndependentProposal(payload);
      setSuccess(true);
       setFormData((prev) => ({
         ...prev,
         tenSanPham: '',
         moTa: '',
         urlHinhAnh: '',
         giaDeXuat: '',
         soLuongCoTheCungCap: '',
         dungTichMl: '',
         nongDo: '',
         hanSuDung: '',
         soLo: '',
         ghiChu: '',
       }));
       setWarnings({});
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  // Đã đăng nhập chưa?
  const isLoggedIn = !!supplier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📦 Đề xuất sản phẩm mới</h1>
          <p className="text-gray-500 mt-2">
            Gửi đề nghị bán hàng đến chúng tôi — không cần đợi phiếu gọi thầu
          </p>
          {isLoggedIn && (
            <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              ✔ Đã đăng nhập với tư cách <strong>{supplier.tenNCC || supplier.tenDangNhap}</strong>
            </div>
          )}
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-800">Đã gửi đề xuất thành công!</h2>
            <p className="text-green-600 mt-2">
              Chúng tôi sẽ xem xét và phản hồi sớm nhất. Cảm ơn bạn!
            </p>
            <button
              onClick={() => { setSuccess(false); }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Gửi đề xuất khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Thông tin NCC — tự động điền nếu đã login */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                Thông tin nhà cung cấp
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tên nhà cung cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tenNCC"
                    value={formData.tenNCC}
                    onChange={handleChange}
                    required
                    readOnly={isLoggedIn}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isLoggedIn ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300'
                    }`}
                    placeholder="Công ty TNHH XYZ"
                  />
                  {isLoggedIn && (
                    <p className="text-xs text-gray-400 mt-1">Tự động từ thông tin đăng nhập</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Liên hệ
                  </label>
                  <input
                    type="text"
                    name="lienHeNCC"
                    value={formData.lienHeNCC}
                    onChange={handleChange}
                    readOnly={isLoggedIn}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isLoggedIn ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300'
                    }`}
                    placeholder="SĐT / Email"
                  />
                  {isLoggedIn && (
                    <p className="text-xs text-gray-400 mt-1">Tự động từ thông tin đăng nhập</p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin sản phẩm đề xuất */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                Thông tin sản phẩm
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tenSanPham"
                    value={formData.tenSanPham}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tên nước hoa / sản phẩm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    name="urlHinhAnh"
                    value={formData.urlHinhAnh}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">
                       Hạn sử dụng <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="date"
                       name="hanSuDung"
                       value={formData.hanSuDung}
                       onChange={handleChange}
                       min={new Date().toISOString().split('T')[0]}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                     />
                     {warnings.hanSuDung && (
                       <p className="text-xs text-red-600 font-semibold mt-1">{warnings.hanSuDung}</p>
                     )}
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">
                       Số lô
                     </label>
                     <input
                       type="text"
                       name="soLo"
                       value={formData.soLo}
                       onChange={handleChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                       placeholder="VD: LOT-001, BATCH-2026"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">
                       Giá đề xuất (₫)
                     </label>
                    <input
                      type="number"
                      name="giaDeXuat"
                      value={formData.giaDeXuat}
                      onChange={handleChange}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Giá nhập đề xuất"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Số lượng có thể cung cấp
                    </label>
                    <input
                      type="number"
                      name="soLuongCoTheCungCap"
                      value={formData.soLuongCoTheCungCap}
                      onChange={handleChange}
                      min={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Số lượng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Dung tích (ml)
                    </label>
                    <input
                      type="number"
                      name="dungTichMl"
                      value={formData.dungTichMl}
                      onChange={handleChange}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="VD: 50, 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Nồng độ tinh dầu
                    </label>
                    <input
                      type="number"
                      name="nongDo"
                      value={formData.nongDo}
                      onChange={handleChange}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="VD: 15, 20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Ghi chú thêm
                  </label>
                  <textarea
                    name="ghiChu"
                    value={formData.ghiChu}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Thông tin thêm (nếu có)..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/procurement')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                ← Quay lại
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Đang gửi...' : '📨 Gửi đề xuất'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupplierProposeProductPage;
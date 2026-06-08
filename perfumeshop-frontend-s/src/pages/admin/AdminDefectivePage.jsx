import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫';

const AdminDefectivePage = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [exporting, setExporting] = useState(null); // id đang xử lý

  const fetchDefective = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getDefectiveProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách hàng lỗi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDefective(); }, [fetchDefective]);

  const handleExport = async (sp) => {
    const input = window.prompt(
      `Xuất trả NCC: "${sp.tenSanPham}"\n` +
      `Hiện có: ${sp.soLuongHangLoi} cái lỗi\n\n` +
      `Nhập số lượng cần xuất trả:`,
      sp.soLuongHangLoi
    );
    if (input === null) return;
    const soLuong = parseInt(input);
    if (isNaN(soLuong) || soLuong <= 0) { alert('Số lượng không hợp lệ'); return; }
    if (soLuong > sp.soLuongHangLoi) { alert(`Vượt quá số lượng hàng lỗi hiện có (${sp.soLuongHangLoi})`); return; }
    if (!window.confirm(`Xác nhận xuất ${soLuong} cái "${sp.tenSanPham}" trả nhà cung cấp?`)) return;

    try {
      setExporting(sp.idSanPham);
      await api.exportDefectiveProduct(sp.idSanPham, soLuong);
      alert('Đã ghi nhận xuất trả nhà cung cấp!');
      await fetchDefective();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setExporting(null);
    }
  };

  const totalDefective = products.reduce((s, p) => s + (p.soLuongHangLoi || 0), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchDefective} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
            Hàng lỗi / chờ trả nhà cung cấp
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hàng bị hỏng từ đổi trả khách hàng — chưa được xuất trả NCC
          </p>
        </div>
        <button
          onClick={fetchDefective}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm mới
        </button>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-600">{totalDefective}</p>
          <p className="text-xs text-red-500 mt-1">Tổng SP lỗi đang giữ</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-orange-600">{products.length}</p>
          <p className="text-xs text-orange-500 mt-1">Loại sản phẩm bị ảnh hưởng</p>
        </div>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">check_circle</span>
          <p className="text-gray-500 font-medium">Không có hàng lỗi nào đang chờ xử lý</p>
          <p className="text-gray-400 text-sm mt-1">Tất cả hàng đổi trả đều đã được xử lý hoặc hoàn kho</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-14">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Thương hiệu</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tồn kho</th>
                <th className="text-center px-4 py-3 font-semibold text-red-600">Hàng lỗi</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giá bán</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {products.map(sp => (
                <tr key={sp.id_san_pham} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-gray-400">#{sp.idSanPham}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {sp.urlHinhAnh && (
                        <img
                          src={sp.urlHinhAnh.startsWith('http') ? sp.urlHinhAnh : `http://localhost:8080${sp.urlHinhAnh}`}
                          alt={sp.tenSanPham}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{sp.tenSanPham}</p>
                        {sp.dungTichMl && <p className="text-xs text-gray-400">{sp.dungTichMl}ml</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {sp.thuongHieu?.tenThuongHieu || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium">{sp.soLuongTonKho ?? 0}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full font-bold text-sm">
                      {sp.soLuongHangLoi}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{fmt(sp.giaBan)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleExport(sp)}
                      disabled={exporting === sp.idSanPham}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors mx-auto"
                    >
                      {exporting === sp.id_san_pham
                        ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                        : <span className="material-symbols-outlined text-sm">local_shipping</span>}
                      Xuất trả NCC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400">
        * Bấm "Xuất trả NCC" sau khi đã thực tế giao hàng lỗi cho nhà cung cấp để cập nhật số liệu.
      </p>
    </div>
  );
};

export default AdminDefectivePage;

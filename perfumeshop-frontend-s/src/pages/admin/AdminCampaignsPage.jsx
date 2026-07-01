import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

/* ── helpers ── */
const fmtDate = (s) => s ? new Date(s).toLocaleString('vi-VN') : '—';

const STATUS_STYLE = {
  'Đang chạy':  'bg-green-100 text-green-800',
  'Đang chờ':   'bg-blue-100 text-blue-800',
  'Đã kết thúc':'bg-gray-100 text-gray-500',
  'Tắt':        'bg-red-100 text-red-700',
};

/* ── Modal form tạo / sửa chiến dịch ── */
const CampaignFormModal = ({ campaign, onClose, onSave, saving }) => {
  const isEdit = !!campaign?.idSuKien;
  const toInput = (dt) => dt ? dt.slice(0, 16) : '';

   const [form, setForm] = useState({
     tenSuKien:      campaign?.tenSuKien      || '',
     bannerUrl:      campaign?.bannerUrl      || '',
     ngayBatDau:     toInput(campaign?.ngayBatDau),
     ngayKetThuc:    toInput(campaign?.ngayKetThuc),
     giamGiaHangLoat: campaign?.giamGiaHangLoat || 0,
     trangThaiActive: campaign?.trangThaiActive !== false,
   });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

   const handleSubmit = (e) => {
     e.preventDefault();
     if (!form.tenSuKien.trim()) return;
     onSave({
       tenSuKien:       form.tenSuKien.trim(),
       bannerUrl:       form.bannerUrl.trim() || null,
       ngayBatDau:      form.ngayBatDau  || null,
       ngayKetThuc:     form.ngayKetThuc || null,
       giamGiaHangLoat: parseFloat(form.giamGiaHangLoat) || 0,
       trangThaiActive: form.trangThaiActive,
     });
   };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">{isEdit ? 'Sửa chiến dịch' : 'Tạo chiến dịch mới'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên chiến dịch *</label>
            <input value={form.tenSuKien} onChange={e => set('tenSuKien', e.target.value)}
              placeholder="VD: Sale Black Friday 2025"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL banner</label>
            <input value={form.bannerUrl} onChange={e => set('bannerUrl', e.target.value)}
              placeholder="https://... hoặc để trống dùng banner mặc định"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
           <div className="grid grid-cols-2 gap-3">
             <div>
               <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
               <input type="datetime-local" value={form.ngayBatDau} onChange={e => set('ngayBatDau', e.target.value)}
                 className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
               <input type="datetime-local" value={form.ngayKetThuc} onChange={e => set('ngayKetThuc', e.target.value)}
                 className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Giảm giá hàng loạt (%) <span className="text-gray-400 text-xs">- áp dụng cho tất cả sản phẩm</span></label>
             <input type="number" min="0" max="100" step="0.01" value={form.giamGiaHangLoat} onChange={e => set('giamGiaHangLoat', e.target.value)}
               placeholder="VD: 15 (15%)"
               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
           </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.trangThaiActive} onChange={e => set('trangThaiActive', e.target.checked)}
              className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm">Bật chiến dịch</span>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving || !form.tenSuKien.trim()}
              className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Modal gán sản phẩm ── */
const ProductPickerModal = ({ campaign, allProducts, onClose, onSave, saving }) => {
  const currentIds = new Set((campaign?.danhSachSanPham || []).map(sp => sp.idSanPham));
  const [selected, setSelected] = useState(new Set(currentIds));
  const [search, setSearch] = useState('');

  const toggle = (id) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const filtered = allProducts.filter(sp =>
    (sp.ten_san_pham || sp.tenSanPham || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="font-bold text-lg">Gán sản phẩm</h3>
            <p className="text-xs text-gray-500">{campaign?.tenSuKien} — đã chọn {selected.size} SP</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map(sp => {
            const id = sp.id_san_pham || sp.idSanPham;
            const name = sp.ten_san_pham || sp.tenSanPham;
            return (
              <label key={id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)}
                  className="w-4 h-4 rounded accent-primary shrink-0" />
                {sp.url_hinh_anh || sp.urlHinhAnh ? (
                  <img src={(sp.url_hinh_anh || sp.urlHinhAnh).startsWith('http')
                    ? (sp.url_hinh_anh || sp.urlHinhAnh)
                    : `http://localhost:8080${sp.url_hinh_anh || sp.urlHinhAnh}`}
                    alt={name} className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-gray-400">#{id} · Kho: {sp.so_luong_ton_kho ?? sp.soLuongTonKho ?? 0}</p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 shrink-0">
          <button onClick={() => onSave([...selected])} disabled={saving}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Đang lưu...' : `Lưu ${selected.size} sản phẩm`}
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Trang chính ── */
const AdminCampaignsPage = () => {
  const [campaigns,    setCampaigns]    = useState([]);
  const [allProducts,  setAllProducts]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [saving,       setSaving]       = useState(false);

  // Modal states
  const [formModal,    setFormModal]    = useState(null);  // null | campaign object
  const [pickerModal,  setPickerModal]  = useState(null);  // null | campaign object

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [camps, prods] = await Promise.all([
        api.getAllCampaigns(),
        api.getAllProducts(),
      ]);
      setCampaigns(Array.isArray(camps) ? camps : []);
      setAllProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      setError(err.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveCampaign = async (formData) => {
    try {
      setSaving(true);
      if (formModal?.idSuKien) {
        await api.updateCampaign(formModal.idSuKien, formData);
      } else {
        await api.createCampaign(formData);
      }
      setFormModal(null);
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProducts = async (ids) => {
    try {
      setSaving(true);
      await api.setCampaignProducts(pickerModal.idSuKien, ids);
      setPickerModal(null);
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa chiến dịch "${name}"?`)) return;
    try {
      await api.deleteCampaign(id);
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const openPicker = async (camp) => {
    // Load chi tiết để có danh sách sản phẩm hiện tại
    const detail = await api.getCampaignById(camp.idSuKien).catch(() => camp);
    setPickerModal(detail);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchData} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">Thử lại</button>
    </div>
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">Quản lý Chiến dịch</h1>
            <p className="text-sm text-gray-500 mt-0.5">Banner & sản phẩm tự động đổi theo chiến dịch đang chạy</p>
          </div>
          <button onClick={() => setFormModal({})}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base">add_circle</span>
            Tạo chiến dịch
          </button>
        </div>

        {/* Table */}
        {campaigns.length === 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">campaign</span>
            <p className="text-gray-500 font-medium">Chưa có chiến dịch nào</p>
            <p className="text-gray-400 text-sm mt-1">Tạo chiến dịch để tự động đổi banner và sản phẩm trang chủ</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tên chiến dịch</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Thời gian</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">SP</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giảm giá</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {campaigns.map(c => (
                  <tr key={c.idSuKien} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{c.tenSuKien}</p>
                      {c.bannerUrl && <p className="text-xs text-gray-400 truncate max-w-[200px]">{c.bannerUrl}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                      <div>{fmtDate(c.ngayBatDau)}</div>
                      <div>→ {fmtDate(c.ngayKetThuc)}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {c.soLuongSanPham || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.giamGiaHangLoat && c.giamGiaHangLoat > 0 ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          -{c.giamGiaHangLoat}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[c.trangThai] || 'bg-gray-100 text-gray-500'}`}>
                        {c.trangThai}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openPicker(c)} title="Gán sản phẩm"
                          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 transition-colors">
                          <span className="material-symbols-outlined text-base">shopping_bag</span>
                        </button>
                        <button onClick={() => setFormModal(c)} title="Sửa"
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(c.idSuKien, c.tenSuKien)} title="Xóa"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-400">
          * Chỉ 1 chiến dịch đang chạy tại một thời điểm. Trang chủ tự động cập nhật banner và sản phẩm theo chiến dịch active.
        </p>
      </div>

      {/* Form modal */}
      {formModal !== null && (
        <CampaignFormModal
          campaign={formModal.idSuKien ? formModal : null}
          onClose={() => setFormModal(null)}
          onSave={handleSaveCampaign}
          saving={saving}
        />
      )}

      {/* Product picker modal */}
      {pickerModal && (
        <ProductPickerModal
          campaign={pickerModal}
          allProducts={allProducts}
          onClose={() => setPickerModal(null)}
          onSave={handleSaveProducts}
          saving={saving}
        />
      )}
    </>
  );
};

export default AdminCampaignsPage;

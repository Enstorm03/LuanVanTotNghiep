import React, { useState, useEffect, useCallback } from 'react';
import supplierApi from '../../services/api/supplierApi';

/* ── Modal tạo / sửa NCC ── */
const SupplierModal = ({ ncc, onClose, onSave, saving }) => {
  const isEdit = !!ncc?.idNhaCungCap;
  const [form, setForm] = useState({
    tenCongTy:   ncc?.tenCongTy   || '',
    tenDangNhap: ncc?.tenDangNhap || '',
    matKhau:     '',
    soDienThoai: ncc?.soDienThoai || '',
    email:       ncc?.email       || '',
    diaChi:      ncc?.diaChi      || '',
    hoatDong:    ncc?.hoatDong !== false,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tenCongTy.trim() || !form.tenDangNhap.trim()) return;
    if (!isEdit && !form.matKhau.trim()) { alert('Nhập mật khẩu cho tài khoản mới'); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">{isEdit ? 'Sửa Nhà cung cấp' : 'Thêm Nhà cung cấp'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tên công ty *</label>
              <input value={form.tenCongTy} onChange={e => set('tenCongTy', e.target.value)} required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="VD: Công ty TNHH ABC" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tên đăng nhập *</label>
              <input value={form.tenDangNhap} onChange={e => set('tenDangNhap', e.target.value)} required
                disabled={isEdit}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="username" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Mật khẩu {isEdit ? '(để trống = không đổi)' : '*'}
              </label>
              <input type="password" value={form.matKhau} onChange={e => set('matKhau', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">SĐT</label>
              <input value={form.soDienThoai} onChange={e => set('soDienThoai', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0901234567" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="email@..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Địa chỉ</label>
              <input value={form.diaChi} onChange={e => set('diaChi', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Địa chỉ công ty" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.hoatDong} onChange={e => set('hoatDong', e.target.checked)}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm">Kích hoạt tài khoản</span>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
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

/* ── Trang chính ── */
const AdminSuppliersPage = () => {
  const [suppliers,  setSuppliers]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null); // null | ncc object (edit) | {} (create)
  const [saving,     setSaving]     = useState(false);

  const fetchAll = useCallback(() => {
    supplierApi.getAll()
      .then(d => setSuppliers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (modal?.idNhaCungCap) {
        await supplierApi.update(modal.idNhaCungCap, formData);
      } else {
        await supplierApi.create(formData);
      }
      setModal(null);
      fetchAll();
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, ten) => {
    if (!window.confirm(`Xóa NCC "${ten}"?`)) return;
    try { await supplierApi.remove(id); fetchAll(); }
    catch (err) { alert('Lỗi: ' + err.message); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">Nhà Cung Cấp</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tài khoản dành cho NCC đăng nhập vào cổng đấu thầu</p>
          </div>
          <button onClick={() => setModal({})}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-base">add_circle</span>
            Thêm NCC
          </button>
        </div>

        {suppliers.length === 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">business</span>
            <p className="text-gray-500">Chưa có nhà cung cấp nào</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Công ty</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Tên đăng nhập</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Liên hệ</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {suppliers.map(s => (
                  <tr key={s.idNhaCungCap} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{s.tenCongTy}</p>
                      {s.diaChi && <p className="text-xs text-gray-400 truncate max-w-[200px]">{s.diaChi}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 hidden md:table-cell">{s.tenDangNhap}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                      {s.soDienThoai && <p>{s.soDienThoai}</p>}
                      {s.email && <p>{s.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.hoatDong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                        {s.hoatDong ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setModal(s)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(s.idNhaCungCap, s.tenCongTy)}
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

        {/* Link cổng NCC */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-500">link</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Link cổng NCC</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">{window.location.origin}/procurement</p>
          </div>
          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/procurement`)}
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy
          </button>
        </div>
      </div>

      {modal !== null && (
        <SupplierModal
          ncc={modal?.idNhaCungCap ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </>
  );
};

export default AdminSuppliersPage;

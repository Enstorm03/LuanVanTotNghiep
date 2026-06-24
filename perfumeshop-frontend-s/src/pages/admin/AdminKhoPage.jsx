import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';
const fmtDate = (s) => s ? new Date(s).toLocaleString('vi-VN') : '—';

const LOAI_STYLE = {
  NHAP: 'bg-green-100 text-green-800', XUAT_BAN: 'bg-blue-100 text-blue-800',
  HOAN_KHO: 'bg-teal-100 text-teal-800', XUAT_LOI: 'bg-orange-100 text-orange-800',
  DIEU_CHINH: 'bg-purple-100 text-purple-800', HUY: 'bg-red-100 text-red-800',
};
const LOAI_LABEL = {
  NHAP: '↓ Nhập kho', XUAT_BAN: '↑ Xuất bán', HOAN_KHO: '↩ Hoàn kho',
  XUAT_LOI: '→ Xuất lỗi', DIEU_CHINH: '≈ Điều chỉnh', HUY: '✗ Hủy',
};
const PO_STYLE = {
  CHO_KHO_KIEM_TRA: 'bg-yellow-100 text-yellow-800',
  CHO_ADMIN_DUYET: 'bg-blue-100 text-blue-800',
  DA_NHAP: 'bg-green-100 text-green-800',
  BI_TU_CHOI: 'bg-red-100 text-red-800',
};
const PO_LABEL = {
  CHO_KHO_KIEM_TRA: '⏳ Chờ kho kiểm',
  CHO_ADMIN_DUYET: '🔍 Chờ admin duyệt',
  DA_NHAP: '✓ Đã nhập kho',
  BI_TU_CHOI: '✗ Bị từ chối',
};

/* ── Tab: Biến động kho ── */
const TabBienDong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    api.getBienDong().then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const filtered = data.filter(r =>
    (r.tenSanPhamSnapshot || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.loai || '').toLowerCase().includes(search.toLowerCase()) ||
    String(r.idSanPham).includes(search)
  );
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm, loại biến động..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-28">Loại</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-20">SL</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-20">Tồn sau</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Lý do</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-36">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Chưa có dữ liệu biến động kho</td></tr>
            ) : filtered.slice(0, 100).map(r => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3"><p className="font-medium text-gray-800 dark:text-gray-200">{r.tenSanPhamSnapshot || `SP #${r.idSanPham}`}</p><p className="text-xs text-gray-400">#{r.idSanPham}</p></td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LOAI_STYLE[r.loai] || 'bg-gray-100 text-gray-500'}`}>{LOAI_LABEL[r.loai] || r.loai}</span></td>
                <td className="px-4 py-3 text-center font-semibold"><span className={r.soLuong > 0 ? 'text-green-600' : 'text-red-600'}>{r.soLuong > 0 ? '+' : ''}{r.soLuong}</span></td>
                <td className="px-4 py-3 text-center">{r.tonKhoSau ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{r.lyDo || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(r.ngayTao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Tab: Bán chậm ── */
const TabBanCham = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const load = useCallback(() => {
    setLoading(true);
    api.getBanCham(days, 30).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);
  useEffect(() => { load(); }, [load]);
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">Sản phẩm còn tồn kho nhưng ít đơn trong</p>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
          {[7,14,30,60,90].map(d => <option key={d} value={d}>{d} ngày</option>)}
        </select>
        <span className="text-sm text-gray-400">({data.length} SP)</span>
      </div>
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giá bán</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tồn kho</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Đã bán ({days}N)</th>
              <th className="text-center px-4 py-3 font-semibold text-red-500">Hàng lỗi</th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {data.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Không có sản phẩm nào</td></tr>
            ) : data.map(sp => (
              <tr key={sp.idSanPham} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {sp.urlHinhAnh && <img src={sp.urlHinhAnh.startsWith('http') ? sp.urlHinhAnh : `http://localhost:8080${sp.urlHinhAnh}`} alt={sp.tenSanPham} className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" onError={e => { e.target.style.display = 'none'; }} />}
                    <div><p className="font-medium text-gray-800 dark:text-gray-200">{sp.tenSanPham}</p><p className="text-xs text-gray-400">#{sp.idSanPham}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{fmt(sp.giaBan)}</td>
                <td className="px-4 py-3 text-center"><span className={`font-semibold ${sp.soLuongTonKho < 5 ? 'text-red-600' : sp.soLuongTonKho < 10 ? 'text-orange-500' : 'text-gray-700 dark:text-gray-300'}`}>{sp.soLuongTonKho}</span></td>
                <td className="px-4 py-3 text-center"><span className={`font-semibold ${sp.tongBan === 0 ? 'text-red-600' : sp.tongBan < 3 ? 'text-orange-500' : 'text-gray-700'}`}>{sp.tongBan}</span></td>
                <td className="px-4 py-3 text-center">{sp.soLuongHangLoi > 0 ? <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{sp.soLuongHangLoi}</span> : '—'}</td>
                <td className="px-4 py-3 text-center"><Link to="/admin/products" className="text-xs text-primary hover:underline">Xem SP</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Tab: Lịch sử phiếu nhập ── */
const TabPhieuNhap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    api.listPhieuNhap().then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const showDetail = async (id) => { const ph = await api.getPhieuNhap(id).catch(() => null); if (ph) setDetail(ph); };
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  return (
    <div className="space-y-4">
      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg">Phiếu nhập {detail.maPhieu}</h3>
              <button onClick={() => setDetail(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              <p><span className="text-gray-400">Ngày nhập:</span> {fmtDate(detail.ngayNhap)}</p>
              <p><span className="text-gray-400">NCC:</span> {detail.nhaCungCap || '—'}</p>
              <p><span className="text-gray-400">Trạng thái:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PO_STYLE[detail.trangThai] || 'bg-gray-100 text-gray-500'}`}>{PO_LABEL[detail.trangThai] || detail.trangThai}</span></p>
              <p><span className="text-gray-400">Ghi chú:</span> {detail.ghiChu || '—'}</p>
              <table className="w-full mt-3 text-xs border-collapse">
                <thead><tr className="bg-gray-50 dark:bg-gray-700"><th className="text-left px-3 py-2">Sản phẩm</th><th className="text-center px-3 py-2">SL đặt</th><th className="text-center px-3 py-2">SL thực nhận</th><th className="text-right px-3 py-2">Giá nhập</th></tr></thead>
                <tbody>{(detail.chiTiet || []).map(ct => (
                  <tr key={ct.id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-3 py-2">{ct.tenSanPhamSnapshot} (#{ct.idSanPham})</td>
                    <td className="px-3 py-2 text-center font-semibold">{ct.soLuong}</td>
                    <td className="px-3 py-2 text-center font-semibold text-green-600">{ct.soLuongThucNhan ?? '—'}</td>
                    <td className="px-3 py-2 text-right">{fmt(ct.giaNhap)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mã phiếu</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Nhà cung cấp</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Ngày nhập</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {data.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">Chưa có phiếu nhập nào</td></tr>
            ) : data.filter(ph => ph.trangThai === 'DA_NHAP' || !ph.trangThai).map(ph => (
              <tr key={ph.idPhieu} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-primary">{ph.maPhieu}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{ph.nhaCungCap || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{fmtDate(ph.ngayNhap)}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PO_STYLE[ph.trangThai] || 'bg-green-100 text-green-800'}`}>{PO_LABEL[ph.trangThai] || '✓ Đã nhập'}</span></td>
                <td className="px-4 py-3 text-center"><button onClick={() => showDetail(ph.idPhieu)} className="text-xs text-primary hover:underline">Chi tiết</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Modal kiểm hàng (kho điền thông tin) ── */
const KiemHangModal = ({ po, onClose, onDone, nhanVienId }) => {
  const [rows, setRows] = useState(() =>
    (po.chiTiet || []).map(ct => ({
      idChiTiet: ct.id,
      tenSanPhamSnapshot: ct.tenSanPhamSnapshot,
      idSanPham: ct.idSanPham,
      soLuong: ct.soLuong,
      soLuongThucNhan: ct.soLuong ?? '',
      soLuongLoi: 0,
      urlHinhAnhMoi: '',
      ghiChuKho: '',
    }))
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const update = (idx, key, val) => setRows(prev => prev.map((r, i) => i === idx ? { ...r, [key]: val } : r));

  const handleSubmit = async () => {
    for (const r of rows) {
      if (r.soLuongThucNhan === '' || Number(r.soLuongThucNhan) < 0) { setErr('Số lượng thực nhận không được để trống hoặc âm'); return; }
      if (Number(r.soLuongLoi) > Number(r.soLuongThucNhan)) { setErr('Số lượng lỗi không được lớn hơn số lượng thực nhận'); return; }
    }
    try {
      setSaving(true); setErr('');
      await api.khoXacNhan(po.idPhieu, nhanVienId, rows.map(r => ({
        idChiTiet: r.idChiTiet,
        soLuongThucNhan: Number(r.soLuongThucNhan),
        soLuongLoi: Number(r.soLuongLoi),
        urlHinhAnhMoi: r.urlHinhAnhMoi || null,
        ghiChuKho: r.ghiChuKho || null,
      })));
      onDone();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div><h3 className="font-bold text-lg">Kiểm hàng — {po.maPhieu}</h3><p className="text-xs text-gray-500 mt-0.5">NCC: {po.nhaCungCap}</p></div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {rows.map((r, idx) => (
            <div key={r.idChiTiet} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{r.tenSanPhamSnapshot} <span className="text-xs text-gray-400 font-normal">#{r.idSanPham}</span></p>
              <p className="text-xs text-gray-500">SL đặt: <strong>{r.soLuong}</strong></p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SL thực nhận *</label>
                  <input type="number" min={0} value={r.soLuongThucNhan} onChange={e => update(idx, 'soLuongThucNhan', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SL lỗi</label>
                  <input type="number" min={0} value={r.soLuongLoi} onChange={e => update(idx, 'soLuongLoi', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL ảnh thực tế (nếu SP mới)</label>
                <input type="text" value={r.urlHinhAnhMoi} onChange={e => update(idx, 'urlHinhAnhMoi', e.target.value)} placeholder="https://..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú kho</label>
                <input type="text" value={r.ghiChuKho} onChange={e => update(idx, 'ghiChuKho', e.target.value)} placeholder="VD: Bao bì bị móp nhẹ..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          ))}
          {err && <p className="text-red-500 text-sm">{err}</p>}
        </div>
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 shrink-0">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            Xác nhận kiểm hàng
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Hủy</button>
        </div>
      </div>
    </div>
  );
};

/* ── Tab: PO chờ kho kiểm tra ── */
const TabPoChoKiemTra = ({ nhanVienId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.khoGetPoChoKiemTra()
      .then(d => setData(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDone = () => {
    setSelected(null);
    setToast('Đã xác nhận kiểm hàng thành công!');
    load();
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-4">
      {toast && <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">{toast}</div>}
      {selected && <KiemHangModal po={selected} onClose={() => setSelected(null)} onDone={handleDone} nhanVienId={nhanVienId} />}
      {data.length === 0 ? (
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">inventory_2</span>
          <p className="text-gray-500 font-medium">Không có PO nào đang chờ kiểm tra</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-yellow-50 dark:bg-yellow-900/20">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mã PO</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Nhà cung cấp</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">SP</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Ngày tạo</th>
                <th className="px-4 py-3 text-center w-36" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {data.map(po => (
                <tr key={po.idPhieu} className="hover:bg-yellow-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-yellow-700 dark:text-yellow-400">{po.maPhieu}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{po.nhaCungCap || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {(po.chiTiet || []).length} SP
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{fmtDate(po.ngayNhap)}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelected(po)}
                      className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
                      Kiểm hàng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ── Tab: PO chờ admin duyệt cuối ── */
const TabPoChoAdminDuyet = ({ nhanVienId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [tuChoiModal, setTuChoiModal] = useState(null);
  const [lyDo, setLyDo] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const load = useCallback(() => {
    setLoading(true);
    api.khoGetPoChoAdminDuyet()
      .then(d => setData(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDuyet = async (idPhieu) => {
    if (!window.confirm('Duyệt cuối PO này? Tồn kho và giá bán sẽ được cập nhật.')) return;
    try {
      setSaving(true);
      await api.khoAdminDuyetCuoi(idPhieu, nhanVienId);
      showToast('Đã duyệt cuối — tồn kho đã được cập nhật!');
      load();
    } catch (e) { showToast('Lỗi: ' + e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleTuChoi = async () => {
    if (!lyDo.trim()) { alert('Vui lòng nhập lý do từ chối'); return; }
    try {
      setSaving(true);
      await api.khoAdminTuChoi(tuChoiModal, lyDo.trim(), nhanVienId);
      setTuChoiModal(null); setLyDo('');
      showToast('Đã từ chối PO.', 'warning');
      load();
    } catch (e) { showToast('Lỗi: ' + e.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-4">
      {toast.msg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${toast.type === 'error' ? 'bg-red-50 border-red-300 text-red-800' : toast.type === 'warning' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-green-50 border-green-300 text-green-800'}`}>
          {toast.msg}
        </div>
      )}

      {/* Modal từ chối */}
      {tuChoiModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg">Từ chối PO</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Lý do từ chối *</label>
              <textarea value={lyDo} onChange={e => setLyDo(e.target.value)} rows={3}
                placeholder="VD: Số lượng không khớp, hàng kém chất lượng..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleTuChoi} disabled={saving}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                Xác nhận từ chối
              </button>
              <button onClick={() => { setTuChoiModal(null); setLyDo(''); }}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg">Báo cáo kho — {detail.maPhieu}</h3>
              <button onClick={() => setDetail(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              <p><span className="text-gray-400">NCC:</span> {detail.nhaCungCap || '—'}</p>
              <p><span className="text-gray-400">Giá bán dự kiến:</span> <span className="font-semibold text-green-600">{fmt(detail.giaBanChot)}</span></p>
              <table className="w-full mt-2 text-xs border-collapse">
                <thead><tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left px-3 py-2">Sản phẩm</th>
                  <th className="text-center px-3 py-2">SL đặt</th>
                  <th className="text-center px-3 py-2">SL thực nhận</th>
                  <th className="text-center px-3 py-2">SL lỗi</th>
                  <th className="text-left px-3 py-2">Ghi chú kho</th>
                </tr></thead>
                <tbody>
                  {(detail.chiTiet || []).map(ct => (
                    <tr key={ct.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-3 py-2">
                        <p>{ct.tenSanPhamSnapshot}</p>
                        {ct.urlHinhAnhMoi && <p className="text-indigo-500 text-xs mt-0.5">📷 Có ảnh mới</p>}
                      </td>
                      <td className="px-3 py-2 text-center">{ct.soLuong}</td>
                      <td className="px-3 py-2 text-center font-semibold text-green-600">{ct.soLuongThucNhan ?? '—'}</td>
                      <td className="px-3 py-2 text-center">{ct.soLuongLoi > 0 ? <span className="text-red-500 font-semibold">{ct.soLuongLoi}</span> : '—'}</td>
                      <td className="px-3 py-2 text-gray-500">{ct.ghiChuKho || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-3 pt-3">
                <button onClick={() => { setDetail(null); handleDuyet(detail.idPhieu); }} disabled={saving}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
                  ✓ Duyệt cuối — Cộng kho
                </button>
                <button onClick={() => { setDetail(null); setTuChoiModal(detail.idPhieu); }}
                  className="flex-1 bg-red-100 text-red-700 py-2.5 rounded-xl font-semibold hover:bg-red-200 transition-colors">
                  ✗ Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">task_alt</span>
          <p className="text-gray-500 font-medium">Không có PO nào đang chờ duyệt</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 dark:bg-blue-900/20">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mã PO</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">NCC</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giá bán dự kiến</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Ngày</th>
                <th className="px-4 py-3 text-center w-48" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {data.map(po => (
                <tr key={po.idPhieu} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700 dark:text-blue-400">{po.maPhieu}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{po.nhaCungCap || '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">{fmt(po.giaBanChot)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{fmtDate(po.ngayNhap)}</td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button onClick={() => setDetail(po)} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors">Xem báo cáo</button>
                    <button onClick={() => handleDuyet(po.idPhieu)} disabled={saving}
                      className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors">Duyệt</button>
                    <button onClick={() => setTuChoiModal(po.idPhieu)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ── Trang chính ── */
const AdminKhoPage = () => {
  const { user } = useAuth();
  const nhanVienId = user?.id_nhan_vien || user?.id || null;
  const [tab, setTab] = useState('po-kiem-tra');

  const tabs = [
    { id: 'po-kiem-tra',    label: 'PO chờ kiểm tra',    icon: 'inventory_2',   badge: true },
    { id: 'po-admin-duyet', label: 'Chờ admin duyệt',    icon: 'fact_check',    badge: true },
    { id: 'bien-dong',      label: 'Biến động kho',       icon: 'history'       },
    // { id: 'ban-cham',       label: 'Bán chậm',            icon: 'trending_down' },
    { id: 'phieu-nhap',     label: 'Lịch sử nhập kho',   icon: 'receipt'       },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">Quản lý Kho</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kiểm tra hàng nhập · Duyệt PO · Lịch sử biến động</p>
        </div>
        <a href="/admin/import-kho"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-base">upload_file</span>
          Nhập kho CSV/Excel
        </a>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white dark:bg-gray-600 shadow text-text-light dark:text-text-dark'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'po-kiem-tra'    && <TabPoChoKiemTra nhanVienId={nhanVienId} />}
      {tab === 'po-admin-duyet' && <TabPoChoAdminDuyet nhanVienId={nhanVienId} />}
      {tab === 'bien-dong'      && <TabBienDong />}
      {tab === 'ban-cham'       && <TabBanCham />}
      {tab === 'phieu-nhap'     && <TabPhieuNhap />}
    </div>
  );
};

export default AdminKhoPage;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';
const fmtDate = (s) => s ? new Date(s).toLocaleString('vi-VN') : '—';

const LOAI_STYLE = {
  NHAP:       'bg-green-100 text-green-800',
  XUAT_BAN:   'bg-blue-100 text-blue-800',
  HOAN_KHO:   'bg-teal-100 text-teal-800',
  XUAT_LOI:   'bg-orange-100 text-orange-800',
  DIEU_CHINH: 'bg-purple-100 text-purple-800',
  HUY:        'bg-red-100 text-red-800',
};
const LOAI_LABEL = {
  NHAP:       '↓ Nhập kho',
  XUAT_BAN:   '↑ Xuất bán',
  HOAN_KHO:   '↩ Hoàn kho',
  XUAT_LOI:   '→ Xuất lỗi',
  DIEU_CHINH: '≈ Điều chỉnh',
  HUY:        '✗ Hủy',
};

/* ── Tab: Lịch sử biến động ── */
const TabBienDong = () => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

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
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{r.tenSanPhamSnapshot || `SP #${r.idSanPham}`}</p>
                  <p className="text-xs text-gray-400">#{r.idSanPham}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${LOAI_STYLE[r.loai] || 'bg-gray-100 text-gray-500'}`}>
                    {LOAI_LABEL[r.loai] || r.loai}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">
                  <span className={r.soLuong > 0 ? 'text-green-600' : 'text-red-600'}>
                    {r.soLuong > 0 ? '+' : ''}{r.soLuong}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{r.tonKhoSau ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{r.lyDo || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(r.ngayTao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 100 && <p className="text-xs text-gray-400 text-center">Hiển thị 100/{filtered.length} bản ghi. Dùng tìm kiếm để lọc.</p>}
    </div>
  );
};

/* ── Tab: Thống kê bán chậm ── */
const TabBanCham = () => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [days,    setDays]    = useState(30);

  const fetch = useCallback(() => {
    setLoading(true);
    api.getBanCham(days, 30).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">Sản phẩm còn tồn kho nhưng ít đơn trong</p>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value={7}>7 ngày</option>
          <option value={14}>14 ngày</option>
          <option value={30}>30 ngày</option>
          <option value={60}>60 ngày</option>
          <option value={90}>90 ngày</option>
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
                    {sp.urlHinhAnh && (
                      <img src={sp.urlHinhAnh.startsWith('http') ? sp.urlHinhAnh : `http://localhost:8080${sp.urlHinhAnh}`}
                        alt={sp.tenSanPham} className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                        onError={e => { e.target.style.display = 'none'; }} />
                    )}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{sp.tenSanPham}</p>
                      <p className="text-xs text-gray-400">#{sp.idSanPham}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{fmt(sp.giaBan)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${sp.soLuongTonKho < 5 ? 'text-red-600' : sp.soLuongTonKho < 10 ? 'text-orange-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {sp.soLuongTonKho}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${sp.tongBan === 0 ? 'text-red-600' : sp.tongBan < 3 ? 'text-orange-500' : 'text-gray-700'}`}>
                    {sp.tongBan}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {sp.soLuongHangLoi > 0 ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{sp.soLuongHangLoi}</span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link to={`/admin/products`}
                    className="text-xs text-primary hover:underline">Xem SP</Link>
                </td>
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
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail,  setDetail]  = useState(null);

  useEffect(() => {
    api.listPhieuNhap().then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const showDetail = async (id) => {
    const ph = await api.getPhieuNhap(id).catch(() => null);
    if (ph) setDetail(ph);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-4">
      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="font-bold text-lg">Phiếu nhập {detail.maPhieu}</h3>
              <button onClick={() => setDetail(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              <p><span className="text-gray-400">Ngày nhập:</span> {fmtDate(detail.ngayNhap)}</p>
              <p><span className="text-gray-400">NCC:</span> {detail.nhaCungCap || '—'}</p>
              <p><span className="text-gray-400">Ghi chú:</span> {detail.ghiChu || '—'}</p>
              <table className="w-full mt-3 text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left px-3 py-2">Sản phẩm</th>
                    <th className="text-center px-3 py-2">SL</th>
                    <th className="text-right px-3 py-2">Giá nhập</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.chiTiet || []).map(ct => (
                    <tr key={ct.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-3 py-2">{ct.tenSanPhamSnapshot} (#{ct.idSanPham})</td>
                      <td className="px-3 py-2 text-center font-semibold">{ct.soLuong}</td>
                      <td className="px-3 py-2 text-right">{fmt(ct.giaNhap)}</td>
                    </tr>
                  ))}
                </tbody>
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
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Chưa có phiếu nhập nào</td></tr>
            ) : data.map(ph => (
              <tr key={ph.idPhieu} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-primary">{ph.maPhieu}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{ph.nhaCungCap || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{fmtDate(ph.ngayNhap)}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => showDetail(ph.idPhieu)}
                    className="text-xs text-primary hover:underline">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Trang chính ── */
const AdminKhoPage = () => {
  const [tab, setTab] = useState('bien-dong');
  const tabs = [
    { id: 'bien-dong', label: 'Biến động kho',   icon: 'history' },
    { id: 'ban-cham',  label: 'Bán chậm',         icon: 'trending_down' },
    { id: 'phieu-nhap',label: 'Lịch sử nhập kho', icon: 'receipt' },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">Quản lý Kho</h1>
        </div>
        <Link to="/admin/import-kho"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-base">upload_file</span>
          Nhập kho CSV/Excel
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit">
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

      {tab === 'bien-dong'  && <TabBienDong />}
      {tab === 'ban-cham'   && <TabBanCham />}
      {tab === 'phieu-nhap' && <TabPhieuNhap />}
    </div>
  );
};

export default AdminKhoPage;

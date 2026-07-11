import { useState, useCallback, useEffect } from 'react';
import loginLogApi from '../../services/api/loginLogApi';

const ROLE_LABELS = {
  ADMIN:           'Admin Root',
  DIRECTOR:        'Giám đốc',
  STORE_MANAGER:   'Cửa hàng trưởng',
  WAREHOUSE_STAFF: 'Nhân viên kho',
  SUPPLIER:        'Nhà cung cấp',
  CUSTOMER:        'Khách hàng',
};

const ROLES = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'ADMIN',           label: 'Admin Root' },
  { value: 'DIRECTOR',        label: 'Giám đốc' },
  { value: 'STORE_MANAGER',   label: 'Cửa hàng trưởng' },
  { value: 'WAREHOUSE_STAFF', label: 'Nhân viên kho' },
  { value: 'SUPPLIER',        label: 'Nhà cung cấp' },
];

const PAGE_SIZE = 20;

export default function AdminLoginLogsPage() {
  // ── Filters ──────────────────────────────────────────────
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [vaiTro,      setVaiTro]      = useState('');
  const [trangThai,   setTrangThai]   = useState('');
  const [tuNgay,      setTuNgay]      = useState('');
  const [denNgay,     setDenNgay]     = useState('');

  // ── Data ─────────────────────────────────────────────────
  const [logs,        setLogs]        = useState([]);
  const [page,        setPage]        = useState(0);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // ── Fetch ─────────────────────────────────────────────────
  const fetchLogs = useCallback(async (p = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await loginLogApi.getLogs({
        tenDangNhap: tenDangNhap.trim() || undefined,
        vaiTro:      vaiTro      || undefined,
        trangThai:   trangThai   || undefined,
        tuNgay:      tuNgay      || undefined,
        denNgay:     denNgay     || undefined,
        page: p,
        size: PAGE_SIZE,
      });
      setLogs(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
      setPage(p);
    } catch (e) {
      setError(e.message || 'Không thể tải log đăng nhập');
    } finally {
      setLoading(false);
    }
  }, [tenDangNhap, vaiTro, trangThai, tuNgay, denNgay]);

  useEffect(() => {
    fetchLogs(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(0);
  };

  const handleReset = () => {
    setTenDangNhap('');
    setVaiTro('');
    setTrangThai('');
    setTuNgay('');
    setDenNgay('');
    // fetch sẽ chạy lại khi state reset xong — dùng trực tiếp API với params rỗng
    setTimeout(() => fetchLogs(0), 0);
  };

  // ── Helpers ───────────────────────────────────────────────
  const statusBadge = (status) =>
    status === 'SUCCESS'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';

  const roleBadge = (role) => {
    const map = {
      ADMIN:           'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      DIRECTOR:        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      STORE_MANAGER:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      WAREHOUSE_STAFF: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      SUPPLIER:        'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    };
    return map[role] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Log Đăng Nhập
          </h1>
          <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark mt-0.5">
            Giám sát lịch sử đăng nhập của toàn hệ thống
          </p>
        </div>
        <button
          onClick={() => fetchLogs(page)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <form
        onSubmit={handleSearch}
        className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Tên đăng nhập */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-subtle-light dark:text-text-subtle-dark">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={e => setTenDangNhap(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Vai trò */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-subtle-light dark:text-text-subtle-dark">
              Vai trò
            </label>
            <select
              value={vaiTro}
              onChange={e => setVaiTro(e.target.value)}
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-subtle-light dark:text-text-subtle-dark">
              Trạng thái
            </label>
            <select
              value={trangThai}
              onChange={e => setTrangThai(e.target.value)}
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả</option>
              <option value="SUCCESS">Thành công</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>

          {/* Từ ngày */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-subtle-light dark:text-text-subtle-dark">
              Từ ngày
            </label>
            <input
              type="date"
              value={tuNgay}
              onChange={e => setTuNgay(e.target.value)}
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Đến ngày */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-subtle-light dark:text-text-subtle-dark">
              Đến ngày
            </label>
            <input
              type="date"
              value={denNgay}
              onChange={e => setDenNgay(e.target.value)}
              className="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">search</span>
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors"
          >
            <span className="material-symbols-outlined text-base">filter_alt_off</span>
            Xóa lọc
          </button>
        </div>
      </form>

      {/* Tổng số kết quả */}
      {!loading && !error && (
        <p className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
          Tìm thấy <span className="font-semibold text-text-light dark:text-text-dark">{totalElements}</span> bản ghi
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Bảng */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">Thời gian</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">Tên đăng nhập</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">Họ tên</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">Vai trò</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">IP</th>
                <th className="text-left px-4 py-3 font-medium text-text-subtle-light dark:text-text-subtle-dark">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-subtle-light dark:text-text-subtle-dark">
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-subtle-light dark:text-text-subtle-dark">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl opacity-40">manage_search</span>
                      <span>Không có dữ liệu log</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <td className="px-4 py-3 text-text-subtle-light dark:text-text-subtle-dark tabular-nums">
                      {page * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-text-light dark:text-text-dark">
                      {log.thoiGian}
                    </td>
                    <td className="px-4 py-3 font-medium text-text-light dark:text-text-dark whitespace-nowrap">
                      {log.tenDangNhap}
                    </td>
                    <td className="px-4 py-3 text-text-light dark:text-text-dark whitespace-nowrap">
                      {log.hoTen || <span className="text-text-subtle-light dark:text-text-subtle-dark italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {log.vaiTro ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge(log.vaiTro)}`}>
                          {ROLE_LABELS[log.vaiTro] || log.vaiTro}
                        </span>
                      ) : (
                        <span className="text-text-subtle-light dark:text-text-subtle-dark italic text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(log.trangThai)}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          {log.trangThai === 'SUCCESS' ? 'check_circle' : 'cancel'}
                        </span>
                        {log.trangThai === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-subtle-light dark:text-text-subtle-dark whitespace-nowrap">
                      {log.ipAddress || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-subtle-light dark:text-text-subtle-dark max-w-xs truncate">
                      {log.lyDoThatBai || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-light dark:border-border-dark">
            <span className="text-sm text-text-subtle-light dark:text-text-subtle-dark">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => fetchLogs(0)}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang đầu"
              >
                <span className="material-symbols-outlined text-base">first_page</span>
              </button>
              <button
                onClick={() => fetchLogs(page - 1)}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const p2 = start + i;
                return (
                  <button
                    key={p2}
                    onClick={() => fetchLogs(p2)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      p2 === page
                        ? 'bg-primary text-white'
                        : 'hover:bg-background-light dark:hover:bg-background-dark text-text-light dark:text-text-dark'
                    }`}
                  >
                    {p2 + 1}
                  </button>
                );
              })}

              <button
                onClick={() => fetchLogs(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang sau"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
              <button
                onClick={() => fetchLogs(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Trang cuối"
              >
                <span className="material-symbols-outlined text-base">last_page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

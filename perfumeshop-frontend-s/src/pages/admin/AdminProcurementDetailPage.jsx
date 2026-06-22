import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';

const TRANG_THAI_STYLE = {
  CHO_DUYET:  'bg-yellow-100 text-yellow-800',
  TRUNG_THAU: 'bg-green-100 text-green-800',
  ROT_THAU:   'bg-gray-100 text-gray-400 line-through',
};
const TRANG_THAI_LABEL = {
  CHO_DUYET:  'Chờ duyệt',
  TRUNG_THAU: '🏆 Trúng thầu',
  ROT_THAU:   'Rớt thầu',
};

/* ── Modal chốt thầu ── */
const ChooseOfferModal = ({ baoGia, onClose, onConfirm, saving }) => {
  const [pct, setPct] = useState('20');
  const giaNhap = Number(baoGia.giaNhapDeXuat || 0);
  const giaBan  = Math.round(giaNhap * (1 + (parseFloat(pct) || 0) / 100));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">Chốt thầu & Cấu hình giá</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-indigo-800 dark:text-indigo-200">{baoGia.tenNCC}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Giá chào: <strong className="text-gray-900 dark:text-gray-100">{fmt(baoGia.giaNhapDeXuat)}</strong>
            </p>
            {baoGia.ghiChu && <p className="text-gray-400 italic text-xs">{baoGia.ghiChu}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">% Biên độ lợi nhuận</label>
            <div className="flex items-center gap-2">
              <input type="number" value={pct} onChange={e => setPct(e.target.value)} min={0} step={1}
                className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-center bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
              <span className="text-gray-400 text-sm">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {fmt(giaNhap)} × (1 + {pct || 0}%) = <strong className="text-green-600">{fmt(giaBan)}</strong>
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-xs text-yellow-800 dark:text-yellow-200">
            ⚠ Sau khi chốt: tất cả sản phẩm trong đợt sẽ được cập nhật giá bán mới và cộng kho.
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={() => onConfirm(parseFloat(pct) || 0)} disabled={saving}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
            Xác nhận chốt thầu
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Row hiển thị sản phẩm đề xuất (kèm nút duyệt/từ chối) ── */
const ProposedProductRow = ({ spdx, onRefresh, phieuId, daDong }) => {
  const [expanded, setExpanded] = useState(false);
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [giaBan, setGiaBan] = useState(spdx.giaDeXuat || 0);

  const handleApprove = async () => {
    try {
      setApprovalSubmitting(true);
      await api.procurementApproveProposedProduct(spdx.idSanPhamDeXuat, {
        ghiChuDuyet: approvalNote,
        giaBan: giaBan,
        phieuGoiThauId: phieuId,
      });
      await onRefresh();
    } catch (err) {
      alert('Lỗi duyệt: ' + err.message);
    } finally {
      setApprovalSubmitting(false);
      setShowApproveForm(false);
    }
  };

  const handleReject = async () => {
    try {
      setApprovalSubmitting(true);
      await api.procurementRejectProposedProduct(spdx.idSanPhamDeXuat, {
        ghiChuTuChoi: approvalNote,
      });
      await onRefresh();
    } catch (err) {
      alert('Lỗi từ chối: ' + err.message);
    } finally {
      setApprovalSubmitting(false);
      setShowRejectForm(false);
    }
  };

  const trangThai = spdx.trangThai || 'CHO_DUYET';
  const statusLabel = {
    CHO_DUYET: '⏳ Chờ duyệt',
    DA_DUYET:  '✅ Đã duyệt',
    DA_TU_CHOI: '❌ Đã từ chối',
  };
  const statusStyle = {
    CHO_DUYET:  'bg-yellow-100 text-yellow-800',
    DA_DUYET:  'bg-green-100 text-green-800',
    DA_TU_CHOI: 'bg-red-100 text-red-600',
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[trangThai] || 'bg-gray-100 text-gray-500'}`}>
              {statusLabel[trangThai] || trangThai}
            </span>
            <p className="font-semibold text-text-light dark:text-text-dark truncate">{spdx.tenSanPham}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Đề xuất bởi: <strong>{spdx.tenNCC}</strong>
            {spdx.lienHeNCC && ` · ${spdx.lienHeNCC}`}
          </p>
          {spdx.moTa && <p className="text-xs text-gray-500 mt-1 italic">{spdx.moTa}</p>}
          <div className="flex flex-wrap gap-3 mt-2 text-xs">
            {spdx.giaDeXuat != null && <span>💰 Giá đề xuất: <strong>{fmt(spdx.giaDeXuat)}</strong></span>}
            {spdx.soLuongCoTheCungCap != null && <span>📦 Có thể CC: <strong>{spdx.soLuongCoTheCungCap}</strong></span>}
            {spdx.dungTichMl != null && <span>🧪 Dung tích: <strong>{spdx.dungTichMl}ml</strong></span>}
          </div>
          {spdx.ghiChu && <p className="text-xs text-gray-400 mt-1">📝 {spdx.ghiChu}</p>}
          {spdx.ghiChuDuyet && <p className="text-xs text-blue-500 mt-1">📋 Ghi chú duyệt: {spdx.ghiChuDuyet}</p>}
          {spdx.ghiChuTuChoi && <p className="text-xs text-red-500 mt-1">📋 Lý do từ chối: {spdx.ghiChuTuChoi}</p>}
        </div>
      </div>

      {/* Actions */}
      {!daDong && trangThai === 'CHO_DUYET' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => setShowApproveForm(true)}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Duyệt + Tạo SP
          </button>
          <button onClick={() => setShowRejectForm(true)}
            className="px-3 py-1.5 bg-red-400 text-white text-xs font-semibold rounded-lg hover:bg-red-500 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Từ chối
          </button>
        </div>
      )}

      {/* Approve form */}
      {showApproveForm && (
        <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">Xác nhận duyệt sản phẩm đề xuất</p>
          <div>
            <label className="block text-xs font-medium mb-1">Giá bán dự kiến (VNĐ)</label>
            <input type="number" value={giaBan} onChange={e => setGiaBan(Number(e.target.value))} min={0}
              className="w-48 border border-green-300 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Ghi chú duyệt</label>
            <input value={approvalNote} onChange={e => setApprovalNote(e.target.value)}
              placeholder="Ghi chú (không bắt buộc)..."
              className="w-full border border-green-300 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleApprove} disabled={approvalSubmitting}
              className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
              {approvalSubmitting ? 'Đang xử lý...' : 'Xác nhận duyệt'}
            </button>
            <button onClick={() => setShowApproveForm(false)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Reject form */}
      {showRejectForm && (
        <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-red-800 dark:text-red-200">Từ chối sản phẩm đề xuất</p>
          <div>
            <label className="block text-xs font-medium mb-1">Lý do từ chối</label>
            <textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} rows={2}
              placeholder="Nhập lý do từ chối..."
              className="w-full border border-red-300 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleReject} disabled={approvalSubmitting}
              className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {approvalSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </button>
            <button onClick={() => setShowRejectForm(false)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Trang chính ── */
const AdminProcurementDetailPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [phieu,    setPhieu]    = useState(null);
  const [baoGias,  setBaoGias]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [choosing, setChoosing] = useState(null); // BaoGiaNCC đang chốt
  const [saving,   setSaving]   = useState(false);

  // ── Sản phẩm đề xuất ──
  const [sanPhamDeXuats, setSanPhamDeXuats] = useState([]);
  const [loadingDeXuat, setLoadingDeXuat] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }
    try {
      const [p, bg, spdx] = await Promise.all([
        api.procurementGetDetail(id),
        api.procurementGetOffers(id),
        api.procurementGetProposedProductsOfRequest(id),
      ]);
      setPhieu(p);
      setBaoGias(Array.isArray(bg) ? bg : []);
      setSanPhamDeXuats(Array.isArray(spdx) ? spdx : []);
    } catch (err) {
      console.error('Lỗi tải phiếu gọi thầu:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirm = async (pct) => {
    try {
      setSaving(true);
      await api.procurementChooseOffer(
        id,
        choosing.idBaoGia,
        pct,
        user?.id_nhan_vien || user?.id || 1
      );
      setChoosing(null);
      await fetchData();
      alert('Chốt thầu thành công! Kho và giá bán đã được cập nhật.');
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  if (!phieu) return <div className="p-8 text-center text-red-500">Không tìm thấy phiếu gọi thầu</div>;

  const daDong = phieu.trangThai === 'CLOSED';
  // Field names từ entity PhieuGoiThau (tiếng Việt)
  const danhSachSanPham = phieu.danhSachSanPham || [];

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/procurement')}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
              {phieu.maPhieu}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {phieu.ghiChu || ''}
              {phieu.hanChot ? ` · Hạn: ${phieu.hanChot}` : ''}
              {' · '}
              <span className={`font-semibold ${daDong ? 'text-gray-500' : 'text-green-600'}`}>
                {daDong ? '✓ Đã chốt thầu' : '🟢 Đang nhận báo giá'}
              </span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Sản phẩm cần nhập */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-base">inventory_2</span>
              Sản phẩm cần nhập ({danhSachSanPham.length})
            </h3>
            <div className="space-y-2">
              {danhSachSanPham.map(ct => (
                <div key={ct.idChiTiet}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium">{ct.tenSanPhamSnapshot}</p>
                    <p className="text-xs text-gray-400">
                      Tồn hiện tại: {ct.tonKhoHienTai ?? '?'} · Giá hiện tại: {fmt(ct.giaBanHienTai)}
                    </p>
                    {ct.ghiChu && <p className="text-xs text-gray-400 italic">{ct.ghiChu}</p>}
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold shrink-0 ml-2">
                    Cần: {ct.soLuongCanNhap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link NCC */}
          {!daDong && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">link</span>
                Gửi link cho Nhà cung cấp
              </h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-3">
                NCC truy cập trang này để xem yêu cầu và chào giá:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                {window.location.origin}/procurement/{id}
              </div>
              <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/procurement/${id}`)}
                className="mt-2 text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy link
              </button>
            </div>
          )}
        </div>

        {/* Bảng báo giá */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-base">gavel</span>
              Báo giá từ Nhà cung cấp ({baoGias.length})
            </h3>
          </div>
          {baoGias.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="material-symbols-outlined text-3xl block mb-2">hourglass_empty</span>
              Chưa có báo giá nào. Gửi link cho NCC để nhận báo giá.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nhà cung cấp</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Liên hệ</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giá chào</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Giá bán chốt</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {baoGias.map(bg => (
                  <tr key={bg.idBaoGia}
                    className={`transition-colors ${bg.trangThai === 'TRUNG_THAU' ? 'bg-green-50/50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{bg.tenNCC}</p>
                      {bg.ghiChu && <p className="text-xs text-gray-400 italic">{bg.ghiChu}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{bg.lienHeNCC || '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(bg.giaNhapDeXuat)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold hidden md:table-cell">
                      {bg.giaBanChot ? fmt(bg.giaBanChot) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TRANG_THAI_STYLE[bg.trangThai] || 'bg-gray-100 text-gray-500'}`}>
                        {TRANG_THAI_LABEL[bg.trangThai] || bg.trangThai}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!daDong && bg.trangThai === 'CHO_DUYET' && (
                        <button onClick={() => setChoosing(bg)}
                          className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600 transition-colors">
                          Chọn &amp; Chốt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Sản phẩm đề xuất từ NCC */}
        {sanPhamDeXuats.length > 0 && (
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light dark:border-border-dark">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-base">lightbulb</span>
                Sản phẩm đề xuất từ Nhà cung cấp ({sanPhamDeXuats.length})
              </h3>
            </div>
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {sanPhamDeXuats.map(spdx => (
                <ProposedProductRow
                  key={spdx.idSanPhamDeXuat}
                  spdx={spdx}
                  onRefresh={fetchData}
                  phieuId={id}
                  daDong={daDong}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {choosing && (
        <ChooseOfferModal
          baoGia={choosing}
          onClose={() => setChoosing(null)}
          onConfirm={handleConfirm}
          saving={saving}
        />
      )}
    </>
  );
};

export default AdminProcurementDetailPage;

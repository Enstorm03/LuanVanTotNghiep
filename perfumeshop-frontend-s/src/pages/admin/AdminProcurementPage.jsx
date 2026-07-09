import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';
const fmtDate = (s) => s ? new Date(s).toLocaleDateString('vi-VN') : '—';

const STATUS_STYLE = {
  OPEN:   'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-500',
};

/* ── Modal cảnh báo & tạo yêu cầu ── */
const CreateRequestModal = ({ onClose, onCreated, adminId }) => {
  const [lowStock,   setLowStock]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState({}); // { idSanPham: qtyNeeded }
  const [note,       setNote]       = useState('');
  const [deadline,   setDeadline]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [threshold,  setThreshold]  = useState(10);

  const fetchLowStock = useCallback(() => {
    setLoading(true);
    api.procurementGetLowStock(threshold)
      .then(d => {
        console.log('📊 Low stock data:', d);
        setLowStock(Array.isArray(d) ? d : []);
      })
      .finally(() => setLoading(false));
  }, [threshold]);

  useEffect(() => { fetchLowStock(); }, [fetchLowStock]);

  const toggle = (sp) => {
    setSelected(prev => {
      const n = { ...prev };
      if (n[sp.idSanPham]) delete n[sp.idSanPham];
      else n[sp.idSanPham] = { qty: 10, note: '', sp };
      return n;
    });
  };

  const setQty = (id, qty) => setSelected(prev => ({ ...prev, [id]: { ...prev[id], qty: parseInt(qty) || 1 } }));

  const handleCreate = async () => {
    const items = Object.entries(selected).map(([id, v]) => ({
      productId: parseInt(id), qtyNeeded: v.qty, note: v.note
    }));
    if (items.length === 0) { alert('Chọn ít nhất 1 sản phẩm'); return; }
    try {
      setSaving(true);
      const req = await api.procurementCreate({
      adminId: adminId,
      note,
      deadline: deadline || null,
      items: Object.entries(selected).map(([id, v]) => ({
        productId: parseInt(id), qtyNeeded: v.qty, note: v.note
      })),
    });      onCreated(req);
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="font-bold text-lg">Tạo đợt gọi thầu</h3>
            <p className="text-xs text-gray-500 mt-0.5">Chọn sản phẩm cần nhập và số lượng yêu cầu</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 shrink-0">
          <span className="text-sm text-gray-500">Ngưỡng cảnh báo:</span>
          <input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} min={1}
            className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" />
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" placeholder="Hạn chót" />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú đợt..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm" />
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : lowStock.length === 0 ? (
            <p className="text-center py-8 text-gray-400">Không có sản phẩm nào dưới ngưỡng {threshold}</p>
          ) : lowStock.map(sp => {
            const sel = selected[sp.idSanPham];
            return (
              <label key={sp.idSanPham}
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${sel ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                <input type="checkbox" checked={!!sel} onChange={() => toggle(sp)}
                  className="w-4 h-4 accent-primary shrink-0" />
                {sp.urlHinhAnh && (
                  <img src={sp.urlHinhAnh.startsWith('http') ? sp.urlHinhAnh : `http://localhost:8080${sp.urlHinhAnh}`}
                    alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{sp.tenSanPham}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>Tồn: <span className="text-red-600 font-semibold">{sp.soLuongTonKho}</span></span>
                    <span>·</span>
                    <span>Giá bán: {fmt(sp.giaBan)}</span>
                  </div>
                  {sp.tocDoBan != null && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-blue-600"> {sp.tocDoBan.toFixed(2)} sp/ngày</span>
                      {sp.soNgayBienDo != null && (
                        <span className="text-gray-500">· Da nhap  {sp.soNgayBienDo} ngày truoc </span>
                      )}
                      {sp.soLuongGoiY != null && sp.soLuongGoiY > 0 && (
                        <span className="text-green-600">· 💡 Gợi ý: {sp.soLuongGoiY} sp</span>
                      )}
                    </div>
                  )}
                </div>
                {sel && (
                  <div className="flex flex-col items-end gap-1">
                    <input type="number" value={sel.qty} min={1}
                      onChange={e => setQty(sp.idSanPham, e.target.value)}
                      onClick={e => e.preventDefault()}
                      className="w-20 border border-indigo-300 rounded px-2 py-1 text-sm text-center"
                      placeholder="SL cần" />
                    {sp.soLuongGoiY != null && sp.soLuongGoiY > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(sp.idSanPham, sp.soLuongGoiY); }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                        Dùng gợi ý
                      </button>
                    )}
                  </div>
                )}
              </label>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 shrink-0">
          <button onClick={handleCreate} disabled={saving || Object.keys(selected).length === 0}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
            Đăng gọi thầu ({Object.keys(selected).length} SP)
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Trang chính ── */
const AdminProcurementPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Đề xuất độc lập
  const [proposals, setProposals] = useState([]);
  const [loadingProp, setLoadingProp] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [propSaving, setPropSaving] = useState(false);
  const [propToast, setPropToast] = useState('');

  // View theo NCC
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Chọn nhiều để duyệt hàng loạt
  const [selectedProposals, setSelectedProposals] = useState(new Set());
  const [bulkApproving, setBulkApproving] = useState(false);

  // Modal duyệt đề xuất
  const [approveModal, setApproveModal] = useState(null);
  const [approveForm, setApproveForm] = useState({
    phanTramBienDo: '20', soLuongNhap: '', idDanhMuc: '', idThuongHieu: '', phanHoi: 'Đã duyệt',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Modal duyệt hàng loạt
  const [bulkApproveModal, setBulkApproveModal] = useState(null);
  const [bulkPct, setBulkPct] = useState('20');

  // Load danh mục + thương hiệu một lần
  useEffect(() => {
    api.getAllCategories().then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
    api.getAllBrands().then(d => setBrands(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const fetchAll = useCallback(() => {
    api.procurementGetAll()
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .finally(() => setLoadingReq(false));
  }, []);

  const fetchProposals = useCallback(() => {
    setLoadingProp(true);
    api.procurementGetIndependentProposals(filterStatus)
      .then(d => setProposals(Array.isArray(d) ? d : []))
      .finally(() => setLoadingProp(false));
  }, [filterStatus]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { if (tab === 'proposals') fetchProposals(); }, [tab, fetchProposals]);

  const handleCreated = (req) => { 
    setShowCreate(false); 
    setRequests(prev => [req, ...prev]);
    // Force refresh proposals để lấy dữ liệu mới có idSanPhamKhop
    if (tab === 'proposals') {
      setTimeout(() => fetchProposals(), 500);
    }
  };
  const showPropToast = (msg) => { setPropToast(msg); setTimeout(() => setPropToast(''), 3500); };

  const openApproveModal = (proposal) => {
    setApproveModal(proposal);
    setApproveForm({
      phanTramBienDo: '20',
      soLuongNhap: proposal.soLuongCoTheCungCap ? String(proposal.soLuongCoTheCungCap) : '',
      idDanhMuc: '',
      idThuongHieu: '',
      phanHoi: 'Đã duyệt',
    });
  };

  const giaBanDuKien = () => {
    const gia = approveModal?.giaDeXuat;
    const pct = parseFloat(approveForm.phanTramBienDo) || 0;
    if (!gia) return null;
    return Math.round(Number(gia) * (1 + pct / 100));
  };

  const handleApproveSubmit = async () => {
    try {
      setPropSaving(true);
      await api.procurementApproveProposedProduct(approveModal.idSanPhamDeXuat, {
        idDanhMuc:      approveForm.idDanhMuc    ? parseInt(approveForm.idDanhMuc)    : null,
        idThuongHieu:   approveForm.idThuongHieu ? parseInt(approveForm.idThuongHieu) : null,
        idNhanVien:     user?.id_nhan_vien || user?.id || 1,
        phanHoi:        approveForm.phanHoi || 'Đã duyệt',
        phanTramBienDo: parseFloat(approveForm.phanTramBienDo) || 0,
        soLuongNhap:    approveForm.soLuongNhap ? parseInt(approveForm.soLuongNhap) : null,
      });
      setApproveModal(null);
      showPropToast('✅ Đã duyệt — SP mới được tạo, PO chuyển về kho kiểm tra!');
      // Force refresh sau 300ms để lấy dữ liệu mới có idSanPhamKhop
      setTimeout(() => fetchProposals(), 300);
    } catch (e) { alert('Lỗi: ' + e.message); }
    finally { setPropSaving(false); }
  };

  const handleReject = async (id) => {
    const lyDo = prompt('Lý do từ chối:');
    if (!lyDo) return;
    try {
      setPropSaving(true);
      await api.procurementRejectProposedProduct(id, {
        idNhanVien: user?.id_nhan_vien || user?.id || 1,
        lyDo,
      });
      showPropToast('Đã từ chối đề xuất.');
      // Force refresh sau 300ms
      setTimeout(() => fetchProposals(), 300);
    } catch (e) { alert('Lỗi: ' + e.message); }
    finally { setPropSaving(false); }
  };

  // Duyệt hàng loạt
  const toggleProposalSelection = (idSanPhamDeXuat) => {
    setSelectedProposals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idSanPhamDeXuat)) {
        newSet.delete(idSanPhamDeXuat);
      } else {
        newSet.add(idSanPhamDeXuat);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const pendingProposals = proposals.filter(p => p.trangThai === 'PENDING');
    if (selectedProposals.size === pendingProposals.length) {
      setSelectedProposals(new Set());
    } else {
      setSelectedProposals(new Set(pendingProposals.map(p => p.idSanPhamDeXuat)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedProposals.size === 0) {
      alert('Chọn ít nhất 1 sản phẩm để duyệt');
      return;
    }

    const phanTramBienDo = prompt('Nhập % biên lợi nhuận (mặc định: 20%):', '20');
    if (phanTramBienDo === null) return;

    const pct = parseFloat(phanTramBienDo) || 20;
    if (pct < 0 || pct > 500) {
      alert('% biên lợi nhuận phải từ 0-500');
      return;
    }

    if (!window.confirm(`Duyệt ${selectedProposals.size} sản phẩm với % biên lợi nhuận ${pct}%?`)) {
      return;
    }

    try {
      setBulkApproving(true);
      const items = Array.from(selectedProposals).map(id => ({
        idSanPhamDeXuat: id,
        phanTramBienDo: pct,
        phanHoi: 'Duyệt hàng loạt',
      }));

      const result = await api.procurementBulkApprove(user?.id_nhan_vien || user?.id || 1, items);
      
      showPropToast(`✅ Duyệt hàng loạt: ${result.thanhCong} thành công, ${result.thatBai} thất bại`);
      setSelectedProposals(new Set());
      // Force refresh sau 300ms để lấy dữ liệu mới có idSanPhamKhop
      setTimeout(() => fetchProposals(), 300);
    } catch (e) {
      alert('Lỗi duyệt hàng loạt: ' + e.message);
    } finally {
      setBulkApproving(false);
    }
  };

  const PROP_STYLE = { PENDING: 'bg-yellow-100 text-yellow-800', APPROVED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800' };
  const PROP_LABEL = { PENDING: '⏳ Chờ duyệt', APPROVED: '✓ Đã duyệt', REJECTED: '✗ Từ chối' };

  /**
   * Trả về { hanSuDung, soLo } từ field riêng của SanPhamDeXuat.
   * Field riêng thay thế cách cũ gộp vào ghiChu.
   */
  const parseGhiChu = (p) => {
    return {
      hanSuDung: p.hanSuDung || null,
      soLo: p.soLo || null,
    };
  };

  /** Format ngày YYYY-MM-DD an toàn, tránh timezone shift */
  const fmtHSD = (dateStr) => {
    if (!dateStr) return null;
    const clean = String(dateStr).trim();
    // Nếu đúng format YYYY-MM-DD thì parse thủ công
    const m = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    // Nếu là số thuần (Excel serial) → bỏ qua
    if (/^\d+$/.test(clean)) return null;
    // Fallback
    const d = new Date(clean);
    if (isNaN(d.getTime())) return clean;
    const yr = d.getFullYear();
    if (yr < 1900 || yr > 9999) return null; // bảo vệ khỏi timestamp sai
    return d.toLocaleDateString('vi-VN');
  };

  // Nhóm proposals theo NCC
  const groupedBySupplier = () => {
    const groups = {};
    proposals.forEach(p => {
      const key = p.tenNCC || 'Không rõ NCC';
      if (!groups[key]) {
        groups[key] = {
          tenNCC: p.tenNCC,
          lienHeNCC: p.lienHeNCC,
          proposals: [],
        };
      }
      groups[key].proposals.push(p);
    });
    return Object.values(groups);
  };

  // Duyệt hàng loạt theo NCC - mở modal
  const handleBulkApproveSupplier = (supplierProposals) => {
    const pendingIds = supplierProposals.filter(p => p.trangThai === 'PENDING').map(p => p.idSanPhamDeXuat);
    if (pendingIds.length === 0) {
      alert('Không có sản phẩm nào đang chờ duyệt từ NCC này');
      return;
    }
    setBulkApproveModal({ pendingIds, count: pendingIds.length });
    setBulkPct('20');
  };

  // Xác nhận duyệt hàng loạt
  const confirmBulkApprove = async () => {
    const pct = parseFloat(bulkPct) || 20;
    if (pct < 0 || pct > 500) {
      alert('% biên lợi nhuận phải từ 0-500');
      return;
    }

    try {
      setBulkApproving(true);
      const items = bulkApproveModal.pendingIds.map(id => ({
        idSanPhamDeXuat: id,
        phanTramBienDo: pct,
        phanHoi: 'Duyệt hàng loạt theo NCC',
      }));

      console.log('🔍 Bulk approve debug:', {
        pendingIds: bulkApproveModal.pendingIds,
        items,
        count: items.length
      });

      const result = await api.procurementBulkApprove(user?.id_nhan_vien || user?.id || 1, items);
      
      showPropToast(`✅ Duyệt hàng loạt: ${result.thanhCong} thành công, ${result.thatBai} thất bại`);
      setBulkApproveModal(null);
      setSelectedSupplier(null);
      // Force refresh sau 300ms để lấy dữ liệu mới có idSanPhamKhop
      setTimeout(() => fetchProposals(), 300);
    } catch (e) {
      alert('Lỗi duyệt hàng loạt: ' + e.message);
    } finally {
      setBulkApproving(false);
    }
  };

  return (
    <>
      {/* ── Modal chi tiết NCC ── */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div>
                <h3 className="font-bold text-lg">{selectedSupplier.tenNCC || 'Không rõ NCC'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedSupplier.lienHeNCC || 'Chưa có thông tin liên hệ'}</p>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedSupplier.proposals.some(p => p.trangThai === 'PENDING') && (
              <div className="px-5 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 flex items-center justify-between shrink-0">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {selectedSupplier.proposals.filter(p => p.trangThai === 'PENDING').length} sản phẩm đang chờ duyệt
                </p>
                <button
                  onClick={() => handleBulkApproveSupplier(selectedSupplier.proposals)}
                  disabled={bulkApproving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {bulkApproving && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Duyệt tất cả
                </button>
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sản phẩm</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Giá đề xuất</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">SL</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Số lô</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">HSD</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                    <th className="px-4 py-3 w-32 text-center" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {selectedSupplier.proposals.map(p => {
                    const { hanSuDung, soLo } = parseGhiChu(p);
                    return (
                    <tr key={p.idSanPhamDeXuat} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.urlHinhAnh && <img src={p.urlHinhAnh} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" onError={e => { e.target.style.display = 'none'; }} />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800 dark:text-gray-200">{p.tenSanPham}</p>
                               {p.idSanPhamKhop ? (
                                 <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-semibold rounded border border-blue-200 dark:border-blue-800">
                                   Đã có #{p.idSanPhamKhop}
                                 </span>
                               ) : !p.idSanPhamKhop && (p.trangThai === 'PENDING' || p.trangThai === 'APPROVED') ? (
                                 <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] font-semibold rounded border border-amber-200 dark:border-amber-800">
                                   Sản phẩm mới
                                 </span>
                               ) : null}
                            </div>
                            {p.moTa && <p className="text-xs text-gray-400 max-w-[300px] truncate mt-0.5">{p.moTa}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{fmt(p.giaDeXuat)}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{p.soLuongCoTheCungCap || '—'}</td>
                      <td className="px-3 py-3 text-center hidden lg:table-cell">
                        {soLo
                          ? <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded font-mono text-xs border border-indigo-200 dark:border-indigo-800">{soLo}</span>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-3 text-center hidden lg:table-cell">
                        {hanSuDung
                          ? <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                              {fmtHSD(hanSuDung)}
                            </span>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PROP_STYLE[p.trangThai] || 'bg-gray-100 text-gray-500'}`}>
                          {PROP_LABEL[p.trangThai] || p.trangThai}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.trangThai === 'PENDING' && (
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); openApproveModal(p); }} disabled={propSaving}
                              className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600 disabled:opacity-50 transition-colors">
                              Duyệt
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleReject(p.idSanPhamDeXuat); }} disabled={propSaving}
                              className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition-colors">
                              Từ chối
                            </button>
                          </div>
                        )}
                        {p.trangThai === 'APPROVED' && p.idSanPhamTaoRa && (
                          <span className="text-xs text-gray-400">SP #{p.idSanPhamTaoRa}</span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end shrink-0">
              <button onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal duyệt đề xuất ── */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-bold text-lg">Duyệt đề xuất</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">{approveModal.tenSanPham}</p>
              </div>
              <button onClick={() => setApproveModal(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Thông tin NCC */}
              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-sm space-y-1">
                <p><span className="text-gray-400">NCC:</span> <strong>{approveModal.tenNCC}</strong> · {approveModal.lienHeNCC || '—'}</p>
                <p><span className="text-gray-400">Giá đề xuất:</span> <strong className="text-indigo-600">{fmt(approveModal.giaDeXuat)}</strong></p>
                <p><span className="text-gray-400">SL cung cấp được:</span> {approveModal.soLuongCoTheCungCap ?? '—'}</p>
                {approveModal.ghiChu && <p><span className="text-gray-400">Ghi chú:</span> {approveModal.ghiChu}</p>}
              </div>

              {/* % Biên lợi nhuận */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  % Biên lợi nhuận <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number" min={0} max={500}
                    value={approveForm.phanTramBienDo}
                    onChange={e => setApproveForm(f => ({ ...f, phanTramBienDo: e.target.value }))}
                    className="w-28 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: 20"
                  />
                  <span className="text-sm text-gray-500">%</span>
                  {giaBanDuKien() != null && (
                    <span className="text-sm text-green-600 font-semibold">
                      → Giá bán: {giaBanDuKien().toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Giá bán = Giá đề xuất × (1 + %/100)</p>
              </div>

              {/* Số lượng nhập */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số lượng nhập kho
                </label>
                <input
                  type="number" min={1}
                  value={approveForm.soLuongNhap}
                  onChange={e => setApproveForm(f => ({ ...f, soLuongNhap: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Để trống = dùng SL NCC đề xuất (${approveModal.soLuongCoTheCungCap ?? '—'})`}
                />
              </div>

              {/* Danh mục & Thương hiệu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                  <select
                    value={approveForm.idDanhMuc}
                    onChange={e => setApproveForm(f => ({ ...f, idDanhMuc: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800">
                    <option value="">— Chưa phân loại —</option>
                    {categories.map(c => (
                      <option key={c.idDanhMuc} value={c.idDanhMuc}>
                        {c.tenDanhMuc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thương hiệu</label>
                  <select
                    value={approveForm.idThuongHieu}
                    onChange={e => setApproveForm(f => ({ ...f, idThuongHieu: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800">
                    <option value="">— Chưa xác định —</option>
                    {brands.map(b => (
                      <option key={b.idThuongHieu} value={b.idThuongHieu}>
                        {b.tenThuongHieu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ghi chú duyệt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ghi chú</label>
                <input value={approveForm.phanHoi}
                  onChange={e => setApproveForm(f => ({ ...f, phanHoi: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="VD: Hàng tốt, giá hợp lý" />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={handleApproveSubmit} disabled={propSaving}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {propSaving && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  ✓ Duyệt & Tạo PO
                </button>
                <button onClick={() => setApproveModal(null)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">Quản lý Đấu thầu</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tạo yêu cầu · NCC chào giá · Chốt thầu → Kho kiểm tra → Admin duyệt</p>
          </div>
          {tab === 'requests' && (
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-base">add_circle</span>
              Tạo đợt gọi thầu
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit">
          <button onClick={() => setTab('requests')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'requests' ? 'bg-white dark:bg-gray-600 shadow text-text-light dark:text-text-dark' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            <span className="material-symbols-outlined text-base">gavel</span>
            Đợt gọi thầu
          </button>
          <button onClick={() => setTab('proposals')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'proposals' ? 'bg-white dark:bg-gray-600 shadow text-text-light dark:text-text-dark' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            <span className="material-symbols-outlined text-base">volunteer_activism</span>
            Đề xuất độc lập
          </button>
        </div>

        {/* Tab: Đợt gọi thầu */}
        {tab === 'requests' && (
          loadingReq ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>
          ) : requests.length === 0 ? (
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">gavel</span>
              <p className="text-gray-500 font-medium">Chưa có đợt gọi thầu nào</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mã phiếu</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Ghi chú</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">SP</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Hạn</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Trạng thái</th>
                    <th className="px-4 py-3 text-center w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {requests.map(r => (
                    <tr key={r.idPhieuGoiThau} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{r.maPhieu}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate hidden md:table-cell">{r.ghiChu || '—'}</td>
                      <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{r.soLuongSanPham ?? r.danhSachSanPham?.length ?? 0} SP</span></td>
                      <td className="px-4 py-3 text-center text-xs text-gray-400 hidden md:table-cell">{r.hanChot || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.trangThai === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                          {r.trangThai === 'OPEN' ? '🟢 Đang mở' : '✓ Đã chốt'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a href={`/admin/procurement/${r.idPhieuGoiThau}`} className="text-xs text-primary hover:underline font-medium">Chi tiết →</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Tab: Đề xuất độc lập */}
        {tab === 'proposals' && (
          <div className="space-y-4">
            {propToast && <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">{propToast}</div>}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Lọc:</span>
              {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterStatus === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s === '' ? 'Tất cả' : PROP_LABEL[s]}
                </button>
              ))}
            </div>
            {loadingProp ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
            ) : proposals.length === 0 ? (
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">volunteer_activism</span>
                <p className="text-gray-500">Chưa có đề xuất độc lập nào</p>
              </div>
            ) : (
              /* View theo NCC */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedBySupplier().map((group, idx) => {
                  const pendingCount = group.proposals.filter(p => p.trangThai === 'PENDING').length;
                  const totalCount = group.proposals.length;
                  return (
                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedSupplier(group)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{group.tenNCC || 'Không rõ NCC'}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{group.lienHeNCC || 'Chưa có thông tin liên hệ'}</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Tổng:</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{totalCount}</span>
                        </div>
                        {pendingCount > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            <span className="font-semibold text-yellow-700 dark:text-yellow-500">{pendingCount} chờ duyệt</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        )}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex items-center gap-3">

          <span className="material-symbols-outlined text-indigo-500">link</span>

          <div className="flex-1">

            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Link cổng chao hang</p>

            <p className="text-xs text-indigo-600 dark:text-indigo-300">{window.location.origin}/procurement</p>

          </div>

          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/procurement`)}

            className="text-xs text-indigo-600 hover:underline flex items-center gap-1">

            <span className="material-symbols-outlined text-sm">content_copy</span>

            Copy

          </button>

        </div>
      </div>
      

      {showCreate && (
        <CreateRequestModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
          adminId={user?.id_nhan_vien || user?.id || 1}
        />
      )}

      {/* Modal duyệt hàng loạt */}
      {bulkApproveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-bold text-lg">Duyệt hàng loạt</h3>
                <p className="text-xs text-gray-500 mt-0.5">{bulkApproveModal.count} sản phẩm sẽ được duyệt</p>
              </div>
              <button onClick={() => setBulkApproveModal(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200 mb-2">
                  <span className="material-symbols-outlined text-lg">info</span>
                  <span className="font-semibold text-sm">Thông tin duyệt</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Tất cả sản phẩm sẽ được duyệt với cùng một % biên lợi nhuận. 
                  Sau khi duyệt, sản phẩm mới sẽ được tạo và PO chuyển về kho để kiểm tra.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  % Biên lợi nhuận <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={bulkPct}
                    onChange={e => setBulkPct(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập % biên lợi nhuận"
                    autoFocus
                  />
                  <span className="text-sm text-gray-500 font-medium">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Giá bán = Giá đề xuất × (1 + {bulkPct}%/100)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmBulkApprove}
                  disabled={bulkApproving || !bulkPct}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {bulkApproving && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  <span className="material-symbols-outlined text-base">done_all</span>
                  Xác nhận duyệt {bulkApproveModal.count} SP
                </button>
                <button
                  onClick={() => setBulkApproveModal(null)}
                  disabled={bulkApproving}
                  className="px-5 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProcurementPage;

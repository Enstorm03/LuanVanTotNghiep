import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSupplier } from '../../contexts/SupplierContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';

/* ════════════════════════════════════════════════════════════
   Trang chi tiết phiếu gọi thầu + form báo giá (NCC)
   Route: /procurement/:id
   ════════════════════════════════════════════════════════════ */
export const ProcurementDetailPage = ({ requestId }) => {
  const { supplier } = useSupplier();
  const navigate = useNavigate();

  const [request,    setRequest]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Pre-fill tên NCC từ session nếu đã đăng nhập
  const [form, setForm] = useState({
    supplierName:    '',
    supplierContact: '',
    giaNhapChaoHang: '',
    hanSuDung:       '',
    soLo:            '',
    note: ''
  });

  // ── State cho form đề xuất sản phẩm mới ──
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposal, setProposal] = useState({
    tenNCC:              '',
    lienHeNCC:           '',
    tenSanPham:          '',
    moTa:                '',
    urlHinhAnh:          '',
    giaDeXuat:           '',
    soLuongCoTheCungCap: '',
    dungTichMl:          '',
    nongDo:              '',
    hanSuDung:           '',
    soLo:                '',
    ghiChu:              '',
  });

  // Đồng bộ thông tin NCC từ SupplierContext khi supplier thay đổi
  useEffect(() => {
    if (supplier) {
      setForm(f => ({
        ...f,
        supplierName:    supplier.tenCongTy    || '',
        supplierContact: supplier.soDienThoai  || supplier.email || '',
      }));
      setProposal(p => ({
        ...p,
        tenNCC:    supplier.tenCongTy   || '',
        lienHeNCC: supplier.soDienThoai || supplier.email || '',
      }));
    }
  }, [supplier]);

  const setProposalField = (k, v) => setProposal(p => ({ ...p, [k]: v }));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    api.procurementGetPublicDetail(requestId)
      .then(d => setRequest(d))
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [requestId]);

  // ── Gửi đề xuất sản phẩm mới ──
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!proposal.tenNCC.trim() || !proposal.tenSanPham.trim()) {
      alert('Vui lòng điền tên công ty và tên sản phẩm');
      return;
    }
    try {
      setProposalSubmitting(true);
      await api.procurementSubmitProposedProduct(requestId, {
        tenNCC:              proposal.tenNCC.trim(),
        lienHeNCC:           proposal.lienHeNCC.trim(),
        tenSanPham:          proposal.tenSanPham.trim(),
        moTa:                proposal.moTa.trim(),
        urlHinhAnh:          proposal.urlHinhAnh.trim(),
        giaDeXuat:           proposal.giaDeXuat ? parseFloat(proposal.giaDeXuat) : null,
        soLuongCoTheCungCap: proposal.soLuongCoTheCungCap ? parseInt(proposal.soLuongCoTheCungCap) : null,
        dungTichMl:          proposal.dungTichMl ? parseInt(proposal.dungTichMl) : null,
        nongDo:              proposal.nongDo ? parseInt(proposal.nongDo) : null,
        hanSuDung:           proposal.hanSuDung || null,
        soLo:                proposal.soLo.trim() || null,
        ghiChu:              proposal.ghiChu.trim(),
      });
      setProposalSubmitted(true);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setProposalSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierName.trim() || !form.giaNhapChaoHang) {
      alert('Vui lòng điền tên công ty và giá chào');
      return;
    }
    try {
      setSubmitting(true);
      await api.procurementSubmitOffer(requestId, {
        tenNCC:        form.supplierName.trim(),
        lienHeNCC:     form.supplierContact.trim(),
        giaNhapDeXuat: parseFloat(form.giaNhapChaoHang),
        hanSuDung:     form.hanSuDung || null,
        soLo:          form.soLo.trim() || null,
        ghiChu:        form.note.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
        <span className="text-5xl">❌</span>
        <h2 className="text-xl font-bold text-red-600 mt-4">Không tìm thấy yêu cầu thu mua</h2>
      </div>
    </div>
  );

  if (request.trangThai === 'CLOSED') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-gray-700 mt-4 mb-2">Đợt gọi thầu đã đóng</h2>
        <p className="text-gray-500 text-sm">{request.maPhieu} đã được chốt thầu.</p>
      </div>
    </div>
  );

  const danhSachSanPham = request.danhSachSanPham || [];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-indigo-600 text-white rounded-2xl px-6 py-6">
          <p className="text-xs tracking-widest uppercase opacity-70 mb-1">Enstorm Perfume · Yêu cầu thu mua</p>
          <h1 className="text-2xl font-bold">{request.maPhieu}</h1>
          {request.ghiChu && <p className="text-indigo-200 text-sm mt-1">{request.ghiChu}</p>}
          {request.hanChot && <p className="text-indigo-200 text-xs mt-2">⏰ Hạn chót: {request.hanChot}</p>}
        </div>

        {/* Danh sách SP */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Sản phẩm cần nhập ({danhSachSanPham.length})</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Sản phẩm</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Số lượng</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">Giá hiện tại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {danhSachSanPham.map(ct => (
                <tr key={ct.idChiTiet}>
                  <td className="px-4 py-3 font-medium text-gray-800">{ct.tenSanPhamSnapshot}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                      {ct.soLuongCanNhap}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                    {fmt(ct.giaBanHienTai)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── NCC: Đề xuất sản phẩm mới ── */}
        {proposalSubmitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8 text-center">
            <span className="text-5xl">✅</span>
            <h2 className="text-xl font-bold text-green-700 mt-4 mb-2">Đã gửi đề xuất thành công!</h2>
            <p className="text-gray-500 text-sm">Chúng tôi sẽ xem xét và liên hệ với bạn nếu có nhu cầu.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button onClick={() => setShowProposalForm(!showProposalForm)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">💡 Đề xuất sản phẩm mới</h3>
                <p className="text-xs text-gray-400 mt-0.5">Nếu bạn có sản phẩm phù hợp, hãy đề xuất với chúng tôi</p>
              </div>
              <span className={`material-symbols-outlined text-gray-400 transition-transform ${showProposalForm ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {showProposalForm && (
              <form onSubmit={handleProposalSubmit} className="px-5 py-5 border-t border-gray-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tên công ty *</label>
                    {supplier ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        {proposal.tenNCC}
                      </div>
                    ) : (
                      <input value={proposal.tenNCC} onChange={e => setProposalField('tenNCC', e.target.value)} required
                        placeholder="VD: Công ty TNHH Nước Hoa XYZ"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Liên hệ</label>
                    {supplier ? (
                      <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                        {proposal.lienHeNCC || '—'}
                      </div>
                    ) : (
                      <input value={proposal.lienHeNCC} onChange={e => setProposalField('lienHeNCC', e.target.value)}
                        placeholder="SĐT / Email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                  <input value={proposal.tenSanPham} onChange={e => setProposalField('tenSanPham', e.target.value)} required
                    placeholder="VD: Nước hoa Chanel No 5 100ml"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea value={proposal.moTa} onChange={e => setProposalField('moTa', e.target.value)} rows={2}
                    placeholder="Mô tả ngắn về sản phẩm..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL hình ảnh (nếu có)</label>
                  <input value={proposal.urlHinhAnh} onChange={e => setProposalField('urlHinhAnh', e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá đề xuất (VNĐ)</label>
                    <input type="number" value={proposal.giaDeXuat} onChange={e => setProposalField('giaDeXuat', e.target.value)}
                      min={0} placeholder="VD: 350000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SL có thể cung cấp</label>
                    <input type="number" value={proposal.soLuongCoTheCungCap} onChange={e => setProposalField('soLuongCoTheCungCap', e.target.value)}
                      min={0} placeholder="VD: 100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dung tích (ml)</label>
                    <input type="number" value={proposal.dungTichMl} onChange={e => setProposalField('dungTichMl', e.target.value)}
                      min={0} placeholder="VD: 100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hạn sử dụng (HSD)</label>
                    <input type="date" value={proposal.hanSuDung} onChange={e => setProposalField('hanSuDung', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số lô (Batch No.)</label>
                    <input type="text" value={proposal.soLo} onChange={e => setProposalField('soLo', e.target.value)}
                      placeholder="VD: LOT-2025-001"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú thêm</label>
                  <textarea value={proposal.ghiChu} onChange={e => setProposalField('ghiChu', e.target.value)} rows={2}
                    placeholder="VD: Hàng mới 100%, bao đổi trả..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>
                <button type="submit" disabled={proposalSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {proposalSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                  Gửi đề xuất
                </button>
              </form>
            )}
          </div>
        )}

        {/* Form báo giá hoặc thành công */}
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8 text-center">
            <span className="text-5xl">✅</span>
            <h2 className="text-xl font-bold text-green-700 mt-4 mb-2">Đã gửi báo giá thành công!</h2>
            <p className="text-gray-500 text-sm">Chúng tôi sẽ xem xét và liên hệ với bạn nếu được chọn.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Gửi báo giá của bạn</h3>
              <p className="text-xs text-gray-400 mt-0.5">Giá nhập áp dụng cho toàn bộ lô hàng trong đợt này</p>
            </div>
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên công ty / Nhà cung cấp *</label>
                  {supplier ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      {form.supplierName}
                    </div>
                  ) : (
                    <input value={form.supplierName} onChange={e => set('supplierName', e.target.value)} required
                      placeholder="VD: Công ty TNHH Nước Hoa XYZ"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SĐT / Email liên hệ</label>
                  {supplier ? (
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                      {form.supplierContact || '—'}
                    </div>
                  ) : (
                    <input value={form.supplierContact} onChange={e => set('supplierContact', e.target.value)}
                      placeholder="0901234567 / email@..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá nhập đề xuất (VNĐ / đơn vị) *</label>
                <input type="number" value={form.giaNhapChaoHang} onChange={e => set('giaNhapChaoHang', e.target.value)}
                  required min={1} placeholder="VD: 500000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hạn sử dụng (HSD)</label>
                  <input type="date" value={form.hanSuDung} onChange={e => set('hanSuDung', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lô (Batch No.)</label>
                  <input type="text" value={form.soLo} onChange={e => set('soLo', e.target.value)}
                    placeholder="VD: LOT-2025-001"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú thêm</label>
                <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={3}
                  placeholder="VD: Hàng có sẵn, giao trong 3 ngày..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {submitting ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                Gửi báo giá
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   Trang danh sách đợt mở — NCC xem tất cả
   Route: /procurement
   ════════════════════════════════════════════════════════════ */
const ProcurementPortalPage = () => {
  const { supplier, logoutSupplier } = useSupplier();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.procurementGetOpen()
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cổng Đấu thầu</h1>
            <p className="text-gray-500 mt-1 text-sm">Các đợt thu mua đang mở</p>
          </div>
          {supplier ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{supplier.tenCongTy}</p>
                <p className="text-xs text-gray-400">{supplier.tenDangNhap}</p>
              </div>
              <a href="/supplier-portal"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                <span className="material-symbols-outlined text-sm">storefront</span>
                Chào hàng mới
              </a>
              <button onClick={() => { logoutSupplier(); navigate('/procurement'); }}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/supplier-portal"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-200 transition-colors">
                <span className="material-symbols-outlined text-sm">storefront</span>
                Chào hàng
              </a>
              <button onClick={() => navigate('/procurement/login')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                <span className="material-symbols-outlined text-base">login</span>
                Đăng nhập NCC
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-gray-500">Hiện không có đợt gọi thầu nào đang mở.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <a key={r.idPhieuGoiThau} href={`/procurement/${r.idPhieuGoiThau}`}
                className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-indigo-600">{r.maPhieu}</p>
                    {r.ghiChu && <p className="text-sm text-gray-500 mt-0.5">{r.ghiChu}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {r.danhSachSanPham?.length || 0} sản phẩm · Hạn: {r.hanChot || '—'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcurementPortalPage;
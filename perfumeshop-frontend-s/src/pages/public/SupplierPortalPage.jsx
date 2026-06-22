import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useSupplier } from '../../contexts/SupplierContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + '₫' : '—';

const INIT_FORM = {
  tenNCC: '', lienHeNCC: '', tenSanPham: '', moTa: '',
  urlHinhAnh: '', giaDeXuat: '', soLuongCoTheCungCap: '',
  dungTichMl: '', nongDo: '', ghiChu: '',
};

/* ── Tải template Excel (client-side, dùng dữ liệu mẫu) ── */
const downloadTemplate = () => {
  const header = ['ten_san_pham', 'mo_ta', 'gia_de_xuat', 'so_luong', 'dung_tich_ml', 'nong_do', 'url_hinh_anh', 'ghi_chu'];
  const sample = ['Nước hoa Chanel No.5 EDP', 'Hương hoa cỏ nhẹ nhàng', '350000', '50', '100', '15', 'https://example.com/img.jpg', 'Hàng chính hãng'];
  const csv = [header.join(','), sample.join(',')].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'template_chao_hang_ncc.csv';
  a.click(); URL.revokeObjectURL(url);
};

/* ── Section upload hàng loạt ── */
const BulkUploadSection = ({ prefillTenNCC = '', prefillLienHe = '', locked = false }) => {
  const fileRef = useRef();
  const [tenNCC, setTenNCC] = useState(prefillTenNCC);
  const [lienHeNCC, setLienHeNCC] = useState(prefillLienHe);

  // Sync khi props thay đổi (supplier login sau khi component mount)
  useEffect(() => { if (prefillTenNCC) setTenNCC(prefillTenNCC); }, [prefillTenNCC]);
  useEffect(() => { if (prefillLienHe) setLienHeNCC(prefillLienHe); }, [prefillLienHe]);
  const [step, setStep] = useState('idle'); // idle | previewing | done
  const [preview, setPreview] = useState(null); // { sessionId, rows, ok, loi, tongDong }
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [doneResult, setDoneResult] = useState(null);
  const [err, setErr] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!tenNCC.trim()) { setErr('Vui lòng nhập tên công ty trước khi upload'); return; }
    setErr('');
    try {
      setUploading(true);
      const result = await api.procurementBulkPreview(file, tenNCC.trim(), lienHeNCC.trim());
      setPreview(result);
      setStep('previewing');
    } catch (e) { setErr('Lỗi: ' + e.message); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleConfirm = async () => {
    if (!preview?.sessionId) return;
    try {
      setConfirming(true);
      const result = await api.procurementBulkConfirm(preview.sessionId);
      setDoneResult(result);
      setStep('done');
    } catch (e) { setErr('Lỗi: ' + e.message); }
    finally { setConfirming(false); }
  };

  const reset = () => { setStep('idle'); setPreview(null); setDoneResult(null); setErr(''); };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="px-5 py-4 bg-emerald-600 text-white flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">📂 Gửi hàng loạt qua Excel / CSV</h2>
          <p className="text-emerald-100 text-xs mt-0.5">Dành cho NCC có nhiều sản phẩm muốn đề xuất cùng lúc</p>
        </div>
        <button onClick={downloadTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Tải template
        </button>
      </div>

      {step === 'done' ? (
        <div className="px-5 py-8 text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <p className="font-bold text-green-700 text-lg">Đã gửi {doneResult?.daTao} sản phẩm thành công!</p>
          <p className="text-gray-500 text-sm">Chúng tôi sẽ xem xét từng sản phẩm và liên hệ với bạn.</p>
          <button onClick={reset}
            className="mt-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            Gửi thêm file khác
          </button>
        </div>
      ) : step === 'previewing' && preview ? (
        <div className="px-5 py-4 space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">{preview.tongDong} dòng</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">✓ {preview.ok} hợp lệ</span>
            {preview.loi > 0 && <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-semibold">✗ {preview.loi} lỗi</span>}
          </div>

          {/* Preview table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-500 w-8">#</th>
                  <th className="text-center px-2 py-2 text-gray-500 w-20">Trạng thái</th>
                  <th className="text-left px-3 py-2 text-gray-500">Tên sản phẩm</th>
                  <th className="text-right px-3 py-2 text-gray-500">Giá đề xuất</th>
                  <th className="text-center px-2 py-2 text-gray-500">SL</th>
                  <th className="text-left px-3 py-2 text-gray-500">Lỗi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(preview.rows || []).map((r, i) => (
                  <tr key={i} className={r.trangThai === 'LOI' ? 'bg-red-50' : 'bg-white'}>
                    <td className="px-3 py-2 text-gray-400">{r.dongSo}</td>
                    <td className="px-2 py-2 text-center">
                      {r.trangThai === 'OK'
                        ? <span className="text-green-600">✓</span>
                        : <span className="text-red-500">✗</span>}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 max-w-[160px] truncate">{r.tenSanPham || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.giaDeXuat ? fmt(Number(r.giaDeXuat)) : '—'}</td>
                    <td className="px-2 py-2 text-center text-gray-600">{r.soLuong ?? '—'}</td>
                    <td className="px-3 py-2 text-red-500">{r.loi || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <div className="flex gap-3">
            <button onClick={handleConfirm} disabled={confirming || preview.ok === 0}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm">
              {confirming && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
              Xác nhận gửi {preview.ok} sản phẩm hợp lệ
            </button>
            <button onClick={reset}
              className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              Hủy
            </button>
          </div>
          {preview.loi > 0 && (
            <p className="text-xs text-orange-600">⚠ {preview.loi} dòng có lỗi sẽ bị bỏ qua. Sửa file và upload lại để gửi đầy đủ.</p>
          )}
        </div>
      ) : (
        <div className="px-5 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty *</label>
              {locked ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {tenNCC}
                </div>
              ) : (
                <input value={tenNCC} onChange={e => setTenNCC(e.target.value)}
                  placeholder="VD: Công ty TNHH XYZ"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SĐT / Email</label>
              {locked ? (
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                  {lienHeNCC || '—'}
                </div>
              ) : (
                <input value={lienHeNCC} onChange={e => setLienHeNCC(e.target.value)}
                  placeholder="0901234567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              )}
            </div>
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <div
            onClick={() => tenNCC.trim() && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${tenNCC.trim() ? 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer' : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'}`}>
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <span className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                <span className="text-sm font-medium">Đang phân tích file...</span>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl text-emerald-400 block mb-2">upload_file</span>
                <p className="text-sm font-medium text-gray-700">Kéo thả hoặc click để chọn file</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ .xlsx, .xls, .csv · Tối đa 5MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
            <p className="font-semibold">📌 Cấu trúc file (theo thứ tự cột):</p>
            <p className="font-mono">ten_san_pham* | mo_ta | gia_de_xuat* | so_luong* | dung_tich_ml | nong_do | url_hinh_anh | ghi_chu</p>
            <p>Các cột có dấu * là bắt buộc. <button onClick={downloadTemplate} className="underline text-amber-700 font-semibold">Tải template mẫu</button></p>
          </div>
        </div>
      )}
    </div>
  );
};


/* ── Trang chính ── */
const SupplierPortalPage = () => {
  const { supplier } = useSupplier();

  // Pre-fill từ supplier đã đăng nhập
  const supplierName    = supplier?.tenCongTy   || '';
  const supplierContact = supplier?.soDienThoai || supplier?.email || '';
  const isLoggedIn      = !!supplier;

  const [form, setForm] = useState({
    ...INIT_FORM,
    tenNCC: supplierName,
    lienHeNCC: supplierContact,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openRequests, setOpenRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [activeTab, setActiveTab] = useState('single');

  // Sync khi supplier login sau khi trang đã mount
  useEffect(() => {
    if (supplier) {
      setForm(f => ({
        ...f,
        tenNCC: supplier.tenCongTy || f.tenNCC,
        lienHeNCC: supplier.soDienThoai || supplier.email || f.lienHeNCC,
      }));
    }
  }, [supplier]);

  useEffect(() => {
    api.procurementGetOpen()
      .then(d => setOpenRequests(Array.isArray(d) ? d : []))
      .finally(() => setLoadingReq(false));
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.tenNCC.trim()) errs.tenNCC = 'Tên công ty không được để trống';
    if (!form.lienHeNCC.trim()) errs.lienHeNCC = 'Thông tin liên hệ không được để trống';
    if (!form.tenSanPham.trim()) errs.tenSanPham = 'Tên sản phẩm không được để trống';
    if (!form.giaDeXuat || Number(form.giaDeXuat) <= 0) errs.giaDeXuat = 'Giá đề xuất phải lớn hơn 0';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      await api.procurementSubmitIndependentProposal({
        tenNCC: form.tenNCC.trim(),
        lienHeNCC: form.lienHeNCC.trim(),
        tenSanPham: form.tenSanPham.trim(),
        moTa: form.moTa.trim(),
        urlHinhAnh: form.urlHinhAnh.trim() || null,
        giaDeXuat: parseFloat(form.giaDeXuat),
        soLuongCoTheCungCap: form.soLuongCoTheCungCap ? parseInt(form.soLuongCoTheCungCap) : null,
        dungTichMl: form.dungTichMl ? parseInt(form.dungTichMl) : null,
        nongDo: form.nongDo ? parseInt(form.nongDo) : null,
        ghiChu: form.ghiChu.trim() || null,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ _general: err.message || 'Đã xảy ra lỗi, vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <span className="material-symbols-outlined text-white text-3xl">storefront</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Cổng Chào Hàng</h1>
          <p className="text-gray-500 mt-2">Đề xuất sản phẩm của bạn cho Enstorm Perfume — không cần đăng ký tài khoản</p>
          {isLoggedIn && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <span className="material-symbols-outlined text-base">verified</span>
              Đang đăng nhập: <strong>{supplier.tenCongTy}</strong>
            </div>
          )}
        </div>

        {/* Danh sách đợt đang mở */}
        {!loadingReq && openRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="px-5 py-4 bg-indigo-600 text-white">
              <h2 className="font-bold text-lg">📋 Đợt gọi thầu đang mở ({openRequests.length})</h2>
              <p className="text-indigo-200 text-xs mt-0.5">Báo giá trực tiếp tại từng đợt để được ưu tiên xét duyệt</p>
            </div>
            <div className="divide-y divide-gray-100">
              {openRequests.map(r => (
                <a key={r.idPhieuGoiThau} href={`/procurement/${r.idPhieuGoiThau}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-indigo-50 transition-colors">
                  <div>
                    <p className="font-semibold text-indigo-700">{r.maPhieu}</p>
                    {r.ghiChu && <p className="text-sm text-gray-500 mt-0.5">{r.ghiChu}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {r.danhSachSanPham?.length || 0} sản phẩm · Hạn: {r.hanChot || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-xs font-medium">Báo giá ngay</span>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tab bar: Đơn lẻ / Hàng loạt */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          <button onClick={() => setActiveTab('single')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'single' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            <span className="material-symbols-outlined text-base">edit_note</span>
            Đề xuất đơn lẻ
          </button>
          <button onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            <span className="material-symbols-outlined text-base">upload_file</span>
            Upload Excel / CSV
          </button>
        </div>

        {/* Tab: Đề xuất đơn lẻ */}
        {activeTab === 'single' && (
          submitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-10 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Gửi thành công!</h2>
              <p className="text-gray-500 mb-6">Chúng tôi đã nhận được đề xuất của bạn và sẽ liên hệ sớm nhất có thể.</p>
              <button onClick={() => { setSubmitted(false); setForm(INIT_FORM); setErrors({}); }}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Gửi đề xuất khác
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-5 py-5 border-b border-gray-100">
                <h2 className="font-bold text-xl text-gray-800">Đề xuất sản phẩm mới</h2>
                <p className="text-sm text-gray-400 mt-0.5">Điền thông tin sản phẩm bạn muốn cung cấp</p>
              </div>
              <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5">
                {errors._general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{errors._general}</div>
                )}

                {/* Thông tin NCC */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin nhà cung cấp</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty / Họ tên *</label>
                      {isLoggedIn ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          {form.tenNCC}
                        </div>
                      ) : (
                        <input value={form.tenNCC} onChange={e => set('tenNCC', e.target.value)}
                          placeholder="VD: Công ty TNHH Nước Hoa XYZ"
                          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.tenNCC ? 'border-red-400' : 'border-gray-300'}`} />
                      )}
                      {errors.tenNCC && <p className="text-red-500 text-xs mt-1">{errors.tenNCC}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SĐT / Email *</label>
                      {isLoggedIn ? (
                        <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                          {form.lienHeNCC || '—'}
                        </div>
                      ) : (
                        <input value={form.lienHeNCC} onChange={e => set('lienHeNCC', e.target.value)}
                          placeholder="0901234567 / email@..."
                          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.lienHeNCC ? 'border-red-400' : 'border-gray-300'}`} />
                      )}
                      {errors.lienHeNCC && <p className="text-red-500 text-xs mt-1">{errors.lienHeNCC}</p>}
                    </div>
                  </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin sản phẩm</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input value={form.tenSanPham} onChange={e => set('tenSanPham', e.target.value)}
                      placeholder="VD: Nước hoa Chanel No.5 EDP 100ml"
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.tenSanPham ? 'border-red-400' : 'border-gray-300'}`} />
                    {errors.tenSanPham && <p className="text-red-500 text-xs mt-1">{errors.tenSanPham}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea value={form.moTa} onChange={e => set('moTa', e.target.value)} rows={2}
                      placeholder="Mô tả ngắn về sản phẩm..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                    <input value={form.urlHinhAnh} onChange={e => set('urlHinhAnh', e.target.value)}
                      placeholder="https://... (nhập URL, không upload file)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giá đề xuất (₫) *</label>
                      <input type="number" value={form.giaDeXuat} onChange={e => set('giaDeXuat', e.target.value)}
                        min={1} placeholder="VD: 350000"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.giaDeXuat ? 'border-red-400' : 'border-gray-300'}`} />
                      {errors.giaDeXuat && <p className="text-red-500 text-xs mt-1">{errors.giaDeXuat}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SL cung cấp</label>
                      <input type="number" value={form.soLuongCoTheCungCap} onChange={e => set('soLuongCoTheCungCap', e.target.value)}
                        min={0} placeholder="VD: 100"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dung tích (ml)</label>
                      <input type="number" value={form.dungTichMl} onChange={e => set('dungTichMl', e.target.value)}
                        min={0} placeholder="VD: 100"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nồng độ (%)</label>
                      <input type="number" value={form.nongDo} onChange={e => set('nongDo', e.target.value)}
                        min={0} max={100} placeholder="VD: 15"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                    <textarea value={form.ghiChu} onChange={e => set('ghiChu', e.target.value)} rows={2}
                      placeholder="VD: Hàng mới 100%, có hóa đơn, giao trong 3 ngày..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-base">
                  {submitting && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                  Gửi đề xuất
                </button>
              </form>
            </div>
          )
        )}

        {/* Tab: Upload hàng loạt */}
        {activeTab === 'bulk' && (
          <BulkUploadSection
            prefillTenNCC={supplierName}
            prefillLienHe={supplierContact}
            locked={isLoggedIn}
          />
        )}

        <p className="text-center text-xs text-gray-400">Thông tin của bạn chỉ được dùng cho mục đích liên hệ và thương mại.</p>
      </div>
    </div>
  );
};

export default SupplierPortalPage;

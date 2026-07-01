import React, { useState, useRef, useCallback } from 'react';
import api from '../../services/api';
import { generateCSVTemplate, calculateMonthsToExpiry } from '../../utils/csvFormatUtils';

/* ── Constants ── */
const STATUS_STYLE = {
  OK:       'bg-green-100 text-green-800',
  CHUA_MAP: 'bg-yellow-100 text-yellow-800',
  LOI:      'bg-red-100 text-red-800',
};
const STATUS_LABEL = { OK: '✓ OK', CHUA_MAP: '⚠ Chưa map', LOI: '✗ Lỗi' };

const fmt = (n) => n != null && n !== '' ? Number(n).toLocaleString('vi-VN') + '₫' : '—';

/* ── Utility: Get min date (today) for date picker ── */
const getTodayISOString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/* ── Inline editable cell ── */
const EditCell = ({ value, type = 'text', onSave, className = '', warning = null, error = null }) => {
  const [editing, setEditing] = useState(false);
  const [val,     setVal]     = useState(value ?? '');

  const commit = () => {
    setEditing(false);
    if (String(val) !== String(value ?? '')) onSave(val);
  };

  if (editing) {
    const inputProps = {
      autoFocus: true,
      type,
      value: val,
      onChange: e => setVal(e.target.value),
      onBlur: commit,
      onKeyDown: e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setVal(value ?? ''); setEditing(false); } },
      className: `w-full border rounded px-1.5 py-0.5 text-sm focus:outline-none ${error ? 'border-red-500' : 'border-primary'} ${className}`
    };
    if (type === 'date') inputProps.min = getTodayISOString();
    
    return <input {...inputProps} />;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div
        onClick={() => { setVal(value ?? ''); setEditing(true); }}
        className={`cursor-pointer hover:bg-primary/5 rounded px-1 py-0.5 min-h-[24px] text-sm group ${className}`}
        title="Click để chỉnh sửa"
      >
        {value != null && value !== '' ? value : <span className="text-gray-300 italic text-xs group-hover:text-gray-400">nhấp để nhập</span>}
      </div>
      {warning && <p className="text-xs text-orange-600 font-semibold px-1">⚠ {warning}</p>}
      {error && <p className="text-xs text-red-600 font-semibold px-1">✗ {error}</p>}
    </div>
  );
};

/* ── Main page ── */
const AdminImportKhoPage = () => {
  const fileRef = useRef();

  const [uploading,  setUploading]  = useState(false);
  const [session,    setSession]    = useState(null);
  const [rows,       setRows]       = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [done,       setDone]       = useState(null);
  const [nhaCungCap, setNhaCungCap] = useState('');
  const [ghiChu,     setGhiChu]     = useState('');

  /* ── Computed stats ── */
  const stats = {
    total:   rows.length,
    ok:      rows.filter(r => r.trangThai === 'OK').length,
    chuaMap: rows.filter(r => r.trangThai === 'CHUA_MAP').length,
    loi:     rows.filter(r => r.trangThai === 'LOI').length,
  };

  /* ── Parse HSD and SoLo from ghiChu (legacy) hoặc từ field riêng ── */
  const parseExtraFields = (row) => {
    // Nếu backend đã trả về field riêng thì dùng luôn
    if (row.hanSuDung || row.soLo) return row;
    // Fallback: parse từ ghiChu (data cũ)
    const parsed = { ...row };
    if (row.ghiChu) {
      const hsdMatch = row.ghiChu.match(/HSD:(\d{4}-\d{2}-\d{2})/);
      if (hsdMatch) {
        parsed.hanSuDung = hsdMatch[1];
        parsed.ghiChu = row.ghiChu.replace(/\s*\|\s*HSD:[^|]+/, '').replace(/HSD:[^|]+\s*\|\s*/, '').trim();
      }
      const loMatch = row.ghiChu.match(/Lô:([^|]+)/);
      if (loMatch) {
        parsed.soLo = loMatch[1].trim();
        parsed.ghiChu = parsed.ghiChu.replace(/\s*\|\s*Lô:[^|]+/, '').replace(/Lô:[^|]+\s*\|\s*/, '').trim();
      }
    }
    return parsed;
  };

  /* ── Upload ── */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      setDone(null);
      const res = await api.importPreview(file);
      setSession(res.sessionId);
      // Parse HSD and soLo from ghiChu
      const parsedRows = (res.rows || []).map(parseExtraFields);
      setRows(parsedRows);
    } catch (err) {
      alert('Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  /* ── Save cell change → call BE → update local ── */
  const saveCell = useCallback(async (rowId, field, newValue) => {
    try {
      const updated = await api.updateKhoRow(rowId, { [field]: newValue === '' ? null : newValue });
      // Merge lại, ưu tiên field riêng hanSuDung/soLo từ response
      setRows(prev => prev.map(r => r.id === rowId ? { ...r, ...updated } : r));
    } catch (err) {
      alert('Lỗi lưu: ' + err.message);
    }
  }, []);

  /* ── Delete row ── */
  const deleteRow = useCallback(async (rowId) => {
    try {
      await api.deleteKhoRow(rowId);
      setRows(prev => prev.filter(r => r.id !== rowId));
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  }, []);

  /* ── Add blank row ── */
  const addRow = async () => {
    try {
      const newRow = await api.addKhoRow(session, { soLuong: 1 });
      setRows(prev => [...prev, newRow]);
    } catch (err) {
      alert('Lỗi thêm dòng: ' + err.message);
    }
  };

  /* ── Confirm ── */
  const handleConfirm = async () => {
    if (stats.ok === 0) { alert('Không có dòng hợp lệ để duyệt'); return; }
    if (!window.confirm(`Duyệt ${stats.ok} dòng hợp lệ? Kho sẽ được cộng ngay.`)) return;
    try {
      setConfirming(true);
      const phieu = await api.confirmImport(session, 1, nhaCungCap, ghiChu);
      setDone(phieu);
      setSession(null);
      setRows([]);
    } catch (err) {
      alert('Lỗi duyệt: ' + err.message);
    } finally {
      setConfirming(false);
    }
  };

   /* ── Download template (sử dụng csvFormatUtils chuẩn) ── */
   const downloadTemplate = () => {
     const csvContent = generateCSVTemplate();
     const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'template_nhap_kho.csv';
     a.click();
     URL.revokeObjectURL(url);
   };

  /* ── Reset ── */
  const reset = () => { setSession(null); setRows([]); setDone(null); };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
            Nhập kho từ CSV / Excel
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload → chỉnh sửa trực tiếp → duyệt để cộng tồn kho</p>
        </div>
        <button onClick={downloadTemplate}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <span className="material-symbols-outlined text-base">download</span>
          Template CSV
        </button>
      </div>

      {/* Done banner */}
      {done && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 flex items-center gap-4">
          <span className="text-3xl">✅</span>
          <div className="flex-1">
            <p className="font-bold text-green-800 dark:text-green-200">Nhập kho thành công!</p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Phiếu <strong>{done.maPhieu}</strong> đã được tạo. Tồn kho đã cập nhật.
            </p>
          </div>
          <button onClick={reset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
            Nhập thêm
          </button>
        </div>
      )}

      {/* Upload zone */}
      {!session && !done && (
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-14 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          {uploading
            ? <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
            : <>
                <span className="material-symbols-outlined text-5xl text-gray-300 block mb-3">upload_file</span>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Kéo thả hoặc click để chọn file</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ: .csv, .xlsx</p>
              </>
          }
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} className="hidden" />
        </div>
      )}

      {/* Preview */}
      {session && rows.length > 0 && (
        <>
          {/* Summary + tip */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">📄 {stats.total} dòng</span>
            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">✓ {stats.ok} OK</span>
            {stats.chuaMap > 0 && <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">⚠ {stats.chuaMap} chưa map</span>}
            {stats.loi > 0 && <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-medium">✗ {stats.loi} lỗi</span>}
            <span className="text-xs text-gray-400 ml-2">💡 Click vào ô bất kỳ để chỉnh sửa trực tiếp</span>
          </div>

          {/* Thông tin phiếu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nhà cung cấp</label>
              <input value={nhaCungCap} onChange={e => setNhaCungCap(e.target.value)}
                placeholder="VD: Công ty TNHH ABC"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Ghi chú phiếu</label>
              <input value={ghiChu} onChange={e => setGhiChu(e.target.value)}
                placeholder="VD: Lô hàng tháng 6/2025"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow overflow-x-auto">
             <table className="w-full text-sm min-w-[900px]">
               <thead className="bg-gray-50 dark:bg-gray-700/50">
                 <tr>
                   <th className="text-center px-3 py-3 font-semibold text-gray-500 w-10">#</th>
                   <th className="text-left px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">Tên SP (từ file)</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-24">ID SP</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-20">SL</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-28">Giá nhập</th>
                   <th className="text-left px-3 py-3 font-semibold text-gray-600 dark:text-gray-300">Ghi chú</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-32">HSD</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-28">Số lô</th>
                   <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-300 w-24">Trạng thái</th>
                   <th className="w-10 px-3 py-3" />
                 </tr>
               </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {rows.map(row => (
                  <tr key={row.id}
                    className={`transition-colors ${row.trangThai === 'LOI' ? 'bg-red-50/30 dark:bg-red-900/10' : row.trangThai === 'CHUA_MAP' ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20'}`}
                  >
                    <td className="px-3 py-2 text-center text-xs text-gray-400">{row.dongSo}</td>

                    {/* Tên SP — editable */}
                    <td className="px-3 py-2 max-w-[160px]">
                      <EditCell
                        value={row.tenSanPhamCsv}
                        onSave={v => saveCell(row.id, 'tenSanPhamCsv', v)}
                      />
                      {row.loi && <p className="text-xs text-red-500 mt-0.5 px-1">{row.loi}</p>}
                    </td>

                    {/* ID SP — editable, khi save tự re-validate */}
                    <td className="px-3 py-2">
                      <EditCell
                        value={row.idSanPham}
                        type="number"
                        onSave={v => saveCell(row.id, 'idSanPham', v)}
                        className="text-center"
                      />
                    </td>

                    {/* Số lượng — editable */}
                    <td className="px-3 py-2">
                      <EditCell
                        value={row.soLuong}
                        type="number"
                        onSave={v => saveCell(row.id, 'soLuong', v)}
                        className="text-center font-semibold"
                      />
                    </td>

                    {/* Giá nhập — editable */}
                    <td className="px-3 py-2">
                      <EditCell
                        value={row.giaNhap}
                        type="number"
                        onSave={v => saveCell(row.id, 'giaNhap', v)}
                        className="text-center text-gray-600"
                      />
                    </td>

                     {/* Ghi chú — editable */}
                     <td className="px-3 py-2 max-w-[150px]">
                       <EditCell
                         value={row.ghiChu}
                         onSave={v => saveCell(row.id, 'ghiChu', v)}
                         className="text-gray-500 text-xs"
                       />
                     </td>

                     {/* Hạn sử dụng — editable date */}
                     <td className="px-3 py-2">
                       <EditCell
                         value={row.hanSuDung}
                         type="date"
                         onSave={v => saveCell(row.id, 'hanSuDung', v)}
                         className="text-center text-sm"
                         warning={row.hanSuDung && calculateMonthsToExpiry(row.hanSuDung) < 6 ? `HSD < 6 tháng (${calculateMonthsToExpiry(row.hanSuDung)} tháng)` : null}
                         error={row.hanSuDung && new Date(row.hanSuDung) < new Date() ? 'HSD đã quá hạn' : null}
                       />
                     </td>

                     {/* Số lô — editable */}
                     <td className="px-3 py-2">
                       <EditCell
                         value={row.soLo}
                         onSave={v => saveCell(row.id, 'soLo', v)}
                         className="text-center text-sm"
                       />
                     </td>

                     {/* Status */}
                     <td className="px-3 py-2 text-center">
                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_STYLE[row.trangThai] || 'bg-gray-100 text-gray-500'}`}>
                         {STATUS_LABEL[row.trangThai] || row.trangThai}
                       </span>
                     </td>

                     {/* Xóa dòng */}
                     <td className="px-2 py-2 text-center">
                       <button onClick={() => deleteRow(row.id)}
                         className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-300 hover:text-red-500 transition-colors"
                         title="Xóa dòng này">
                         <span className="material-symbols-outlined text-base">delete</span>
                       </button>
                     </td>
                  </tr>
                ))}

                 {/* Thêm dòng mới */}
                 <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                   <td colSpan={10} className="px-3 py-2">
                     <button onClick={addRow}
                       className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                       <span className="material-symbols-outlined text-base">add_circle</span>
                       Thêm dòng mới
                     </button>
                   </td>
                 </tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleConfirm} disabled={confirming || stats.ok === 0}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2">
              {confirming
                ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                : <span className="material-symbols-outlined text-base">check_circle</span>}
              Duyệt nhập kho ({stats.ok} dòng OK)
            </button>
            <button onClick={reset}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Hủy & upload lại
            </button>
            {(stats.chuaMap > 0 || stats.loi > 0) && (
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">info</span>
                {stats.chuaMap + stats.loi} dòng chưa hợp lệ sẽ bị bỏ qua khi duyệt
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminImportKhoPage;

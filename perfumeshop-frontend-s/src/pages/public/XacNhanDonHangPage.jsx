import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

/* ── Helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫';

const STATUS_CFG = {
  'Đang chờ':       { text: 'Đang chờ xác nhận',   dot: 'bg-blue-400'   },
  'Đã xác nhận':    { text: 'Đã xác nhận',          dot: 'bg-green-400'  },
  'Đang giao hàng': { text: 'Đang trên đường giao', dot: 'bg-purple-400' },
  'Hoàn thành':     { text: 'Đã hoàn thành',        dot: 'bg-teal-400'   },
  'Đã hủy':         { text: 'Đã hủy',               dot: 'bg-red-400'    },
  'Đã hoàn trả':    { text: 'Đã hoàn trả',          dot: 'bg-orange-400' },
};

const PTTT_LABEL = {
  cod:    'Thanh toán khi nhận hàng (COD)',
  online: 'Thanh toán online (PayOS)',
};

/* ── Divider ── */
const Divider = () => <div className="border-t border-dashed border-gray-200 my-3" />;

/* ── Trang chính ── */
const XacNhanDonHangPage = () => {
  const { orderId } = useParams();

  const [order,      setOrder]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [step,       setStep]       = useState('bill');   // 'bill' | 'return-form' | 'done'
  const [returnReason, setReturnReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [doneMsg,    setDoneMsg]    = useState({ icon: '', text: '' });

  useEffect(() => {
    api.getOrderDetails(parseInt(orderId))
      .then(data => setOrder(data))
      .catch(() => setError('Không tìm thấy đơn hàng hoặc đường link không hợp lệ.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleConfirmReceived = async () => {
    if (!window.confirm('Xác nhận bạn đã nhận được hàng?')) return;
    try {
      setSubmitting(true);
      await api.completeOrder(parseInt(orderId));
      setOrder(prev => ({ ...prev, trangThaiVanHanh: 'Hoàn thành' }));
      setDoneMsg({ icon: '✅', text: 'Đã xác nhận nhận hàng! Cảm ơn bạn đã mua sắm tại Enstorm Perfume.' });
      setStep('done');
    } catch (e) { alert('Lỗi: ' + e.message); }
    finally { setSubmitting(false); }
  };

  const handleSubmitReturn = async () => {
    if (!returnReason.trim()) { alert('Vui lòng nhập lý do đổi trả'); return; }
    if (!order?.idNguoiDung) {
      alert('Không xác định được khách hàng. Vui lòng đổi trả qua trang Lịch sử đơn hàng.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createReturn({ idDonHang: parseInt(orderId), idNguoiDung: order.idNguoiDung, lyDo: returnReason.trim() });
      setDoneMsg({ icon: '📦', text: 'Yêu cầu đổi trả đã được gửi! Chúng tôi sẽ liên hệ trong 1–2 ngày làm việc.' });
      setStep('done');
    } catch (e) { alert('Lỗi: ' + e.message); }
    finally { setSubmitting(false); }
  };

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
    </div>
  );
  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <span className="text-5xl">❌</span>
        <h2 className="text-xl font-bold text-red-600 mt-4 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  );

  const cfg        = STATUS_CFG[order.trangThaiVanHanh] || { text: order.trangThaiVanHanh, dot: 'bg-gray-400' };
  const canConfirm = order.trangThaiVanHanh === 'Đang giao hàng';
  const canReturn  = order.trangThaiVanHanh === 'Đang giao hàng';
  const isDone     = ['Hoàn thành', 'Đã hủy', 'Đã hoàn trả'].includes(order.trangThaiVanHanh);

  /* ── Render dạng bill receipt ── */
  const items = order.chiTietDonHangs || [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center px-3 py-8">
      {/* Bill card — max-w-sm giống receipt thật */}
      <div className="bg-white w-full max-w-sm shadow-xl rounded-2xl overflow-hidden font-mono">

        {/* Header shop */}
        <div className="bg-indigo-600 text-white text-center px-6 py-5">
          <p className="text-xs tracking-[0.2em] uppercase opacity-70 mb-1">Enstorm Perfume</p>
          <p className="text-xs opacity-60">Nước hoa cao cấp</p>
          <div className="my-3 border-t border-indigo-400 border-dashed" />
          <p className="text-xs opacity-70">HOÁ ĐƠN GIAO HÀNG</p>
          <p className="text-2xl font-bold tracking-wider mt-1">#{order.idDonHang}</p>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border-b border-dashed border-gray-200">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{cfg.text}</span>
        </div>

        <div className="px-5 py-4 space-y-1 text-xs text-gray-600">

          {/* Thông tin giao hàng */}
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-widest">Thông tin nhận hàng</p>
          <div className="flex justify-between">
            <span className="text-gray-400">Người nhận</span>
            <span className="font-semibold text-gray-800 text-right max-w-[55%]">{order.tenNguoiNhan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SĐT</span>
            <span>{order.soDienThoai}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400 shrink-0">Địa chỉ</span>
            <span className="text-right">{order.diaChiGiaoHang}</span>
          </div>
          {order.maVanDon && (
            <div className="flex justify-between">
              <span className="text-gray-400">Mã vận đơn</span>
              <span className="font-mono font-bold text-indigo-600">{order.maVanDon}</span>
            </div>
          )}
          {order.ngayDatHang && (
            <div className="flex justify-between">
              <span className="text-gray-400">Ngày đặt</span>
              <span>{new Date(order.ngayDatHang).toLocaleDateString('vi-VN')}</span>
            </div>
          )}

          <Divider />

          {/* Danh sách sản phẩm */}
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-widest">Sản phẩm</p>
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-gray-400 text-center py-2">Không có sản phẩm</p>
            ) : items.map((ct, i) => {
              const gia  = Number(ct.giaTaiThoiDiemMua || 0);
              const sl   = ct.soLuong || 1;
              const name = ct.tenSanPham || `Sản phẩm #${ct.sanPhamId}`;
              return (
                <div key={i} className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium leading-tight truncate">{name}</p>
                    <p className="text-gray-400">{fmt(gia)} × {sl}</p>
                  </div>
                  <p className="font-semibold text-gray-800 whitespace-nowrap">{fmt(gia * sl)}</p>
                </div>
              );
            })}
          </div>

          <Divider />

          {/* Tổng */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tạm tính ({items.length} SP)</span>
            <span>{fmt(order.tongTien)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span className="text-green-600 font-semibold">Miễn phí</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
            <span className="font-bold text-gray-800 text-sm">TỔNG CỘNG</span>
            <span className="font-bold text-indigo-600 text-base">{fmt(order.tongTien)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Thanh toán</span>
            <span className="text-right max-w-[60%]">{PTTT_LABEL[order.phuongThucThanhToan] || order.phuongThucThanhToan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trạng thái TT</span>
            <span className={order.trangThaiThanhToan === 'Đã thanh toán' ? 'text-green-600 font-semibold' : 'text-orange-500'}>
              {order.trangThaiThanhToan}
            </span>
          </div>

          {order.ghiChu && (
            <>
              <Divider />
              <div>
                <span className="text-gray-400">Ghi chú: </span>
                <span className="text-gray-700">{order.ghiChu}</span>
              </div>
            </>
          )}
        </div>

        {/* Barcode decorative */}
        <div className="px-5 pb-2">
          <div className="flex gap-[2px] justify-center opacity-20">
            {Array.from({ length: 40 }, (_, i) => (
              <div key={i} className="bg-gray-800" style={{ width: i % 3 === 0 ? 3 : 1, height: 24 }} />
            ))}
          </div>
          <p className="text-center text-[9px] text-gray-300 mt-1 tracking-widest">
            {String(order.idDonHang).padStart(12, '0')}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="px-5 pb-6 pt-1 space-y-2">

          {/* Đơn đang giao — 2 nút hành động */}
          {step === 'bill' && canConfirm && (
            <>
              <p className="text-xs text-center text-gray-500 mb-2">Bạn vừa nhận được kiện hàng này?</p>
              <button
                onClick={handleConfirmReceived}
                disabled={submitting}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting
                  ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  : <span>✓</span>}
                Đã nhận hàng
              </button>
              {canReturn && (
                <button
                  onClick={() => setStep('return-form')}
                  className="w-full bg-orange-100 text-orange-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-200 transition-colors"
                >
                  ↩ Muốn đổi / trả hàng
                </button>
              )}
            </>
          )}

          {/* Form đổi trả */}
          {step === 'return-form' && (
            <div className="space-y-3">
              <button onClick={() => setStep('bill')} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                ← Quay lại
              </button>
              <p className="font-bold text-gray-800 text-sm">Yêu cầu đổi / trả hàng</p>
              <textarea
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                placeholder="VD: Sản phẩm bị vỡ, sai mùi..."
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none font-sans"
              />
              <button
                onClick={handleSubmitReturn}
                disabled={submitting || !returnReason.trim()}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          )}

          {/* Done — sau khi xác nhận nhận hàng hoặc gửi đổi trả */}
          {step === 'done' && (
            <div className="text-center space-y-3 py-2">
              <p className="text-3xl">{doneMsg.icon}</p>
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">{doneMsg.text}</p>
              {/* Nút chuyển qua xem chi tiết đơn trên website */}
              <a
                href={`/lich-su-don-hang`}
                className="block w-full bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-indigo-600 transition-colors mt-1"
              >
                Xem lịch sử đơn hàng
              </a>
              <a
                href="/"
                className="block text-xs text-gray-400 hover:text-gray-600 hover:underline"
              >
                Về trang chủ
              </a>
            </div>
          )}

          {/* Đơn đã xong (hoàn thành / hủy / hoàn trả) — không có action */}
          {step === 'bill' && isDone && (
            <div className="text-center py-2 space-y-2">
              <p className="text-xs text-gray-400">Đơn hàng đã được xử lý xong.</p>
              <a
                href="/lich-su-don-hang"
                className="block w-full bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-indigo-600 transition-colors"
              >
                Xem lịch sử đơn hàng
              </a>
            </div>
          )}

          {/* Đơn chưa đến tay */}
          {step === 'bill' && !canConfirm && !isDone && (
            <p className="text-xs text-center text-gray-400 py-2">
              Đơn hàng chưa được giao đến bạn. Khi nhận hàng, quét lại mã QR để xác nhận.
            </p>
          )}
        </div>

        <p className="text-center text-[9px] text-gray-200 pb-3 tracking-widest uppercase">
          Enstorm Perfume · {new Date().getFullYear()} · Cảm ơn bạn đã tin tưởng
        </p>
      </div>
    </div>
  );
};

export default XacNhanDonHangPage;

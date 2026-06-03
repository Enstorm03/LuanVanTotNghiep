import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PUBLIC_BASE_URL = 'https://pendant-moustache-flask.ngrok-free.dev';

const STATUS_LABEL = {
  'Đang chờ':       { text: 'Đang chờ xác nhận',   color: 'text-blue-600',   bg: 'bg-blue-50'   },
  'Đã xác nhận':    { text: 'Đã xác nhận',          color: 'text-green-600',  bg: 'bg-green-50'  },
  'Đang giao hàng': { text: 'Đang trên đường giao', color: 'text-purple-600', bg: 'bg-purple-50' },
  'Hoàn thành':     { text: 'Đã hoàn thành',        color: 'text-teal-600',   bg: 'bg-teal-50'   },
  'Đã hủy':         { text: 'Đã hủy',               color: 'text-red-600',    bg: 'bg-red-50'    },
};

const XacNhanDonHangPage = () => {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order, setOrder]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [step, setStep]             = useState('main'); // 'main' | 'return-form' | 'done'
  const [returnReason, setReturnReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [doneMessage, setDoneMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getOrderDetails(parseInt(orderId));
        setOrder(data);
      } catch {
        setError('Không tìm thấy đơn hàng hoặc đường link không hợp lệ.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  // Khách bấm "Đã nhận hàng" → complete đơn
  const handleConfirmReceived = async () => {
    if (!window.confirm('Xác nhận bạn đã nhận được hàng?')) return;
    try {
      setSubmitting(true);
      await api.completeOrder(parseInt(orderId));
      setDoneMessage('✅ Đã xác nhận nhận hàng! Cảm ơn bạn đã mua sắm tại Enstorm Perfume.');
      setStep('done');
    } catch (e) {
      alert('Lỗi: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Khách gửi yêu cầu đổi trả
  const handleSubmitReturn = async () => {
    if (!returnReason.trim()) {
      alert('Vui lòng nhập lý do đổi trả');
      return;
    }
    if (!order?.idNguoiDung) {
      alert('Không xác định được khách hàng. Vui lòng đăng nhập và đổi trả qua trang Lịch sử đơn hàng.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createReturn({
        idDonHang:    parseInt(orderId),
        idNguoiDung:  order.idNguoiDung,
        lyDo:         returnReason.trim(),
      });
      setDoneMessage('📦 Yêu cầu đổi trả đã được gửi! Chúng tôi sẽ liên hệ trong 1–2 ngày làm việc.');
      setStep('done');
    } catch (e) {
      alert('Lỗi: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  //  Loading 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  //  Lỗi 
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <span className="text-5xl">❌</span>
          <h2 className="text-xl font-bold text-red-600 mt-4 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_LABEL[order.trangThaiVanHanh] || { text: order.trangThaiVanHanh, color: 'text-gray-600', bg: 'bg-gray-50' };
  const canConfirm   = order.trangThaiVanHanh === 'Đang giao hàng';
  const canReturn    = order.trangThaiVanHanh === 'Đang giao hàng';
  const alreadyDone  = ['Hoàn thành', 'Đã hủy', 'Đã hoàn trả'].includes(order.trangThaiVanHanh);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-indigo-600 px-6 py-5 text-white text-center">
          <p className="text-xs tracking-widest opacity-70 uppercase">Enstorm Perfume</p>
          <h1 className="text-xl font-bold mt-1">Đơn hàng #{order.idDonHang}</h1>
        </div>

        {/* ── Trạng thái ── */}
        <div className={`px-6 py-3 text-center text-sm font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
          {statusInfo.text}
        </div>

        {/* ── Thông tin đơn ── */}
        {step !== 'done' && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 text-sm text-gray-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-400">Người nhận</span>
              <span className="font-medium text-gray-800">{order.tenNguoiNhan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Số điện thoại</span>
              <span>{order.soDienThoai}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 shrink-0">Địa chỉ</span>
              <span className="text-right">{order.diaChiGiaoHang}</span>
            </div>
            {order.maVanDon && (
              <div className="flex justify-between">
                <span className="text-gray-400">Mã vận đơn</span>
                <span className="font-mono">{order.maVanDon}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-gray-200">
              <span className="text-gray-400">Tổng tiền</span>
              <span className="font-bold text-indigo-600">
                {Number(order.tongTien).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        )}

        <div className="px-6 py-6">

          {/* ── Bước 1: Chọn hành động ── */}
          {step === 'main' && (
            <>
              {/* Đơn chưa đến tay — chỉ hiển thị thông tin */}
              {!canConfirm && !alreadyDone && (
                <div className="text-center text-sm text-gray-500 py-2">
                  <p>Đơn hàng chưa được giao đến bạn.</p>
                  <p className="text-xs mt-1">Khi nhận hàng, quét lại mã QR này để xác nhận.</p>
                </div>
              )}

              {/* Đơn đã xong */}
              {alreadyDone && (
                <div className="text-center text-sm text-gray-500 py-2">
                  <p>Đơn hàng đã được xử lý xong.</p>
                </div>
              )}

              {/* Đang giao — hiển thị 2 nút hành động */}
              {canConfirm && (
                <div className="space-y-3">
                  <p className="text-center text-gray-600 text-sm mb-2">
                    Bạn vừa nhận được kiện hàng này?
                  </p>
                  <button
                    onClick={handleConfirmReceived}
                    disabled={submitting}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting
                      ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      : '✓'}
                    Đã nhận hàng
                  </button>
                  {canReturn && (
                    <button
                      onClick={() => setStep('return-form')}
                      className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      ↩ Muốn đổi / trả hàng
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── Bước 2: Form đổi trả ── */}
          {step === 'return-form' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('main')}
                className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1"
              >
                ← Quay lại
              </button>
              <h2 className="font-bold text-gray-800">Yêu cầu đổi / trả hàng</h2>
              <p className="text-sm text-gray-500">Mô tả lý do bạn muốn đổi hoặc trả hàng:</p>
              <textarea
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                placeholder="VD: Sản phẩm bị vỡ, sai mùi so với đặt hàng..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <button
                onClick={handleSubmitReturn}
                disabled={submitting || !returnReason.trim()}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting
                  ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  : null}
                Gửi yêu cầu đổi trả
              </button>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div className="text-center space-y-3 py-2">
              <p className="text-base font-semibold text-gray-800 leading-relaxed">{doneMessage}</p>
              <button
                onClick={() => navigate('/')}
                className="text-indigo-500 text-sm hover:underline"
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>

        <div className="pb-4 text-center">
          <p className="text-xs text-gray-300">Enstorm Perfume · {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default XacNhanDonHangPage;

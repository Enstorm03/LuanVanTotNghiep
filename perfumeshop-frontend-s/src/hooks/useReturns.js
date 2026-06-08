import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useReturns = () => {
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchAllReturns();
  }, []);

  const fetchAllReturns = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAllReturns();
      setReturns(data || []);
    } catch (err) {
      console.error('Error fetching returns:', err);
      setError('Không thể tải danh sách đổi trả');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async (returnId) => {
    // Hỏi admin tình trạng hàng trả về để quyết định có hoàn kho không
    const choice = window.confirm(
      'Tình trạng hàng trả về:\n\n' +
      '✅ Bấm OK  → Hàng còn tốt, hoàn vào kho\n' +
      '❌ Bấm Hủy → Hàng bị hỏng/vỡ, KHÔNG hoàn kho (vẫn hoàn tiền khách)'
    );
    // null = đóng dialog (ESC) → hủy luôn, không xử lý
    // true  = OK  → hoanKho = true
    // false = Hủy → hoanKho = false (vẫn duyệt, chỉ không hoàn kho)
    // Phân biệt: confirm trả về true/false, không có null trên web → dùng thêm bước xác nhận
    const confirmed = window.confirm(
      choice
        ? 'Xác nhận duyệt và HOÀN KHO hàng trả về?'
        : 'Xác nhận duyệt KHÔNG HOÀN KHO (hàng hỏng)? Khách vẫn được hoàn tiền.'
    );
    if (!confirmed) return;

    try {
      setProcessing(returnId);
      const employeeId = user?.id_nhan_vien || user?.id || 1;
      await api.approveReturn(returnId, employeeId, choice);
      alert(
        choice
          ? 'Đã duyệt và hoàn kho! Vui lòng hoàn tiền cho khách và bấm "Xác nhận đã hoàn tiền".'
          : 'Đã duyệt (hàng hỏng — không hoàn kho). Vui lòng hoàn tiền cho khách.'
      );
      await fetchAllReturns();
    } catch (error) {
      alert('Không thể duyệt: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleConfirmRefund = async (returnId, soTienHoan) => {
    if (!window.confirm(
      `Xác nhận đã hoàn tiền ${Number(soTienHoan).toLocaleString('vi-VN')}₫ cho khách?\n\nThao tác này không thể hoàn tác.`
    )) return;

    try {
      setProcessing(returnId);
      const employeeId = user?.id_nhan_vien || user?.id || 1;
      await api.confirmRefund(returnId, employeeId);
      alert('Đã xác nhận hoàn tiền thành công! Quy trình đổi trả hoàn tất.');
      await fetchAllReturns();
    } catch (error) {
      alert('Không thể xác nhận: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectReturn = async (returnId) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason || !reason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(returnId);
      const employeeId = user?.id_nhan_vien || user?.id || 1;
      await api.rejectReturn(returnId, employeeId, reason.trim());
      alert('Đã từ chối phiếu đổi trả!');
      await fetchAllReturns();
    } catch (error) {
      alert('Không thể từ chối: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const getPendingCount       = () => returns.filter(r => r.trangThai === 'Chờ duyệt').length;
  const getWaitingRefundCount = () => returns.filter(r => r.trangThai === 'Chờ hoàn tiền').length;
  const getApprovedCount      = () => returns.filter(r => r.trangThai === 'Hoàn tiền thành công').length;
  const getRejectedCount      = () => returns.filter(r => r.trangThai === 'Từ chối').length;

  return {
    returns,
    loading,
    error,
    processing,
    fetchAllReturns,
    handleApproveReturn,
    handleConfirmRefund,
    handleRejectReturn,
    getPendingCount,
    getWaitingRefundCount,
    getApprovedCount,
    getRejectedCount,
  };
};

export default useReturns;

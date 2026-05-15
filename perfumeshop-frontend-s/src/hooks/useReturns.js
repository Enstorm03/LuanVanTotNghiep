import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useReturns = () => {
  const { staff } = useAuth();
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
      console.log('useReturns - Fetching all returns...');

      // Now backend has getAllReturns endpoint
      const returnsData = await api.getAllReturns();
      console.log('useReturns - All returns data received:', returnsData);

      setReturns(returnsData || []);
      console.log('useReturns - Returns state set to:', returnsData || []);

      // Debug: Log statistics
      const pending = returnsData?.filter(r => r.trangThai === 'Chờ duyệt').length || 0;
      const approved = returnsData?.filter(r => r.trangThai === 'Đã duyệt').length || 0;
      const rejected = returnsData?.filter(r => r.trangThai === 'Từ chối').length || 0;
      console.log('useReturns - Statistics:', { pending, approved, rejected });
    } catch (err) {
      console.error('Error fetching returns:', err);
      console.log('useReturns - Falling back to pending returns...');
      // Fallback to pending returns if getAllReturns fails
      try {
        const pendingData = await api.getPendingReturns();
        setReturns(pendingData || []);
      } catch (fallbackErr) {
        console.error('useReturns - Fallback also failed:', fallbackErr);
        setError('Không thể tải danh sách đổi trả');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async (returnId) => {
    if (!window.confirm('Bạn có chắc muốn duyệt phiếu đổi trả này? Hệ thống sẽ hoàn kho tất cả sản phẩm và đơn hàng sẽ được xử lý theo quy định.')) {
      return;
    }

    try {
      setProcessing(returnId);
      const employeeId = staff?.id_nhan_vien || 1; // Use staff ID or fallback to 1
      await api.approveReturn(returnId, employeeId);
      alert('Đã duyệt phiếu đổi trả thành công! Đơn hàng sẽ được xử lý theo quy định.');
      await fetchAllReturns(); // Refresh the list
    } catch (error) {
      alert('Không thể duyệt phiếu đổi trả: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectReturn = async (returnId) => {
    const reason = prompt('Lý do từ chối:');
    if (!reason || reason.trim() === '') {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(returnId);
      const employeeId = staff?.id_nhan_vien || 1; // Use staff ID or fallback to 1
      await api.rejectReturn(returnId, employeeId);
      alert('Đã từ chối phiếu đổi trả!');
      await fetchAllReturns(); // Refresh the list
    } catch (error) {
      alert('Không thể từ chối phiếu đổi trả: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  // Calculate summary statistics
  const getPendingCount = () => returns.filter(r => r.trangThai === 'Chờ duyệt').length;
  const getApprovedCount = () => returns.filter(r => r.trangThai === 'Đã duyệt').length;
  const getRejectedCount = () => returns.filter(r => r.trangThai === 'Từ chối').length;

  return {
    returns,
    loading,
    error,
    processing,
    fetchAllReturns,
    handleApproveReturn,
    handleRejectReturn,
    getPendingCount,
    getApprovedCount,
    getRejectedCount
  };
};

export default useReturns;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useOrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [brandDetails, setBrandDetails] = useState({});

  // Action states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShipDialog, setShowShipDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMoveToPendingDialog, setShowMoveToPendingDialog] = useState(false);
  const [showUpdateRecipientDialog, setShowUpdateRecipientDialog] = useState(false);
  const [showPaymentCollectedDialog, setShowPaymentCollectedDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Recipient info for editing
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh khi đơn đang chờ thanh toán PayOS (mỗi 10 giây)
  // Dừng khi đơn chuyển sang trạng thái cuối
  useEffect(() => {
    const finalStatuses = ['Hoàn thành', 'Đã hủy', 'Đã hoàn trả'];
    if (!order || finalStatuses.includes(order.trangThaiVanHanh)) return;
    if (order.trangThaiThanhToan === 'Đã thanh toán') return;

    const interval = setInterval(() => {
      // Refresh nhẹ — không set loading để tránh flicker
      api.getOrderDetails(parseInt(orderId)).then(data => {
        setOrder(data);
      }).catch(() => {});
    }, 10000); // 10 giây

    return () => clearInterval(interval);
  }, [order, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = await api.getOrderDetails(parseInt(orderId));

      if (orderData.chiTietDonHangs && orderData.chiTietDonHangs.length > 0) {
        try {
          const [allProducts, allBrands] = await Promise.all([
            api.getAllProducts(),
            api.getBrands()
          ]);
          const productMap = {};
          const brandMap = {};
          allProducts.forEach(p => { productMap[p.id_san_pham] = p; });
          allBrands.forEach(b => { brandMap[b.idThuongHieu] = b.tenThuongHieu; });
          setProductDetails(productMap);
          setBrandDetails(brandMap);
        } catch (productError) {
          console.error('Error fetching product/brand details:', productError);
        }
      }

      setOrder(orderData);
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.confirmOrder(parseInt(orderId), user?.id_nhan_vien || 1);
      setOrder(updatedOrder);
      setShowConfirmDialog(false);
      alert('Đơn hàng đã được xác nhận thành công!');
    } catch (error) {
      alert('Không thể xác nhận đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleShipOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.shipOrder(parseInt(orderId));
      setOrder(updatedOrder);
      setShowShipDialog(false);
      alert('Đơn hàng đã được chuyển sang trạng thái đang giao!');
    } catch (error) {
      alert('Không thể chuyển trạng thái đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      alert('Vui lòng nhập mã vận đơn');
      return;
    }

    try {
      setProcessing(true);
      const updatedOrder = await api.updateTracking(parseInt(orderId), trackingNumber.trim());
      setOrder(updatedOrder);
      setShowTrackingDialog(false);
      setTrackingNumber('');
      alert('Mã vận đơn đã được cập nhật!');
    } catch (error) {
      alert('Không thể cập nhật mã vận đơn: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.completeOrder(parseInt(orderId));
      setOrder(updatedOrder);
      alert('Đơn hàng đã hoàn thành! Trạng thái thanh toán đã được cập nhật.');
    } catch (error) {
      alert('Không thể hoàn thành đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      setProcessing(true);
      const updatedOrder = await api.cancelOrder(parseInt(orderId), cancelReason.trim());
      setOrder(updatedOrder);
      setShowCancelDialog(false);
      setCancelReason('');
      alert('Đơn hàng đã được hủy!');
    } catch (error) {
      alert('Không thể hủy đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMoveToPending = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.moveToPending(parseInt(orderId));
      setOrder(updatedOrder);
      setShowMoveToPendingDialog(false);
      alert('Đơn hàng đã được chuyển sang trạng thái đang chờ!');
    } catch (error) {
      alert('Không thể chuyển trạng thái đơn hàng: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRecipient = async () => {
    if (!recipientName.trim() || !recipientAddress.trim()) {
      alert('Vui lòng nhập đầy đủ tên người nhận và địa chỉ giao hàng');
      return;
    }

    try {
      setProcessing(true);
      const recipientData = {
        tenNguoiNhan: recipientName.trim(),
        diaChiGiaoHang: recipientAddress.trim()
      };
      const updatedOrder = await api.updateOrderRecipient(parseInt(orderId), recipientData);
      setOrder(updatedOrder);
      setShowUpdateRecipientDialog(false);
      setRecipientName('');
      setRecipientAddress('');
      alert('Thông tin người nhận đã được cập nhật!');
    } catch (error) {
      alert('Không thể cập nhật thông tin người nhận: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCollected = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.markPaymentCollected(parseInt(orderId));
      setOrder(updatedOrder);
      setShowPaymentCollectedDialog(false);
      alert('Đã xác nhận thu đủ tiền còn lại!');
    } catch (error) {
      alert('Không thể cập nhật trạng thái thanh toán: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.updatePaymentStatus(parseInt(orderId), true);
      setOrder(updatedOrder);
      alert('Đã cập nhật trạng thái thanh toán thành công!');
    } catch (error) {
      alert('Không thể cập nhật trạng thái thanh toán: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return {
    order,
    loading,
    error,
    processing,
    productDetails,
    brandDetails,
    showConfirmDialog,
    showShipDialog,
    showTrackingDialog,
    showCancelDialog,
    showMoveToPendingDialog,
    showUpdateRecipientDialog,
    showPaymentCollectedDialog,
    trackingNumber,
    cancelReason,
    recipientName,
    recipientAddress,
    setShowConfirmDialog,
    setShowShipDialog,
    setShowTrackingDialog,
    setShowCancelDialog,
    setShowMoveToPendingDialog,
    setShowUpdateRecipientDialog,
    setShowPaymentCollectedDialog,
    setTrackingNumber,
    setCancelReason,
    setRecipientName,
    setRecipientAddress,
    fetchOrderDetails,
    handleConfirmOrder,
    handleShipOrder,
    handleUpdateTracking,
    handleCompleteOrder,
    handleCancelOrder,
    handleMoveToPending,
    handleUpdateRecipient,
    handlePaymentCollected,
    handleUpdatePaymentStatus
  };
};

export default useOrderDetail;

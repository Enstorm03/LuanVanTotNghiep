import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
// file này để lấy dữ liệu chi tiết đơn hàng, tránh gọi API nhiều lần
const useOrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [brandDetails, setBrandDetails] = useState({});
  const [pickList, setPickList] = useState([]); // FEFO Pick List data

  // Action states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShipDialog, setShowShipDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMoveToPendingDialog, setShowMoveToPendingDialog] = useState(false);

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
// Fetch chi tiết đơn hàng từ backend
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

      // Fetch FEFO Pick List nếu đơn đã xác nhận
      if (orderData.trangThaiVanHanh !== 'Đang chờ' && orderData.trangThaiVanHanh !== 'Đã hủy') {
        try {
          const pickListData = await api.getPickList(parseInt(orderId));
          setPickList(Array.isArray(pickListData) ? pickListData : []);
        } catch (pickListError) {
          console.error('Error fetching pick list:', pickListError);
          setPickList([]);
        }
      } else {
        setPickList([]);
      }
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

  const handleMarkRefunded = async () => {
    try {
      setProcessing(true);
      const updatedOrder = await api.markRefunded(parseInt(orderId));
      setOrder(updatedOrder);
      alert('Đã cập nhật trạng thái đơn hàng thành Đã hoàn tiền!');
    } catch (error) {
      alert('Không thể cập nhật trạng thái hoàn tiền: ' + error.message);
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
    pickList,
    showConfirmDialog,
    showShipDialog,
    showCancelDialog,
    showMoveToPendingDialog,


    cancelReason,
    recipientName,
    recipientAddress,
    setShowConfirmDialog,
    setShowShipDialog,
    setShowCancelDialog,
    setShowMoveToPendingDialog,
 
 
    setCancelReason,
    setRecipientName,
    setRecipientAddress,
    fetchOrderDetails,
    handleConfirmOrder,
    handleShipOrder,
    handleCompleteOrder,
    handleCancelOrder,
    handleMoveToPending,

    handleUpdatePaymentStatus,
    handleMarkRefunded
  };
};

export default useOrderDetail;

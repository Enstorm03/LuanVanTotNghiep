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

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = await api.getOrderDetails(parseInt(orderId));
      console.log('Raw order details:', orderData);
      console.log('Order chiTiet:', orderData.chiTiet);
      console.log('Order chiTietDonHangs:', orderData.chiTietDonHangs);
      console.log('First chiTietDonHang item:', orderData.chiTietDonHangs?.[0]);
      console.log('First chiTietDonHang item structure:', orderData.chiTietDonHangs?.[0] ? Object.keys(orderData.chiTietDonHangs[0]) : 'No items');

      // Fetch product details for each item to get brand, volume, concentration
      if (orderData.chiTietDonHangs && orderData.chiTietDonHangs.length > 0) {
        const productIds = orderData.chiTietDonHangs.map(item => item.sanPhamId);
        console.log('Fetching product details for IDs:', productIds);

        try {
          const [allProducts, allBrands] = await Promise.all([
            api.getAllProducts(),
            api.getBrands()
          ]);

          const productMap = {};
          const brandMap = {};

          // Create a map of product details by ID
          allProducts.forEach(product => {
            productMap[product.id_san_pham] = product;
          });

          // Create a map of brand details by ID
          allBrands.forEach(brand => {
            brandMap[brand.idThuongHieu] = brand.tenThuongHieu;
          });

          console.log('Product map created:', productMap);
          console.log('Brand map created:', brandMap);

          // Store product and brand details
          setProductDetails(productMap);
          setBrandDetails(brandMap);
        } catch (productError) {
          console.error('Error fetching product/brand details:', productError);
          // Continue without product details
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

      // Nếu đơn hàng chưa được thanh toán, tự động đánh dấu đã thanh toán
      if (order?.trangThaiThanhToan !== 'Đã thanh toán') {
        console.log('Order not paid, marking as paid before completing...');
        await api.updatePaymentStatus(parseInt(orderId), true);
      }

      // Hoàn thành đơn hàng
      const updatedOrder = await api.completeOrder(parseInt(orderId));
      setOrder(updatedOrder);
      alert('Đơn hàng đã được hoàn thành và đánh dấu đã thanh toán!');
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

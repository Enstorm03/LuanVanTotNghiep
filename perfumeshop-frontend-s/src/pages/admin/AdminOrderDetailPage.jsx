import React from 'react';
import { Link } from 'react-router-dom';
import useOrderDetail from '../../hooks/useOrderDetail';
import OrderProductsList from './orders/components/OrderProductsList';
import OrderCustomerInfo from './orders/components/OrderCustomerInfo';
import OrderInfoCard from './orders/components/OrderInfoCard';
import OrderActions from './orders/components/OrderActions';
import ConfirmOrderDialog from './orders/dialogs/ConfirmOrderDialog';
import ShipOrderDialog from './orders/dialogs/ShipOrderDialog';
import CancelOrderDialog from './orders/dialogs/CancelOrderDialog';

import MoveToPendingDialog from './orders/dialogs/MoveToPendingDialog';
import QRDialog from './orders/dialogs/QRDialog';

const AdminOrderDetailPage = () => {
  const [showQRDialog, setShowQRDialog] = React.useState(false);
  const {
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
  } = useOrderDetail();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Không thể tải đơn hàng!</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={fetchOrderDetails}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
          <Link to="/admin/orders" className="text-primary hover:underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Chi tiết Đơn hàng #{order.idDonHang}
        </h1>
        {/* Nút tạo QR — hiện từ khi đặt hàng cho đến khi hoàn thành */}
        {!['Đã hủy',  'Đã hoàn trả'].includes(order.trangThaiVanHanh) && (
          <button
            onClick={() => setShowQRDialog(true)}
            className="ml-auto flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base">qr_code</span>
            Mã QR
          </button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Products List */}
        <div className="md:col-span-2">
          <OrderProductsList
            order={order}
            productDetails={productDetails}
            brandDetails={brandDetails}
            pickList={pickList}
          />
        </div>

        {/* Order Info and Actions */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <OrderCustomerInfo order={order} />
          <OrderInfoCard order={order} />
          <OrderActions
            order={order}
            processing={processing}
            onConfirmOrder={handleConfirmOrder}
            onShipOrder={handleShipOrder}
            onCompleteOrder={handleCompleteOrder}
            onCancelOrder={handleCancelOrder}
            onMoveToPending={handleMoveToPending}
       
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onMarkRefunded={handleMarkRefunded}
            setShowConfirmDialog={setShowConfirmDialog}
            setShowShipDialog={setShowShipDialog}
            setShowCancelDialog={setShowCancelDialog}
        
            setRecipientName={setRecipientName}
            setRecipientAddress={setRecipientAddress}
          />
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmOrderDialog
        show={showConfirmDialog}
        onConfirm={handleConfirmOrder}
        onClose={() => setShowConfirmDialog(false)}
        orderId={order.idDonHang}
        processing={processing}
      />

      <ShipOrderDialog
        show={showShipDialog}
        onConfirm={handleShipOrder}
        onClose={() => setShowShipDialog(false)}
        orderId={order.idDonHang}
        maVanDon={order.maVanDon}
        processing={processing}
      />

      <CancelOrderDialog
        show={showCancelDialog}
        onConfirm={handleCancelOrder}
        onClose={() => setShowCancelDialog(false)}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        processing={processing}
      />

      <MoveToPendingDialog
        show={showMoveToPendingDialog}
        onConfirm={handleMoveToPending}
        onClose={() => setShowMoveToPendingDialog(false)}
        orderId={order.idDonHang}
        processing={processing}
      />

  

      <QRDialog
        show={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        order={order}
      />
    </div>
  );
};

export default AdminOrderDetailPage;

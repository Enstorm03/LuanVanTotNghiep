import React from 'react';
import { Link } from 'react-router-dom';
import useOrderDetail from '../../hooks/useOrderDetail';
import OrderProductsList from './orders/components/OrderProductsList';
import OrderCustomerInfo from './orders/components/OrderCustomerInfo';
import OrderInfoCard from './orders/components/OrderInfoCard';
import OrderActions from './orders/components/OrderActions';
import ConfirmOrderDialog from './orders/dialogs/ConfirmOrderDialog';
import ShipOrderDialog from './orders/dialogs/ShipOrderDialog';
import UpdateTrackingDialog from './orders/dialogs/UpdateTrackingDialog';
import CancelOrderDialog from './orders/dialogs/CancelOrderDialog';
import UpdateRecipientDialog from './orders/dialogs/UpdateRecipientDialog';
import MoveToPendingDialog from './orders/dialogs/MoveToPendingDialog';
import PaymentCollectedDialog from './orders/dialogs/PaymentCollectedDialog';

const AdminOrderDetailPage = () => {
  const {
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
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Products List */}
        <div className="md:col-span-2">
          <OrderProductsList
            order={order}
            productDetails={productDetails}
            brandDetails={brandDetails}
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
            onUpdateTracking={handleUpdateTracking}
            onCompleteOrder={handleCompleteOrder}
            onCancelOrder={handleCancelOrder}
            onUpdateRecipient={handleUpdateRecipient}
            onPaymentCollected={handlePaymentCollected}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            setShowConfirmDialog={setShowConfirmDialog}
            setShowShipDialog={setShowShipDialog}
            setShowTrackingDialog={setShowTrackingDialog}
            setShowCancelDialog={setShowCancelDialog}
            setShowUpdateRecipientDialog={setShowUpdateRecipientDialog}
            setShowPaymentCollectedDialog={setShowPaymentCollectedDialog}
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
        processing={processing}
      />

      <UpdateTrackingDialog
        show={showTrackingDialog}
        onConfirm={handleUpdateTracking}
        onClose={() => setShowTrackingDialog(false)}
        trackingNumber={trackingNumber}
        onTrackingNumberChange={setTrackingNumber}
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

      <UpdateRecipientDialog
        show={showUpdateRecipientDialog}
        onConfirm={handleUpdateRecipient}
        onClose={() => setShowUpdateRecipientDialog(false)}
        recipientName={recipientName}
        recipientAddress={recipientAddress}
        onRecipientNameChange={setRecipientName}
        onRecipientAddressChange={setRecipientAddress}
        processing={processing}
      />

      <MoveToPendingDialog
        show={showMoveToPendingDialog}
        onConfirm={handleMoveToPending}
        onClose={() => setShowMoveToPendingDialog(false)}
        orderId={order.idDonHang}
        processing={processing}
      />

      <PaymentCollectedDialog
        show={showPaymentCollectedDialog}
        onConfirm={handlePaymentCollected}
        onClose={() => setShowPaymentCollectedDialog(false)}
        order={order}
        processing={processing}
      />
    </div>
  );
};

export default AdminOrderDetailPage;

import { useState } from 'react';

const useReceipt = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const showReceiptModal = (data) => {
    setReceiptData(data);
    setShowReceipt(true);
  };

  const hideReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  const printReceipt = () => {
    window.print();
  };

  const getReceiptTitle = () => {
    if (!receiptData) return '';
    return receiptData.paymentMethod === 'deposit' ? 'PHIẾU ĐẶT HÀNG' : 'HÓA ĐƠN BÁN LẺ';
  };

  const getPaymentStatusText = () => {
    if (!receiptData) return '';
    switch (receiptData.paymentMethod) {
      case 'cash':
        return 'Đã thanh toán tiền mặt';
      case 'card':
        return 'Đã thanh toán thẻ tín dụng';
      case 'online':
        return 'Đã thanh toán ví điện tử';
      case 'deposit':
        return 'Đã đặt cọc 50%';
      default:
        return 'Đã thanh toán';
    }
  };

  return {
    showReceipt,
    receiptData,
    showReceiptModal,
    hideReceipt,
    printReceipt,
    getReceiptTitle,
    getPaymentStatusText
  };
};

export default useReceipt;



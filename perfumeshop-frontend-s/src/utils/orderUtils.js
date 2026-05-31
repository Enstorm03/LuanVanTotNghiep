// Order utilities for order history page

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Giỏ hàng':       return 'bg-gray-100 text-gray-800';
    case 'Đang chờ':       return 'bg-blue-100 text-blue-800';
    case 'Đã xác nhận':    return 'bg-green-100 text-green-800';
    case 'Đang giao hàng': return 'bg-purple-100 text-purple-800';
    case 'Hoàn thành':     return 'bg-emerald-100 text-emerald-800';
    case 'Chờ hàng':       return 'bg-orange-100 text-orange-800';
    case 'Đã hủy':         return 'bg-red-100 text-red-800';
    case 'Đã hoàn trả':    return 'bg-teal-100 text-teal-800';
    default:               return 'bg-gray-100 text-gray-800';
  }
};

export const canCancelOrder = (order) => {
  const cancellableStatuses = ['Đang chờ', 'Đã xác nhận', 'Chờ hàng'];
  return cancellableStatuses.includes(order.trangThaiVanHanh);
};

export const canWriteReview = (order) => {
  return order.trangThaiVanHanh === 'Hoàn thành';
};

/**
 * Kiểm tra có thể yêu cầu đổi trả không.
 * @param {object} order - đơn hàng
 * @param {object|null} returnStatus - object { hasReturnRequest, returnStatus } từ API /kiem-tra
 */
export const canRequestReturn = (order, orderDate, returnStatus) => {
  // Chỉ cho đơn đã hoàn thành
  if (order.trangThaiVanHanh !== 'Hoàn thành') return false;

  // Đã có phiếu đổi trả rồi (bất kể trạng thái)
  if (returnStatus?.hasReturnRequest) return false;

  // Kiểm tra trong vòng 7 ngày kể từ ngày hoàn thành
  const ngayHoanThanh = order.ngayHoanThanh || orderDate;
  if (!ngayHoanThanh) return false;

  const daysDiff = Math.floor(
    (new Date() - new Date(ngayHoanThanh)) / (1000 * 60 * 60 * 24)
  );
  return daysDiff <= 7;
};

export const formatOrderDate = (dateString) => {
  if (!dateString) return 'Chưa xác định';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount) => {
  if (!amount) return '0₫';
  return amount.toLocaleString('vi-VN') + '₫';
};

export const getOrderItemImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://placehold.co/60x60?text=No+Image";
  return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
};

export const calculateOrderItemTotal = (item) => {
  const price = Number(item.giaTaiThoiDiemMua || 0);
  const qty = Number(item.soLuong || 0);
  return price * qty;
};

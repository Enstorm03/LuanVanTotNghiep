/**
 * Utility functions for formatting and managing pick list data for FEFO order picking
 */

/**
 * Groups order items by product and shows which lots to pick from
 * Input: array of order items with FEFO lot information from backend
 * Output: formatted data for warehouse staff display
 * 
 * Expected input structure:
 * [
 *   {
 *     productId: 1,
 *     tenSanPham: "Product A",
 *     quantities: [
 *       { quantity: 2, hanSuDung: "2026-12-31", soLo: "LOT001" },
 *       { quantity: 1, hanSuDung: "2027-05-31", soLo: "LOT002" }
 *     ]
 *   }
 * ]
 */
export const formatPickList = (orderItems) => {
  if (!orderItems || !Array.isArray(orderItems)) {
    return [];
  }

  return orderItems.map(item => ({
    productId: item.productId,
    tenSanPham: item.tenSanPham,
    thuongHieu: item.thuongHieu || '',
    totalQuantity: (item.quantities || []).reduce((sum, q) => sum + q.quantity, 0),
    pickDetails: (item.quantities || []).map((q, index) => ({
      index: index + 1,
      quantity: q.quantity,
      hanSuDung: q.hanSuDung,
      soLo: q.soLo,
      formattedDate: formatDate(q.hanSuDung),
      daysUntilExpiry: calculateDaysUntilExpiry(q.hanSuDung)
    }))
  }));
};

/**
 * Generates readable text for a single product's pick instructions
 * Example output: "Lấy 2 chai (Lô LOT001, HSD: 12/2026), Lấy 1 chai (Lô LOT002, HSD: 05/2027)"
 */
export const generatePickInstructions = (product) => {
  if (!product.pickDetails || product.pickDetails.length === 0) {
    return '';
  }

  return product.pickDetails
    .map((detail) => 
      `Lấy ${detail.quantity} chai (Lô ${detail.soLo}, HSD: ${detail.formattedDate})`
    )
    .join(', ');
};

/**
 * Formats date to Vietnamese format MM/YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${year}`;
};

/**
 * Calculate number of days until expiry
 */
export const calculateDaysUntilExpiry = (dateString) => {
  if (!dateString) return null;
  const expireDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timeDiff = expireDate - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Gets urgency level based on days until expiry
 */
export const getExpiryUrgency = (daysLeft) => {
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 7) return 'critical';
  if (daysLeft <= 30) return 'high';
  if (daysLeft <= 90) return 'medium';
  return 'low';
};

/**
 * Gets color class for urgency level
 */
export const getUrgencyColorClass = (urgency) => {
  switch (urgency) {
    case 'expired':
      return 'bg-black text-white';
    case 'critical':
      return 'bg-red-500 text-white';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-gray-900';
    default:
      return 'bg-green-500 text-white';
  }
};

/**
 * Gets urgency label in Vietnamese
 */
export const getUrgencyLabel = (urgency) => {
  switch (urgency) {
    case 'expired':
      return 'Đã hết hạn';
    case 'critical':
      return 'Rất cấp bách';
    case 'high':
      return 'Cao';
    case 'medium':
      return 'Trung bình';
    default:
      return 'Bình thường';
  }
};

/**
 * Validates pick list data for warehouse staff
 * Returns validation errors if any
 */
export const validatePickList = (pickList) => {
  const errors = [];

  if (!pickList || pickList.length === 0) {
    errors.push('Danh sách nhặt hàng trống');
    return errors;
  }

  pickList.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Sản phẩm ${index + 1}: Thiếu ID sản phẩm`);
    }
    if (!item.tenSanPham) {
      errors.push(`Sản phẩm ${index + 1}: Thiếu tên sản phẩm`);
    }
    if (!item.pickDetails || item.pickDetails.length === 0) {
      errors.push(`Sản phẩm ${index + 1}: Không có thông tin lô hàng`);
    }
    if (item.totalQuantity <= 0) {
      errors.push(`Sản phẩm ${index + 1}: Số lượng không hợp lệ`);
    }

    item.pickDetails?.forEach((detail, detailIndex) => {
      if (!detail.soLo) {
        errors.push(`Sản phẩm ${index + 1}, Lô ${detailIndex + 1}: Thiếu số lô`);
      }
      if (!detail.hanSuDung) {
        errors.push(`Sản phẩm ${index + 1}, Lô ${detailIndex + 1}: Thiếu hạn sử dụng`);
      }
      if (detail.quantity <= 0) {
        errors.push(`Sản phẩm ${index + 1}, Lô ${detailIndex + 1}: Số lượng không hợp lệ`);
      }

      const expireUrgency = getExpiryUrgency(detail.daysUntilExpiry);
      if (expireUrgency === 'expired') {
        errors.push(`Sản phẩm ${index + 1}, Lô ${detail.soLo}: ĐÃ HẾT HẠN`);
      }
    });
  });

  return errors;
};

/**
 * Generate a printable pick list for warehouse staff
 */
export const generatePrintablePickList = (pickList, orderNumber) => {
  let output = `PHIẾU NHẶT HÀNG - ĐƠN HÀNG #${orderNumber}\n`;
  output += `Thời gian: ${new Date().toLocaleString('vi-VN')}\n`;
  output += `${'='.repeat(80)}\n\n`;

  pickList.forEach((item, index) => {
    output += `${index + 1}. SẢN PHẨM: ${item.tenSanPham}`;
    if (item.thuongHieu) {
      output += ` (${item.thuongHieu})`;
    }
    output += `\n`;
    output += `   Tổng số lượng cần lấy: ${item.totalQuantity}\n`;
    output += `   Chi tiết lô hàng:\n`;

    item.pickDetails.forEach((detail) => {
      output += `   - Lấy ${detail.quantity} chai từ Lô ${detail.soLo}\n`;
      output += `     HSD: ${detail.formattedDate}`;
      if (detail.daysUntilExpiry !== null) {
        output += ` (Còn ${detail.daysUntilExpiry} ngày)`;
      }
      output += `\n`;
    });

    output += `\n`;
  });

  output += `${'='.repeat(80)}\n`;
  output += `Ghi chú: Vui lòng lấy đúng lô hàng theo thứ tự ghi trên để tuân thủ quy luật FEFO\n`;
  output += `Người lập: ________________     Ngày: ________________\n`;

  return output;
};

/**
 * Export pick list as text file
 */
export const exportPickListAsText = (pickList, orderNumber) => {
  const content = generatePrintablePickList(pickList, orderNumber);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', `phieu_nhat_hang_${orderNumber}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
// Checkout calculation utilities

export const calculateCartTotal = (cart) => {
  if (!cart || !cart.chiTiet) return 0;
  return cart.chiTiet.reduce((total, item) => {
    return total + (item.giaTaiThoiDiemMua * item.soLuong);
  }, 0);
};

export const calculatePreOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.gia_ban * item.quantity);
  }, 0);
};

export const calculateDepositAmount = (total) => {
  return total * 0.5; // 50% deposit
};

export const calculateRemainingAmount = (total, depositAmount) => {
  return total - depositAmount;
};

export const formatCurrency = (amount) => {
  if (!amount) return '0₫';
  return amount.toLocaleString('vi-VN') + '₫';
};

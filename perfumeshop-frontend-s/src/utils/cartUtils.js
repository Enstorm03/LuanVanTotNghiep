// Cart utilities for cart page

export const calculateTotal = (cart) => {
  if (!cart || !cart.chiTiet) return 0;
  return cart.chiTiet.reduce((total, item) => {
    return total + (item.giaTaiThoiDiemMua * item.soLuong);
  }, 0);
};

export const calculateItemSubtotal = (item) => {
  return item.giaTaiThoiDiemMua * item.soLuong;
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + '₫';
};

export const validateQuantity = (quantity) => {
  const num = parseInt(quantity) || 1;
  return Math.max(1, num);
};

export const isCartEmpty = (cart) => {
  return !cart || !cart.chiTiet || cart.chiTiet.length === 0;
};

export const getCartItemCount = (cart) => {
  if (!cart || !cart.chiTiet) return 0;
  return cart.chiTiet.length;
};

// POS calculation utilities

export const calculateSubtotal = (cart) => {
  return cart.reduce((sum, item) => sum + (item.gia_ban * item.quantity), 0);
};

export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal, tax) => {
  return subtotal + tax;
};

export const calculateChange = (cashReceived, total) => {
  const received = parseFloat(cashReceived) || 0;
  return received - total;
};

export const calculateDepositAmount = (total) => {
  return total * 0.5;
};

export const formatCurrency = (amount) => {
  if (!amount) return '0₫';
  return amount.toLocaleString('vi-VN') + '₫';
};

export const validateCashPayment = (cashReceived, total) => {
  const received = parseFloat(cashReceived) || 0;
  return received >= total;
};

// POS constants and configuration

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online',
  DEPOSIT: 'deposit'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: '💵 Tiền mặt',
  [PAYMENT_METHODS.CARD]: '💳 Thẻ tín dụng',
  [PAYMENT_METHODS.ONLINE]: '📱 Ví điện tử',
  [PAYMENT_METHODS.DEPOSIT]: '🏦 Đặt cọc 50%'
};

export const PAYMENT_METHOD_DESCRIPTIONS = {
  [PAYMENT_METHODS.CASH]: 'Thanh toán ngay - hoàn thành đơn hàng',
  [PAYMENT_METHODS.CARD]: 'Thanh toán thẻ - hoàn thành đơn hàng',
  [PAYMENT_METHODS.ONLINE]: 'ZaloPay, MoMo - hoàn thành đơn hàng',
  [PAYMENT_METHODS.DEPOSIT]: 'Đặt hàng trước - thanh toán 50% - chờ hàng về'
};

export const TAX_RATE = 0.1; // 10%
export const DEPOSIT_RATE = 0.5; // 50%

export const CART_STORAGE_KEY = 'pos-cart';

export const ORDER_TYPES = {
  SALE: 'sale',
  DEPOSIT: 'deposit'
};

export const RECEIPT_PRINT_DELAY = 2000; // ms

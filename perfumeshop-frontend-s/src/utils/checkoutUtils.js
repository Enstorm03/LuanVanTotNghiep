// Checkout utility functions

// Payment methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online',
  CARD: 'card'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: '💵 Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHODS.ONLINE]: '📱 Ví điện tử/ZaloPay/MoMo',
  [PAYMENT_METHODS.CARD]: '💳 Thẻ tín dụng/ghi nợ'
};

export const PAYMENT_METHOD_DESCRIPTIONS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán bằng tiền mặt khi nhận hàng',
  [PAYMENT_METHODS.ONLINE]: 'Thanh toán online an toàn',
  [PAYMENT_METHODS.CARD]: 'Thanh toán bằng thẻ'
};

export const validatePhoneNumber = (phone) => {
  // Basic Vietnamese phone number validation
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validateShippingForm = (shippingInfo) => {
  if (!shippingInfo.tenNguoiNhan?.trim()) {
    alert('Vui lòng nhập tên người nhận');
    return false;
  }

  if (!shippingInfo.diaChiGiaoHang?.trim()) {
    alert('Vui lòng nhập địa chỉ giao hàng');
    return false;
  }

  if (!shippingInfo.soDienThoai?.trim()) {
    alert('Vui lòng nhập số điện thoại');
    return false;
  }

  if (!validatePhoneNumber(shippingInfo.soDienThoai.trim())) {
    alert('Số điện thoại không hợp lệ');
    return false;
  }

  return true;
};

export const getOrderItemId = (item) => {
  return `cart-${item.sanPhamId || item.id || Math.random().toString(36).substr(2, 9)}`;
};

export const getOrderItemImageUrl = (item) => {
  // Kiểm tra các trường có thể chứa URL hình ảnh
  const possibleImageFields = [
    'urlHinhAnh', 
    'anhDaiDien', 
    'hinhAnh',
    'imageUrl',
    'image',
    'img',
    'url_hinh_anh'
  ];
  
  // Tìm trường hình ảnh đầu tiên có giá trị
  for (const field of possibleImageFields) {
    if (item[field]) {
      return item[field];
    }
  }
  
  // Nếu không tìm thấy, trả về ảnh mặc định
  return 'https://placehold.co/80x80?text=No+Image';
};

export const getOrderItemName = (item) => {
  const possibleNameFields = [
    'tenSanPham',
    'ten_san_pham',
    'name',
    'productName',
    'title'
  ];

  for (const field of possibleNameFields) {
    if (item[field]) {
      return item[field];
    }
  }

  return `Sản phẩm ${item.sanPhamId || item.id || ''}`.trim();
};

export const getOrderItemQuantity = (item) => {
  return item.soLuong || item.quantity || 1;
};

export const getOrderItemPrice = (item) => {
  const priceFields = [
    'giaTaiThoiDiemMua',
    'price',
    'gia_ban',
    'giaBan',
    'giaTien',
    'gia_tien'
  ];

  for (const field of priceFields) {
    if (item[field] !== undefined && item[field] !== null) {
      return Number(item[field]) || 0;
    }
  }

  return 0;
};

// Tính tổng tiền đơn hàng
export const calculateOrderTotal = (items = []) => {
  return items.reduce((total, item) => {
    const quantity = getOrderItemQuantity(item);
    const price = getOrderItemPrice(item);
    return total + (price * quantity);
  }, 0);
};

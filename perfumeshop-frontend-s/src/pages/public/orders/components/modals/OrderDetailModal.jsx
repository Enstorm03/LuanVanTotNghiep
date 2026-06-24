import React from 'react';
import {
  formatOrderDate,
  formatCurrency,
  getStatusBadgeColor,
  getOrderItemImageUrl,
  calculateOrderItemTotal,
} from '../../../../../utils/orderUtils';

const OrderDetailModal = ({ show, onClose, order }) => {
  if (!show || !order) return null;

  // Helper to get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return { icon: 'schedule', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
      case 'Đã xác nhận':
        return { icon: 'check_circle', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'Đang giao hàng':
        return { icon: 'local_shipping', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
      case 'Đã giao hàng':
        return { icon: 'done_all', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'Đã hủy':
        return { icon: 'cancel', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
      default:
        return { icon: 'info', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900' };
    }
  };

  const statusInfo = getStatusInfo(order.trangThaiVanHanh);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Chi tiết đơn hàng
            </h2>
            <p className="text-primary-100 text-sm mt-1">
              Mã đơn hàng: #{order.idDonHang}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trạng thái đơn hàng - Timeline Style */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${statusInfo.bg} p-3 rounded-lg`}>
                <span className={`material-symbols-outlined ${statusInfo.color} text-3xl`}>
                  {statusInfo.icon}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trạng thái đơn hàng
                </h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
                  {order.trangThaiVanHanh}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-8 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {/* Đã đặt hàng */}
              <div className="relative">
                <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 ${
                  order.ngayDatHang ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'
                }`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Đơn hàng đã đặt</p>
                    {order.ngayDatHang && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatOrderDate(order.ngayDatHang)}
                      </p>
                    )}
                  </div>
                  {order.ngayDatHang && (
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  )}
                </div>
              </div>

              {/* Đã xác nhận */}
              <div className="relative">
                <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 ${
                  order.ngayXacNhan ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'
                }`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Đơn hàng đã được xác nhận</p>
                    {order.ngayXacNhan && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatOrderDate(order.ngayXacNhan)}
                      </p>
                    )}
                  </div>
                  {order.ngayXacNhan && (
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  )}
                </div>
              </div>

              {/* Đang giao hàng */}
              <div className="relative">
                <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 ${
                  order.ngayGiaoHang ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'
                }`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Đang giao hàng</p>
                    {order.ngayGiaoHang && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatOrderDate(order.ngayGiaoHang)}
                      </p>
                    )}
                    {order.maVanDon && (
                      <p className="text-sm text-primary mt-1">
                        Mã vận đơn: {order.maVanDon}
                      </p>
                    )}
                  </div>
                  {order.ngayGiaoHang && (
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  )}
                </div>
              </div>

              {/* Hoàn thành */}
              <div className="relative">
                <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 ${
                  order.ngayHoanThanh ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'
                }`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Đơn hàng đã hoàn thành</p>
                    {order.ngayHoanThanh && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatOrderDate(order.ngayHoanThanh)}
                      </p>
                    )}
                  </div>
                  {order.ngayHoanThanh && (
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment status */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500">payment</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thanh toán:</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.trangThaiThanhToan === 'Đã thanh toán' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                }`}>
                  {order.trangThaiThanhToan}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Phương thức:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.phuongThucThanhToan}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Địa chỉ nhận hàng
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl">person</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Người nhận</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.tenNguoiNhan}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl">phone</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.soDienThoai}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 text-xl">home</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.diaChiGiaoHang}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lý do hủy (nếu có) */}
          {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                    Lý do hủy đơn
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {order.lyDoHuy}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sản phẩm ({order.chiTiet?.length || 0})
              </h3>
            </div>
            <div className="space-y-4">
              {order.chiTiet?.map((item, idx) => {
                const imageUrl = getOrderItemImageUrl(item.urlHinhAnh);
                const price = Number(item.giaTaiThoiDiemMua || 0);
                const qty = Number(item.soLuong || 0);
                const total = calculateOrderItemTotal(item);

                return (
                  <div
                    key={`${item.sanPhamId ?? 'x'}-${idx}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <img
                      src={imageUrl}
                      alt={item.tenSanPham || 'Sản phẩm'}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x80?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {item.tenSanPham || '(Sản phẩm đã không còn)'}
                      </h4>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="text-gray-500 dark:text-gray-500">Đơn giá: </span>
                          <span className="font-medium">{price.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="text-gray-500 dark:text-gray-500">x </span>
                          <span className="font-medium">{qty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Thành tiền</p>
                      <p className="text-lg font-semibold text-primary">
                        {total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tổng kết thanh toán */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Thông tin thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(order.tongTien)}
                </span>
              </div>
              {order.phiVanChuyen && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(order.phiVanChuyen)}
                  </span>
                </div>
              )}
              {order.giamGia && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Giảm giá:</span>
                  <span className="font-medium">
                    -{formatCurrency(order.giamGia)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(order.tongTien)}
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú (nếu có) */}
          {order.ghiChu && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500 text-2xl">note</span>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Ghi chú
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {order.ghiChu}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
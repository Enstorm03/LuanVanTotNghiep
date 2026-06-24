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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chi tiết đơn hàng #{order.idDonHang}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Trạng thái đơn hàng */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Trạng thái đơn hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái vận hành</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.trangThaiVanHanh)}`}>
                  {order.trangThaiVanHanh}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái thanh toán</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                  order.trangThaiThanhToan === 'Đã thanh toán' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.trangThaiThanhToan}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin thời gian */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Thông tin thời gian
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ngày đặt hàng:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatOrderDate(order.ngayDatHang)}
                </span>
              </div>
              {order.ngayXacNhan && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày xác nhận:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatOrderDate(order.ngayXacNhan)}
                  </span>
                </div>
              )}
              {order.ngayGiaoHang && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày giao hàng:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatOrderDate(order.ngayGiaoHang)}
                  </span>
                </div>
              )}
              {order.ngayHoanThanh && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày hoàn thành:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatOrderDate(order.ngayHoanThanh)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Thông tin giao hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Người nhận:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.tenNguoiNhan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.soDienThoai}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 dark:text-gray-400 mb-1">Địa chỉ:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.diaChiGiaoHang}
                </span>
              </div>
              {order.maVanDon && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mã vận đơn:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.maVanDon}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lý do hủy (nếu có) */}
          {order.trangThaiVanHanh === 'Đã hủy' && order.lyDoHuy && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
                Lý do hủy đơn
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {order.lyDoHuy}
              </p>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Sản phẩm ({order.chiTiet?.length || 0})
            </h3>
            <div className="space-y-4">
              {order.chiTiet?.map((item, idx) => {
                const imageUrl = getOrderItemImageUrl(item.urlHinhAnh);
                const price = Number(item.giaTaiThoiDiemMua || 0);
                const qty = Number(item.soLuong || 0);
                const total = calculateOrderItemTotal(item);

                return (
                  <div
                    key={`${item.sanPhamId ?? 'x'}-${idx}`}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <img
                      src={imageUrl}
                      alt={item.tenSanPham || 'Sản phẩm'}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x80?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.tenSanPham || '(Sản phẩm đã không còn)'}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Đơn giá: {price.toLocaleString('vi-VN')}₫</p>
                        <p>Số lượng: {qty}</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Thành tiền: {total.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tổng kết thanh toán */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Thông tin thanh toán
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phương thức thanh toán:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.phuongThucThanhToan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(order.tongTien)}
                </span>
              </div>
              {order.phiVanChuyen && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(order.phiVanChuyen)}
                  </span>
                </div>
              )}
              {order.giamGia && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Giảm giá:</span>
                  <span className="font-medium">
                    -{formatCurrency(order.giamGia)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tổng cộng:
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(order.tongTien)}
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú (nếu có) */}
          {order.ghiChu && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Ghi chú
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.ghiChu}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
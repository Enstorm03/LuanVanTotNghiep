import React from 'react';

const ActionButtons = ({ onAddToCart, onBuyNow, onPreOrder, cartLoading, isOutOfStock }) => {
  const ActionButton = ({ onClick, loading, variant, children, ...props }) => {
    const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50";
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      warning: "bg-orange-500 text-white hover:bg-orange-600"
    };

    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`${baseClasses} ${variants[variant]}`}
        {...props}
      >
        {loading ? 'Đang xử lý...' : children}
      </button>
    );
  };

  if (isOutOfStock) {
    return (
      <div className="mt-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
            🚚 Hàng sẽ về sau 7-10 ngày
          </p>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
            Cần thanh toán 50% tiền cọc để xác nhận đặt hàng
          </p>
        </div>
        <ActionButton
          onClick={onPreOrder}
          loading={cartLoading}
          variant="warning"
        >
          Đặt hàng trước
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <ActionButton
        onClick={onAddToCart}
        loading={cartLoading}
        variant="primary"
      >
        Thêm vào giỏ hàng
      </ActionButton>
      <ActionButton
        onClick={onBuyNow}
        loading={cartLoading}
        variant="outline"
      >
        Thanh toán ngay
      </ActionButton>
    </div>
  );
};

export default ActionButtons;

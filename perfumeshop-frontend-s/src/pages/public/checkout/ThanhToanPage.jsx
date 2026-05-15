import React, { useState, useEffect } from 'react';
import useCheckoutData from '../../../hooks/useCheckoutData';
import useShippingForm from '../../../hooks/useShippingForm';
import usePaymentMethod from '../../../hooks/usePaymentMethod';
import useSubmitOrder from '../../../hooks/useSubmitOrder';
import api from '../../../services/api';
import CheckoutHeader from './components/CheckoutHeader';
import PreOrderNotice from './components/preorder/PreOrderNotice';
import ShippingForm from './components/shipping/ShippingForm';
import PaymentMethodSelector from './components/payment/PaymentMethodSelector';
import OrderItems from './components/order/OrderItems';
import OrderSummary from './components/order/OrderSummary';

const ThanhToanPage = () => {
  const {
    cart,
    preOrderData,
    loading,
    error,
    user,
    fetchCart,
    hasItems,
    isPreOrder,
    items
  } = useCheckoutData();

  const { shippingInfo, updateShippingInfo } = useShippingForm();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod(preOrderData?.paymentMethod || 'cod');
  const { submitOrder, processing } = useSubmitOrder();

  const [stockCheck, setStockCheck] = useState(null);

  // Check stock when component mounts or items change
  useEffect(() => {
    const checkStock = async () => {
      if (!user || isPreOrder || !items.length) return;

      try {
        // Get cart data to check stock locally
        const cartData = await api.getCart(user.id_nguoi_dung);
        const cartItems = cartData.chiTiet || [];

        // Dùng API BE để kiểm tra tồn kho (1 request duy nhất)
        const stockResult = await api.checkStockBeforeCheckout(cartItems);

        setStockCheck({
          isAllInStock: stockResult.allInStock !== undefined ? stockResult.allInStock : (stockResult.isAllInStock !== undefined ? stockResult.isAllInStock : true),
          outOfStockItems: stockResult.outOfStockItems || []
        });
      } catch (error) {
        console.error('Lỗi kiểm tra tồn kho:', error);
        // Set default state if stock check fails
        setStockCheck({ isAllInStock: true, outOfStockItems: [] });
      }
    };

    checkStock();
  }, [user, isPreOrder, items]);

  const handleSubmitOrder = () => {
    submitOrder({ cart, preOrderData, isPreOrder, stockCheck }, shippingInfo, paymentMethod);
  };

  const handleSubmitBackorder = () => {
    submitOrder({ cart, preOrderData, isPreOrder, isBackorder: true, stockCheck }, shippingInfo, paymentMethod);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để thanh toán.</p>
          <a href="/login" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Không có sản phẩm để thanh toán</h2>
          <p className="text-gray-600 mb-6">Vui lòng chọn sản phẩm trước khi thanh toán.</p>
          <a href="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Mua sắm ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <CheckoutHeader isPreOrder={isPreOrder} preOrderData={preOrderData} />

        {isPreOrder && <PreOrderNotice />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            <ShippingForm
              shippingInfo={shippingInfo}
              onShippingInfoChange={updateShippingInfo}
            />

            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderItems items={items} isPreOrder={isPreOrder} />

            <OrderSummary
              items={items}
              isPreOrder={isPreOrder}
              preOrderData={preOrderData}
              paymentMethod={paymentMethod}
              processing={processing}
              onSubmitOrder={handleSubmitOrder}
              stockCheck={stockCheck}
              onSubmitBackorder={handleSubmitBackorder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToanPage;

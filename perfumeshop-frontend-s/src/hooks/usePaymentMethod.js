import { useState } from 'react';
import { PAYMENT_METHODS } from '../utils/checkoutUtils';

const usePaymentMethod = (initialMethod = PAYMENT_METHODS.COD) => {
  const [paymentMethod, setPaymentMethod] = useState(initialMethod);

  const updatePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const resetPaymentMethod = () => {
    setPaymentMethod(PAYMENT_METHODS.COD);
  };

  return {
    paymentMethod,
    setPaymentMethod: updatePaymentMethod,
    resetPaymentMethod
  };
};

export default usePaymentMethod;



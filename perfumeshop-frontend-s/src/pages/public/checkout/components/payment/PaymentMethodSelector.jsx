import React from 'react';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, PAYMENT_METHOD_DESCRIPTIONS } from '../../../../../utils/checkoutUtils';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="bg-white dark:bg-content-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
      <div className="space-y-3">
        {Object.values(PAYMENT_METHODS).map((method) => (
          <label key={method} className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={(e) => onMethodChange(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <span className="font-medium text-lg">{PAYMENT_METHOD_LABELS[method]}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{PAYMENT_METHOD_DESCRIPTIONS[method]}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;

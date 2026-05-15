import React from 'react';

const ServiceFeatures = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">local_shipping</span>
      <div>
        <h4 className="font-semibold">Giao hàng tận nơi</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Miễn phí giao hàng toàn quốc</p>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">security</span>
      <div>
        <h4 className="font-semibold">Bảo mật thanh toán</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán an toàn 100%</p>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span className="material-symbols-outlined text-2xl text-primary">support_agent</span>
      <div>
        <h4 className="font-semibold">Hỗ trợ 24/7</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Luôn sẵn sàng phục vụ</p>
      </div>
    </div>
  </div>
);

export default ServiceFeatures;

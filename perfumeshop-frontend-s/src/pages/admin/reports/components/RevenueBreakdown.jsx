import React from 'react';

const RevenueBreakdown = ({ reportData }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
      <h3 className="text-lg font-bold mb-4">Phân tích doanh thu</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Doanh thu thực tế:</span>
          <span className="font-medium text-green-600">{(reportData?.totalRevenue || 0).toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Giá trị trung bình/đơn:</span>
          <span className="font-medium">{(reportData?.averageOrderValue || 0).toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Số đơn hoàn thành:</span>
          <span className="font-medium">{reportData?.orderStats?.completed || 0}</span>
        </div>
        
        {reportData?.revenueByStatus && reportData.revenueByStatus.length > 0 && (
          <>
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            <h4 className="text-sm font-semibold mb-2">Doanh thu theo trạng thái:</h4>
            {reportData.revenueByStatus.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-sm text-gray-600">{item.status}:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {Number(item.revenue).toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueBreakdown;

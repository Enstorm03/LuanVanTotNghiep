import React from 'react';
import ReturnItem from './ReturnItem';

const ReturnsList = ({ returns, onApprove, onReject, processing }) => {
  return (
    <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Danh sách phiếu đổi trả</h3>

        {returns.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">assignment_return</span>
            <p className="text-gray-500 dark:text-gray-400">Không có phiếu đổi trả nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((returnItem) => (
              <ReturnItem
                key={returnItem.idDoiTra}
                returnItem={returnItem}
                onApprove={onApprove}
                onReject={onReject}
                processing={processing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsList;

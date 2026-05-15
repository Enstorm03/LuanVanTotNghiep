import React from 'react';
import { getReturnStatusIcon, getReturnStatusColor } from '../../../../utils/returnStatus';

const ReturnsSummary = ({ pendingCount, approvedCount, rejectedCount }) => {
  const totalCount = pendingCount + approvedCount + rejectedCount;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đổi trả</h3>
          <span className="material-symbols-outlined text-blue-600">
            assignment_return
          </span>
        </div>
        <div className="pt-0">
          <div className="text-2xl font-bold text-blue-600">
            {approvedCount}
          </div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            {approvedCount} đã duyệt, {totalCount} tổng số
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Chờ duyệt</h3>
          <span className={`material-symbols-outlined ${getReturnStatusColor('Chờ duyệt')}`}>
            {getReturnStatusIcon('Chờ duyệt')}
          </span>
        </div>
        <div className="pt-0">
          <div className={`text-2xl font-bold ${getReturnStatusColor('Chờ duyệt')}`}>
            {pendingCount}
          </div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            Phiếu cần xử lý
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Từ chối</h3>
          <span className={`material-symbols-outlined ${getReturnStatusColor('Từ chối')}`}>
            {getReturnStatusIcon('Từ chối')}
          </span>
        </div>
        <div className="pt-0">
          <div className={`text-2xl font-bold ${getReturnStatusColor('Từ chối')}`}>
            {rejectedCount}
          </div>
          <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
            Không đủ điều kiện
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsSummary;

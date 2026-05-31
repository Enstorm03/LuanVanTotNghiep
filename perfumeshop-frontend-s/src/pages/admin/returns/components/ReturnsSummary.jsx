import React from 'react';

const Card = ({ title, count, color, icon, sub }) => (
  <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
    <div className="flex items-center justify-between pb-2">
      <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">{title}</h3>
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
    </div>
    <div className={`text-2xl font-bold ${color}`}>{count}</div>
    <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">{sub}</p>
  </div>
);

const ReturnsSummary = ({ pendingCount, waitingRefundCount, approvedCount, rejectedCount }) => (
  <div className="grid gap-4 md:grid-cols-4">
    <Card
      title="Chờ duyệt"
      count={pendingCount}
      color="text-yellow-600"
      icon="pending"
      sub="Cần xem xét"
    />
    <Card
      title="Chờ hoàn tiền"
      count={waitingRefundCount}
      color="text-orange-600"
      icon="payments"
      sub="Cần hoàn tiền cho khách"
    />
    <Card
      title="Hoàn tất"
      count={approvedCount}
      color="text-teal-600"
      icon="check_circle"
      sub="Đã hoàn tiền thành công"
    />
    <Card
      title="Từ chối"
      count={rejectedCount}
      color="text-red-600"
      icon="cancel"
      sub="Không đủ điều kiện"
    />
  </div>
);

export default ReturnsSummary;

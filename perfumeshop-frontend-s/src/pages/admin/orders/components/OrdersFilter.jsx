import React from 'react';

const OrdersFilter = ({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
      <input
        type="text"
        placeholder="Tìm theo mã ĐH, tên khách hàng..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="form-input w-full sm:flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="form-select w-full sm:w-auto rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
      >
        <option value="All">Tất cả trạng thái</option>
        <option value="Đang chờ">Đang chờ</option>
        <option value="Đã xác nhận">Đã xác nhận</option>
        <option value="Đang giao hàng">Đang giao hàng</option>
        <option value="Chờ hàng">Chờ hàng</option>
        <option value="Hoàn thành">Hoàn thành</option>
        <option value="Đã hủy">Đã hủy</option>
      </select>
    </div>
  );
};

export default OrdersFilter;

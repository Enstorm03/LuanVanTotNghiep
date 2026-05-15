// Date range utilities for reports

export const getDefaultDateRange = () => ({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  endDate: new Date().toISOString().split('T')[0] // Today
});

export const formatDateRange = (startDate, endDate) => ({
  startDate: startDate || getDefaultDateRange().startDate,
  endDate: endDate || getDefaultDateRange().endDate
});

export const filterOrdersByDateRange = (orders, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // End of day

  return orders.filter(order => {
    const orderDate = new Date(order.ngayDatHang || order.ngay_dat_hang);
    return orderDate >= start && orderDate <= end;
  });
};

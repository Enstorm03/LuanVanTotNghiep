export const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Đang giao hàng':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Đang chờ':
    case 'Đã xác nhận':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Chờ hàng':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

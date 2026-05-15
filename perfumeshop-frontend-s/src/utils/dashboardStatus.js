// Dashboard status utilities

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Đang giao hàng':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Đang chờ':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Đã xác nhận':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Chờ hàng':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'done_all';
    case 'Đang giao hàng':
      return 'local_shipping';
    case 'Đang chờ':
      return 'schedule';
    case 'Đã xác nhận':
      return 'check_circle';
    case 'Chờ hàng':
      return 'pending';
    case 'Đã hủy':
      return 'cancel';
    default:
      return 'help';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'text-green-600';
    case 'Đang giao hàng':
      return 'text-blue-600';
    case 'Đang chờ':
      return 'text-yellow-600';
    case 'Đã xác nhận':
      return 'text-purple-600';
    case 'Chờ hàng':
      return 'text-orange-600';
    case 'Đã hủy':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

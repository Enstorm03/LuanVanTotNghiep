// Return status utilities
// Các trạng thái thực tế: Chờ duyệt → Chờ hoàn tiền → Hoàn tiền thành công
//                                    → Từ chối

export const getReturnStatusBadgeColor = (status) => {
  switch (status) {
    case 'Chờ duyệt':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Chờ hoàn tiền':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Hoàn tiền thành công':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
    case 'Đã duyệt':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Từ chối':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getReturnStatusIcon = (status) => {
  switch (status) {
    case 'Chờ duyệt':
      return 'schedule';
    case 'Chờ hoàn tiền':
      return 'payments';
    case 'Hoàn tiền thành công':
      return 'check_circle';
    case 'Đã duyệt':
      return 'check_circle';
    case 'Từ chối':
      return 'cancel';
    default:
      return 'help';
  }
};

export const getReturnStatusColor = (status) => {
  switch (status) {
    case 'Chờ duyệt':
      return 'text-yellow-600';
    case 'Chờ hoàn tiền':
      return 'text-orange-600';
    case 'Hoàn tiền thành công':
      return 'text-teal-600';
    case 'Đã duyệt':
      return 'text-green-600';
    case 'Từ chối':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

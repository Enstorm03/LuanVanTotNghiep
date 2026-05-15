import { useState, useEffect } from 'react';
import api from '../services/api';

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
    diaChi: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(formData);
      alert('Tạo khách hàng thành công!');
      setShowCreateModal(false);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
      fetchCustomers();
    } catch (error) {
      alert('Tạo khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleUpdateCustomer = async (customerId) => {
    try {
      await api.updateCustomer(customerId, {
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        diaChi: formData.diaChi
      });
      alert('Cập nhật khách hàng thành công!');
      setEditingCustomer(null);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
      fetchCustomers();
    } catch (error) {
      alert('Cập nhật khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleResetPassword = async (customerId) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.trim() === '') {
      alert('Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      await api.resetCustomerPassword(customerId, { newPassword: newPassword.trim() });
      alert('Đặt lại mật khẩu thành công!');
    } catch (error) {
      alert('Đặt lại mật khẩu thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"?`)) {
      return;
    }

    try {
      await api.deleteCustomer(customerId);
      alert('Xóa khách hàng thành công!');
      fetchCustomers();
    } catch (error) {
      // Handle different error types
      if (error.message && error.message.includes('400')) {
        alert('Không thể xóa khách hàng: Khách hàng có đơn hàng hoặc dữ liệu liên quan. Vui lòng kiểm tra và xử lý trước.');
      } else {
        alert('Xóa khách hàng thất bại: ' + (error.message || 'Vui lòng thử lại'));
      }
    }
  };

  const openCreateModal = () => {
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
  };

  const startEditing = (customer) => {
    setEditingCustomer(customer.idNguoiDung);
    setFormData({
      hoTen: customer.hoTen || '',
      soDienThoai: customer.soDienThoai || '',
      diaChi: customer.diaChi || ''
    });
  };

  const cancelEditing = () => {
    setEditingCustomer(null);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', soDienThoai: '', diaChi: '' });
  };

  return {
    customers,
    loading,
    error,
    showCreateModal,
    editingCustomer,
    formData,
    fetchCustomers,
    handleInputChange,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleResetPassword,
    handleDeleteCustomer,
    openCreateModal,
    closeCreateModal,
    startEditing,
    cancelEditing
  };
};

export default useCustomers;

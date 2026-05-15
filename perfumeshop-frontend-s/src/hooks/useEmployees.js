import { useState, useEffect } from 'react';
import api from '../services/api';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    vaiTro: 'NhanVien'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data || []);
    } catch (err) {
      setError('Không thể tải danh sách nhân viên');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee(formData);
      alert('Tạo nhân viên thành công!');
      setShowCreateModal(false);
      setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
      fetchEmployees();
    } catch (error) {
      alert('Tạo nhân viên thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleUpdateRole = async (employeeId, newRole) => {
    try {
      await api.updateEmployeeRole(employeeId, { vaiTro: newRole });
      alert('Cập nhật vai trò thành công!');
      fetchEmployees();
    } catch (error) {
      alert('Cập nhật vai trò thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleResetPassword = async (employeeId) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (!newPassword || newPassword.trim() === '') {
      alert('Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      await api.resetEmployeePassword(employeeId, { newPassword: newPassword.trim() });
      alert('Đặt lại mật khẩu thành công!');
    } catch (error) {
      alert('Đặt lại mật khẩu thất bại: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`)) {
      return;
    }

    try {
      await api.deleteEmployee(employeeId);
      alert('Xóa nhân viên thành công!');
      fetchEmployees();
    } catch (error) {
      // Handle different error types
      if (error.message && (error.message.includes('foreign key constraint') || error.message.includes('constraint'))) {
        alert('Không thể xóa nhân viên: Nhân viên có đơn hàng hoặc dữ liệu liên quan. Vui lòng kiểm tra và xử lý trước.');
      } else {
        alert('Xóa nhân viên thất bại: ' + (error.message || 'Vui lòng thử lại'));
      }
    }
  };

  const openCreateModal = () => {
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'NhanVien' });
  };

  return {
    employees,
    loading,
    error,
    showCreateModal,
    formData,
    fetchEmployees,
    handleInputChange,
    handleCreateEmployee,
    handleUpdateRole,
    handleResetPassword,
    handleDeleteEmployee,
    openCreateModal,
    closeCreateModal
  };
};

export default useEmployees;

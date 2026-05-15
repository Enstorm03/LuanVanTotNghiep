import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useEmployees from '../../hooks/useEmployees';
import EmployeesTable from './employees/EmployeesTable';
import CreateEmployeeModal from './employees/CreateEmployeeModal';

const AdminEmployeesPage = () => {
  const { isAdmin } = useAuth();
  const {
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
  } = useEmployees();

  // Role-based access control - Only admins can access this page
  if (!isAdmin()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold mb-4">🚫 Truy cập bị từ chối</div>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản lý nhân viên.</p>
          <p className="text-sm text-gray-500">Chỉ Admin mới có thể xem trang này.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchEmployees}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/* Employees Table */}
      <EmployeesTable
        employees={employees}
        onUpdateRole={handleUpdateRole}
        onResetPassword={handleResetPassword}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        showCreateModal={showCreateModal}
        formData={formData}
        onInputChange={handleInputChange}
        onCreateEmployee={handleCreateEmployee}
        onCloseModal={closeCreateModal}
      />
    </div>
  );
};

export default AdminEmployeesPage;

import React from 'react';

const CreateEmployeeModal = ({
  showCreateModal,
  formData,
  onInputChange,
  onCreateEmployee,
  onCloseModal
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm nhân viên mới</h2>
        <form onSubmit={onCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              type="text"
              name="tenDangNhap"
              value={formData.tenDangNhap}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="vaiTro"
              value={formData.vaiTro}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="NhanVien">Nhân viên</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              Tạo
            </button>
            <button
              type="button"
              onClick={onCloseModal}
              className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;

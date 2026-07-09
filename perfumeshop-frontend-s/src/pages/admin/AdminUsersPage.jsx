import React from 'react';
import useAdminUsers from '../../hooks/useAdminUsers';
import { useAuth } from '../../contexts/AuthContext';

const AdminUsersPage = () => {
  const { isDirector } = useAuth();
  const {
    loading, filterRole, setFilterRole, filteredUsers,
    isModalOpen, setIsModalOpen, modalMode, formData,
    handleOpenAdd, handleOpenEdit, handleDelete, handleSubmit, handleChange,
    handleDuyetNCC, handleHuyNCC,
  } = useAdminUsers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quản lý Tài khoản</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">Tất cả vai trò</option>
            <option value="Admin Root">Admin Root</option>
            <option value="Giám đốc">Giám đốc</option>
            <option value="Cửa hàng trưởng">Cửa hàng trưởng</option>
            <option value="Nhân viên kho">Nhân viên kho</option>
            <option value="Nhà cung cấp">Nhà cung cấp</option>
            <option value="Khách hàng">Khách hàng</option>
          </select>

          <button 
            onClick={handleOpenAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm tài khoản
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-gray-50/80 border-b">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">ID</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Họ tên</th>
                <th className="p-4 font-semibold text-sm text-gray-600">Tên đăng nhập</th>
                <th className="p-4 font-semibold text-sm text-gray-600 text-center">Vai trò</th>
                <th className="p-4 font-semibold text-sm text-gray-600 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">Không tìm thấy tài khoản nào.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={`${user.type}-${user.id}`} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-700">#{user.id}</td>
                  <td className="p-4 font-medium text-gray-900">{user.hoTen}</td>
                  <td className="p-4 text-sm text-gray-500">{user.tenDangNhap}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      user.role === 'Admin Root'        ? 'bg-red-100 text-red-700 border border-red-200' :
                      user.role === 'Giám đốc'          ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      user.role === 'Cửa hàng trưởng'  ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      user.role === 'Nhân viên kho'     ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      user.role === 'Nhà cung cấp'      ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      user.role === 'Nhân viên'         ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                     <button onClick={() => handleOpenEdit(user)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4 transition-colors">Sửa</button>
                     {/* Nút duyệt/hủy NCC — chỉ Giám đốc trở lên */}
                     {isDirector() && user.type === 'customer' && (
                       user.vaiTro === 'SUPPLIER' ? (
                         <button onClick={() => handleHuyNCC(user)} className="text-orange-500 hover:text-orange-700 text-sm font-medium mr-4 transition-colors">Hủy NCC</button>
                       ) : (
                         <button onClick={() => handleDuyetNCC(user)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-4 transition-colors">Duyệt NCC</button>
                       )
                     )}
                     <button onClick={() => handleDelete(user)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Form UI giữ nguyên như cũ, chỉ rút gọn để hiển thị logic */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Thêm Tài Khoản Mới' : 'Cập Nhật Tài Khoản'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {modalMode === 'add' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Loại tài khoản</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="staff">Nhân viên nội bộ</option>
                    <option value="customer">Khách hàng</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên đăng nhập <span className="text-red-500">*</span></label>
                <input required type="text" name="tenDangNhap" value={formData.tenDangNhap} onChange={handleChange} disabled={modalMode === 'edit'}
                  className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 ${modalMode === 'edit' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                <input required type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"/>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <input type="text" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"/>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu {modalMode === 'add' && <span className="text-red-500">*</span>}</label>
                <input required={modalMode === 'add'} type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} placeholder={modalMode === 'edit' ? "Bỏ trống nếu không muốn đổi mật khẩu" : ""} 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"/>
              </div>

              {formData.type === 'staff' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phân quyền</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="Admin Root">Admin Root</option>
                    <option value="Giám đốc">Giám đốc</option>
                    <option value="Cửa hàng trưởng">Cửa hàng trưởng</option>
                    <option value="Nhân viên kho">Nhân viên kho</option>
                    <option value="Nhà cung cấp">Nhà cung cấp</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition">
                  {modalMode === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
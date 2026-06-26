import React, { useState } from 'react';
import api from '../../../../services/api';

const ProfileInfoTab = ({ formData, setFormData, setError, setSuccess, user }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.updateUserProfile({
        hoTen: formData.hoTen,
        soDienThoai: formData.soDienThoai,
        diaChi: formData.diaChi,
      });

      setSuccess('Cập nhật thông tin thành công!');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Thông tin cá nhân</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            <div className="flex items-center gap-2">
              <span>👤</span>
              Họ và tên
            </div>
          </label>
          {editMode ? (
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập họ và tên"
            />
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{formData.hoTen || 'Chưa cập nhật'}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            <div className="flex items-center gap-2">
              <span>✉️</span>
              Email
            </div>
          </label>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">{user?.email || 'Chưa cập nhật'}</p>
          <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            <div className="flex items-center gap-2">
              <span>📱</span>
              Số điện thoại
            </div>
          </label>
          {editMode ? (
            <input
              type="tel"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập số điện thoại"
            />
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{formData.soDienThoai || 'Chưa cập nhật'}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            <div className="flex items-center gap-2">
              <span>📍</span>
              Địa chỉ
            </div>
          </label>
          {editMode ? (
            <textarea
              name="diaChi"
              value={formData.diaChi}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Nhập địa chỉ"
            />
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{formData.diaChi || 'Chưa cập nhật'}</p>
          )}
        </div>
      </div>

      {editMode && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span>💾</span>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoTab;
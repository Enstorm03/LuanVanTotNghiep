import React, { useState } from 'react';
import api from '../../../../services/api';

const SecurityTab = ({ setError, setSuccess }) => {
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    if (passwordData.matKhauMoi !== passwordData.xacNhanMatKhau) {
      setError('Mật khẩu mới không khớp!');
      setSaving(false);
      return;
    }

    if (passwordData.matKhauMoi.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      setSaving(false);
      return;
    }

    try {
      await api.changeUserPassword({
        matKhauCu: passwordData.matKhauCu,
        matKhauMoi: passwordData.matKhauMoi,
      });

      setSuccess('Thay đổi mật khẩu thành công!');
      setChangePasswordMode(false);
      setPasswordData({
        matKhauCu: '',
        matKhauMoi: '',
        xacNhanMatKhau: '',
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Thay đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
        <span className="text-2xl">🔒</span>
        Bảo mật
      </h2>

      {!changePasswordMode ? (
        <div className="space-y-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Quản lý mật khẩu của bạn để bảo mật tài khoản.
          </p>
          <button
            onClick={() => setChangePasswordMode(true)}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Đổi mật khẩu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              name="matKhauCu"
              value={passwordData.matKhauCu}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="matKhauMoi"
              value={passwordData.matKhauMoi}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="xacNhanMatKhau"
              value={passwordData.xacNhanMatKhau}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors font-medium"
            >
              {saving ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
            <button
              onClick={() => {
                setChangePasswordMode(false);
                setPasswordData({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
              }}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityTab;
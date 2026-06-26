import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import ProfileInfoTab from './components/ProfileInfoTab';
import SecurityTab from './components/SecurityTab';

const UserProfilePage = () => {
  const { user, isUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
  });

  useEffect(() => {
    if (!isUser()) return;
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.getProfile?.();
        if (response) {
          setFormData({
            hoTen: response.ho_ten || '',
            soDienThoai: response.so_dien_thoai || '',
            diaChi: response.dia_chi || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (user) {
          setFormData({
            hoTen: user.ho_ten || '',
            soDienThoai: user.so_dien_thoai || '',
            diaChi: user.dia_chi || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      setFormData({
        hoTen: user.ho_ten || '',
        soDienThoai: user.so_dien_thoai || '',
        diaChi: user.dia_chi || '',
      });
      fetchUserProfile();
    }
  }, [user, isUser]);

  if (!isUser()) {
    return (
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang chuyển hướng...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 mb-8 border border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">{user?.ho_ten || 'Người dùng'}</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">{user?.ten_dang_nhap}</p>
            </div>
          </div>
          <div className="flex gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span>📅</span>
            <span>Thành viên từ {new Date(user?.ngay_tao || new Date()).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border-light dark:border-border-dark">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
            }`}
          >
            Bảo mật
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">✅</span>
            <p className="text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-8">
          {activeTab === 'info' && (
            <ProfileInfoTab 
              formData={formData} 
              setFormData={setFormData}
              setError={setError}
              setSuccess={setSuccess}
              user={user}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab 
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEmailVerification } from '../../../hooks/useEmailVerification';
import { resendVerificationEmail } from '../../../services/api/authApi';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { status, message } = useEmailVerification(token);
  
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('Không tìm thấy email');
      return;
    }

    setResendLoading(true);
    try {
      await resendVerificationEmail(email);
      setResendMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn');
      setTimeout(() => setResendMessage(''), 5000);
    } catch (error) {
      setResendMessage(error.message);
      setTimeout(() => setResendMessage(''), 5000);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Loading State */}
        {status === 'loading' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Đang xác thực email</h2>
              <p className="text-gray-600 dark:text-gray-400">Vui lòng chờ...</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Xác thực thành công!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Xác thực thất bại</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}

        {/* Expired State */}
        {status === 'expired' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Token hết hạn</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            </div>

            {resendMessage && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">{resendMessage}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Đang gửi...' : 'Gửi lại email xác thực'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
              >
                Quay lại đăng nhập
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Liên kết xác thực có hiệu lực trong 24 giờ
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
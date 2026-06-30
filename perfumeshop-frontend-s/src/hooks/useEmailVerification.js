import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail as verifyEmailApi } from '../services/api/authApi';

export const useEmailVerification = (token) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const verifyEmail = async () => {
      try {
        if (!token) {
          if (!isCancelled) {
            setStatus('error');
            setMessage('Token không hợp lệ');
          }
          return;
        }

        const data = await verifyEmailApi(token, controller.signal);

        if (isCancelled) return;

        // Handle different statuses
        if (data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Email đã được xác thực thành công!');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            if (!isCancelled) {
              navigate('/login');
            }
          }, 3000);
        } else if (data.status === 'already_verified') {
          setStatus('success');
          setMessage(data.message || 'Email đã được xác thực trước đó');

          // Also redirect for already verified
          setTimeout(() => {
            if (!isCancelled) {
              navigate('/login');
            }
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác thực email thất bại');
        }
      } catch (error) {
        // Ignore AbortError
        if (error.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }

        if (isCancelled) return;

        console.error('Verify error:', error);
        const errorMessage = error?.message || 'Xác thực email thất bại';

        if (errorMessage.includes('hết hạn')) {
          setStatus('expired');
          setMessage('Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực');
        } else {
          setStatus('error');
          setMessage(errorMessage);
        }
      }
    };

    verifyEmail();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [token, navigate]);

  return { status, message };
};
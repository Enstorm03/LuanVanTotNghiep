import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const useReturnOrder = () => {
  const { user } = useAuth();
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const submitReturn = async (order, returnData, onSuccess) => {
    if (!returnData.lyDo.trim()) {
      alert('Vui lòng nhập lý do đổi trả');
      return;
    }

    try {
      setSubmittingReturn(true);

      const returnPayload = {
        idDonHang: order.idDonHang,
        idNguoiDung: user.id_nguoi_dung,
        lyDo: returnData.lyDo.trim()
      };

      console.log('Submitting return request:', returnPayload);
      await api.createReturn(returnPayload);

      alert('Yêu cầu đổi trả đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ với bạn trong thời gian sớm nhất.');

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Không thể gửi yêu cầu đổi trả: ' + error.message);
    } finally {
      setSubmittingReturn(false);
    }
  };

  return {
    submitReturn,
    submittingReturn
  };
};

export default useReturnOrder;


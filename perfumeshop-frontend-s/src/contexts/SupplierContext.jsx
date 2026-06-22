import React, { createContext, useContext, useState, useEffect } from 'react';
import supplierApi from '../services/api/supplierApi';

const SupplierContext = createContext();

export const useSupplier = () => {
  const ctx = useContext(SupplierContext);
  if (!ctx) throw new Error('useSupplier must be used within SupplierProvider');
  return ctx;
};

export const SupplierProvider = ({ children }) => {
  const [supplier, setSupplier] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('supplier');
    if (saved) {
      try { setSupplier(JSON.parse(saved)); } catch { sessionStorage.removeItem('supplier'); }
    }
    setLoading(false);
  }, []);

  const loginSupplier = async (tenDangNhap, matKhau) => {
    const data = await supplierApi.login(tenDangNhap, matKhau);
    setSupplier(data);
    sessionStorage.setItem('supplier', JSON.stringify(data));
    return data;
  };

  const logoutSupplier = () => {
    setSupplier(null);
    sessionStorage.removeItem('supplier');
  };

  return (
    <SupplierContext.Provider value={{ supplier, loading, loginSupplier, logoutSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

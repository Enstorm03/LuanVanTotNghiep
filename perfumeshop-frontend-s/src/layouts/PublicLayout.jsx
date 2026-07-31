import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
// file này để hiển thị layout public, tránh gọi API nhiều lần
const PublicLayout = () => {
  return (
    <>
      <Header brandName="Enstorm" />
      <Outlet /> {/* Các trang public sẽ được render ở đây */}
      <Footer brandName="Enstorm" />
    </>
  );
};

export default PublicLayout;

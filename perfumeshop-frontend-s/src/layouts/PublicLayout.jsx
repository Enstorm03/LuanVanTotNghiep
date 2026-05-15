import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

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

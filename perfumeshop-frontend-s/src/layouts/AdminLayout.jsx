import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
          {/* Outlet sẽ render các trang con (nested routes) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
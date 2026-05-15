import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, isUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const timKiem = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const bamEnter = (e) => {
    if (e.key === 'Enter') {
      timKiem(e);
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-10 py-3 bg-surface-light dark:bg-surface-dark sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-text-light dark:text-text-dark">
          <div className="text-primary text-2xl">
            <Link className="material-symbols-outlined" to="/" >perfume</Link>
          </div>
          {/* <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]"></h2> */}
        </div>
        <div className="hidden lg:flex items-center gap-9">
          <Link className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" to="/">Trang Chu</Link>
          <Link className="text-sm font-medium leading-normal text-primary dark:text-primary" to="/products">San Pham</Link>
          <Link className="text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" to="/brands">Thuong Hieu</Link>
          
        </div>
      </div>
      <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-subtle-light dark:text-subtle-dark flex border-none bg-background-light dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg border-l-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-background-dark focus:border-none h-full placeholder:text-subtle-light placeholder:dark:text-subtle-dark px-4 py-0 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Tìm kiếm nước hoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={bamEnter}
            />
          </div>
        </label>
        
        <Link to="/cart" className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-background-light dark:bg-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark z-50">
              {isUser() ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark border-b border-border-light dark:border-border-dark">
                    Xin chào, {user?.ho_ten || 'User'}
                  </div>
                  <Link
                    to="/lich-su-don-hang"
                    className="block px-4 py-2 text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Lịch sử đơn hàng
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { Link, useLocation } from 'react-router-dom';
import { breadcrumbConfig } from './breadcrumbConfig';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const path = location.pathname;
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  const breadcrumbs = breadcrumbConfig[normalizedPath] || ['Hệ thống', 'Quản lý'];

  return (
    <header className="w-full pl-75 pr-10 pt-5 mb-5">
      {/* --- HEADER BAR --- */}
      <div className="bg-white border border-wms-border-color rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-5 py-3 flex justify-between items-center">
        {/* --- BREADCRUMBS --- */}
        <div className="flex items-center gap-2 text-[13px] text-wms-muted font-medium select-none">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <Fragment key={idx}>
                {idx > 0 && <span className="text-gray-300">/</span>}
                <span className={isLast ? 'text-wms-text-main font-bold' : ''}>
                  {crumb}
                </span>
              </Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Bell button — bg-wms-bg for contrast against white bar */}
          <button className="relative bg-wms-bg w-9 h-9 rounded-xl flex items-center justify-center text-wms-muted cursor-pointer hover:bg-gray-100 transition-colors">
            <i className="fa-regular fa-bell text-[15px]"></i>
            {/* Red notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* --- AVATAR --- */}
          <div className="relative">
            <div
              className="flex items-center gap-2.5 text-[14px] font-medium cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {user?.username?.toLowerCase() === 'frieren' ? (
                <img
                  className="w-8.75 h-8.75 rounded-[50%] object-cover"
                  src="https://i.pinimg.com/736x/d4/68/b9/d468b96d92d70507f0b9b4b8e56e8b05.jpg"
                  alt="Avatar"
                />
              ) : (
                <div className="w-8.75 h-8.75 rounded-[50%] bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                  {user?.username ? user.username.substring(0, 2) : 'W'}
                </div>
              )}
              <span>{user?.username || 'Guest'}</span>
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              ></i>
            </div>

            {/* --- POPUP MENU --- */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fa-regular fa-user w-4"></i>
                  <span>Profile</span>
                </Link>
                <a
                  href="#settings"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-gear w-4"></i>
                  <span>Settings</span>
                </a>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket w-4"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay để đóng menu khi click ra ngoài */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </header>
  );
};

export default Header;

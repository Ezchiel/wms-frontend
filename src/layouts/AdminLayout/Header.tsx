import type React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  return (
    <header className="w-full pr-10 pt-5 flex justify-end items-center gap-5 mb-5">
      <button className="bg-white w-10 h-10 rounded-[50%] flex items-center justify-center text-wms-muted cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.05)">
        <i className="fa-regular fa-bell"></i>
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

      {/* Overlay để đóng menu khi click ra ngoài (Tùy chọn) */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </header>
  );
};

export default Header;

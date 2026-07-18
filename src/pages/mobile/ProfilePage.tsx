import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import {
  User as UserIcon,
  LogOut,
  Shield,
  Activity,
  ChevronRight,
  Settings,
  Bell,
  MapPin,
  HelpCircle,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeader from '../../layouts/MobileLayout/PageHeader';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmLogout(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    setShowConfirmLogout(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false);
  };

  // Map role to Vietnamese label and color
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Quản trị viên',
          bg: 'bg-red-500/10 text-red-500 border border-red-500/20',
        };
      case 'MANAGER':
        return {
          label: 'Quản lý kho',
          bg: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        };
      default:
        return {
          label: 'Nhân viên vận hành',
          bg: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const username = user?.username || 'Người dùng';

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-slate-800 pb-12">
      <PageHeader title="Profile" />
      {/* --- HEADER BLOCK --- */}
      <div className="relative overflow-hidden bg-linear-to-r from-wms-primary to-indigo-700 pb-28 pt-8 px-6 text-white rounded-b-[2.5rem] shadow-lg">
        {/* Decorative background elements */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-20px] left-[-30px] w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>

        {/* Small brand info */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">WMS Mobile Portal</span>
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Online
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {username.toLowerCase() === 'frieren' ? (
              <img
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shadow-md"
                src="https://i.pinimg.com/736x/d4/68/b9/d468b96d92d70507f0b9b4b8e56e8b05.jpg"
                alt="Avatar"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-500 border-2 border-white/30 shadow-md flex items-center justify-center text-white text-2xl font-black">
                {getInitials(username)}
              </div>
            )}
            <div className="absolute bottom-[-5px] right-[-5px] bg-white text-blue-600 p-1.5 rounded-lg shadow-sm border border-slate-100">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight">{username}</h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${roleInfo.bg}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS CARD (Negative margin overlay) --- */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Activity</span>
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-black">Ready</span>
            </div>
          </div>
          <div className="space-y-1 px-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Tasks</span>
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black">12 Completed</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Device</span>
            <div className="flex items-center justify-center gap-1 text-slate-700">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-black">Handheld 01</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIST OPTIONS --- */}
      <div className="px-4 mt-6 space-y-4">
        <div className="bg-white rounded-3xl p-3 shadow-xs border border-slate-100/80 space-y-0.5">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Account Info
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Username</p>
                <p className="text-[10px] text-slate-500 font-medium">{username}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Role</p>
                <p className="text-[10px] text-slate-500 font-medium">{user?.role || 'Operator'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Working Area</p>
                <p className="text-[10px] text-slate-500 font-medium">Main Warehouse</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-3 shadow-xs border border-slate-100/80 space-y-0.5">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            System & Settings
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Device Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">System Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Help & Documentation</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* --- LOGOUT BUTTON --- */}
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer mt-4"
          id="btn-logout-mobile"
        >
          <LogOut className="w-4 h-4" />
          <span>LOG OUT</span>
        </button>
      </div>

      {/* --- CONFIRMATION DIALOG MODAL --- */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-1">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Confirm Logout?</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Are you sure you want to log out of the system? Current sessions will be terminated.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCancelLogout}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/20"
                id="btn-confirm-logout-yes"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

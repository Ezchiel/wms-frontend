import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../app/hooks';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Activity,
  Save,
  Key,
  Clock,
  UserCheck,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ProfileData {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  roleName: string;
  status: string;
}

const ProfilePage: React.FC = () => {
  const reduxUser = useAppSelector((state) => state.auth.user);

  // Local state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form view states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch current user profile on mount
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/users/profile');
      if (response.data?.success) {
        const data = response.data.data;
        setProfile(data);
        setFullName(data.fullName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } else {
        toast.error('Không thể lấy thông tin hồ sơ.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lỗi khi tải thông tin tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Họ tên không được để trống.');
      return;
    }

    if (!email.trim()) {
      toast.error('Email không được để trống.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không đúng định dạng.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Xác nhận mật khẩu mới không khớp.');
        return;
      }
    }

    try {
      setSaving(true);
      const payload: any = {
        fullName,
        email,
        phone,
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const response = await axiosClient.put('/users/profile', payload);

      if (response.data?.success) {
        toast.success('Cập nhật hồ sơ thành công!');
        setProfile(response.data.data);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Cập nhật hồ sơ thất bại.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin.');
    } finally {
      setSaving(false);
    }
  };

  // Map role to standard labeling
  const getRoleInfo = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Quản trị viên',
          bg: 'bg-red-50 text-red-600 border border-red-200',
        };
      case 'MANAGER':
        return {
          label: 'Quản lý kho',
          bg: 'bg-amber-50 text-amber-600 border border-amber-200',
        };
      default:
        return {
          label: 'Nhân viên vận hành',
          bg: 'bg-blue-50 text-blue-600 border border-blue-200',
        };
    }
  };

  const roleInfo = getRoleInfo(profile?.roleName || reduxUser?.role);
  const initials = profile?.fullName ? profile.fullName.substring(0, 2).toUpperCase() : 'WMS';

  // Premium mock activity history for desktop experience
  const mockActivities = [
    { id: 1, action: 'Đăng nhập hệ thống', time: 'Hôm nay, 14:15', ip: '192.168.30.103', status: 'Thành công' },
    { id: 2, action: 'Cập nhật kho chứa hàng', time: 'Hôm qua, 09:30', ip: '192.168.30.103', status: 'Thành công' },
    { id: 3, action: 'Đăng nhập hệ thống', time: 'Hôm qua, 08:45', ip: '192.168.30.103', status: 'Thành công' },
    { id: 4, action: 'Đổi mật khẩu tài khoản', time: '08/07/2026, 16:22', ip: '127.0.0.1', status: 'Thành công' },
  ];

  return (
    <div className="w-full pl-75 pr-10 pb-6 text-wms-text-main font-sans">
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-xs border border-gray-100">
          <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Loading profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* --- LEFT CARD: USER CARD (4 COLS) --- */}
          <div className="lg:col-span-4 space-y-6">

            {/* Avatar & Roles Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="relative mt-8 mb-4 inline-block">
                {profile?.username.toLowerCase() === 'frieren' ? (
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                    src="https://i.pinimg.com/736x/d4/68/b9/d468b96d92d70507f0b9b4b8e56e8b05.jpg"
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-white shadow-md mx-auto flex items-center justify-center text-white text-2xl font-black">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-0 right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" title="Online">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-800 tracking-tight">{profile?.fullName}</h2>
              <p className="text-xs text-slate-400 font-medium mb-3">@{profile?.username}</p>

              <div className="flex justify-center mb-4">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${roleInfo.bg}`}>
                  {roleInfo.label}
                </span>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="space-y-3.5 text-left text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">Status:</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <UserCheck className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">Login Device:</span>
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Smartphone className="w-3.5 h-3.5" />
                    Web Desktop
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium text-slate-400">Privilege Area:</span>
                  <span className="font-bold text-slate-700">Full System Access</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-500" />
                System Performance
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <span className="text-[10px] text-blue-600 font-bold block mb-1">Sessions</span>
                  <span className="text-lg font-black text-blue-700">128</span>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                  <span className="text-[10px] text-indigo-600 font-bold block mb-1">Monthly Operations</span>
                  <span className="text-lg font-black text-indigo-700">1.4K</span>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT CARD: FORMS (8 COLS) --- */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main Form Card */}
            <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="border-b border-gray-100 p-5 bg-slate-50/50">
                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  Profile Configuration
                </h3>
              </div>

              <div className="p-6 space-y-6">

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Username (Read-only)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        disabled
                        value={profile?.username || ''}
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="name@wms.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="0987654321"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Password Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <h4 className="text-[13px] font-bold text-slate-800">Change Password (Leave empty if not changing)</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password from 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Confirm new password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit panel */}
              <div className="bg-slate-50/50 border-t border-gray-100 p-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={fetchProfile}
                  disabled={saving}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Activity History Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="border-b border-gray-100 p-5 flex justify-between items-center">
                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Recent Activity History
                </h3>
                <span className="text-[10px] text-wms-muted font-semibold">Auto-refresh</span>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase">
                      <th className="py-3 px-5 font-bold">Activity</th>
                      <th className="py-3 px-5 font-bold">Time</th>
                      <th className="py-3 px-5 font-bold">IP Address</th>
                      <th className="py-3 px-5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-5 font-semibold text-slate-700">{act.action}</td>
                        <td className="py-3 px-5 text-slate-500">{act.time}</td>
                        <td className="py-3 px-5 text-slate-500 font-mono">{act.ip}</td>
                        <td className="py-3 px-5">
                          <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default ProfilePage;

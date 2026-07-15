import React, { useEffect, useState } from 'react';
import type { CreateUserPayload, User } from '../userTypes';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (id: number, userData: CreateUserPayload) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const initialFormState: CreateUserPayload = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: '',
    phone: '',
    status: 'ACTIVE',
  };

  const [formData, setFormData] = useState<CreateUserPayload>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '', // default empty, optional
        fullName: user.fullName || '',
        email: user.email,
        role: user.roleName,
        phone: user.phone || '',
        status: user.status || 'ACTIVE',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrorMsg(null);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(null);
  };

  const handleSave = async () => {
    if (
      !formData.username ||
      !formData.fullName ||
      !formData.email ||
      !formData.role ||
      !formData.status
    ) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If password is empty, don't send it or send undefined to backend so it isn't overwritten.
      const payload: CreateUserPayload = {
        ...formData,
        password: formData.password || undefined,
      };

      await onSave(user.id, payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else if (typeof error === 'string') {
        setErrorMsg(error);
      } else {
        setErrorMsg('Có lỗi xảy ra khi lưu');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-125 rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">Edit user</h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-wms-text-main transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body (Form) */}
        <div className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-[13px] rounded-md border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              User name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter user name"
              value={formData.username}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Password <span className="text-wms-muted text-[11px] font-normal">(Để trống nếu không muốn thay đổi)</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary transition-colors"
            >
              <option value="" className="text-wms-muted">
                Please choose role
              </option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary transition-colors"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="LOCKED">LOCKED</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:bg-wms-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : null}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;

import type React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { lockUser, unlockUser, deleteUser, restoreUser } from '../userThunks';
import type { User } from '../userTypes';
import { toast } from 'react-toastify';
import { StatusBadge } from '../../../components/StatusBadge';

interface DataTableProps {
  tableHeads: string[];
  users: User[];
  onEdit?: (user: User) => void;
}

const DataTable: React.FC<DataTableProps> = ({ tableHeads, users, onEdit }) => {
  const dispatch = useAppDispatch();

  const handleAction = async (type: string, userId: number) => {
    if (type === 'Lock') {
      if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
        try {
          const result = await dispatch(lockUser(userId)).unwrap();
          toast.success(result.message || 'Khóa tài khoản thành công!');
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Lỗi khi khóa tài khoản!');
        }
      }
    } else if (type === 'Unlock') {
      if (window.confirm('Bạn có chắc chắn muốn mở khóa tài khoản này?')) {
        try {
          const result = await dispatch(unlockUser(userId)).unwrap();
          toast.success(result.message || 'Mở khóa tài khoản thành công!');
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Lỗi khi mở khóa tài khoản!');
        }
      }
    } else if (type === 'Delete') {
      if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
        try {
          const result = await dispatch(deleteUser(userId)).unwrap();
          toast.success(result.message || 'Xóa tài khoản thành công!');
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Lỗi khi xóa tài khoản!');
        }
      }
    } else if (type === 'Restore') {
      if (window.confirm('Bạn có chắc chắn muốn khôi phục tài khoản này?')) {
        try {
          const result = await dispatch(restoreUser(userId)).unwrap();
          toast.success(result.message || 'Khôi phục tài khoản thành công!');
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Lỗi khi khôi phục tài khoản!');
        }
      }
    } else if (type === 'Edit') {
      const user = users.find((u) => u.id === userId);
      if (user && onEdit) {
        onEdit(user);
      }
    }
  };

  const getActionBtns = (status: string) => {
    if (status === 'INACTIVE') {
      return [
        {
          label: 'Restore',
          color: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
        },
      ];
    }
    return [
      {
        label: status === 'LOCKED' ? 'Unlock' : 'Lock',
        color: status === 'LOCKED'
          ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
          : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
      },
      { label: 'Delete', color: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' },
      {
        label: 'Edit',
        color: 'border-wms-primary text-wms-primary hover:bg-wms-primary hover:text-white',
      },
    ];
  };

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="bg-[#f8fafc]">
        <tr>
          {tableHeads.map((element, index) => (
            <th className="text-start p-3.75 text-wms-muted font-medium" key={index}>
              {element}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.username}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.fullName || 'N/A'}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.roleName}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.email}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                <StatusBadge
                  text={user.status}
                  variant={user.status === 'ACTIVE' ? 'success' : user.status === 'LOCKED' ? 'warning' : 'danger'}
                />
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {getActionBtns(user.status).map((element, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(element.label, user.id)}
                    className={`mr-2 px-5 py-1 border rounded-[7px] cursor-pointer ${element.color}`}
                  >
                    {element.label}
                  </button>
                ))}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={tableHeads.length} className="py-4 text-center text-gray-500">
              Không có dữ liệu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;

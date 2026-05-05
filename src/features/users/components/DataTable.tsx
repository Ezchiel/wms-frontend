import type React from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { lockUser } from '../userThunks';
import type { User } from '../userTypes';

interface DataTableProps {
  tableHeads: string[];
  users: User[];
}

const DataTable: React.FC<DataTableProps> = ({ tableHeads, users }) => {
  const dispatch = useAppDispatch();

  const handleAction = (type: string, userId: number) => {
    if (type === 'Lock') {
      if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
        dispatch(lockUser(userId));
      }
    }
    // Delete, Edit
  };

  const actionBtns = [
    {
      label: 'Lock',
      color: 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
    },
    { label: 'Delete', color: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' },
    {
      label: 'Edit',
      color: 'border-wms-primary text-wms-primary hover:bg-wms-primary hover:text-white',
    },
  ];

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
              {/* <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </td> */}
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {user.email}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {actionBtns.map((element, index) => (
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

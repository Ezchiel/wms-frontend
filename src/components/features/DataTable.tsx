import type React from 'react';
import type { User } from '../../store/slices/userSlices';

interface DataTableProps {
  tableHeads: string[];
  users: User[];
}

const DataTable: React.FC<DataTableProps> = ({ tableHeads, users }) => {
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
                  className={`px-2 py-1 rounded-full text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                <button className="px-5 py-1 mr-2 border border-wms-primary rounded-[7px] text-wms-primary">
                  Lock
                </button>
                <button className="px-5 py-1 border border-wms-primary rounded-md text-wms-primary">
                  Delete
                </button>
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

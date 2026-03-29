import React from 'react';

const Home: React.FC = () => {
  const tabs = ['All users', 'Add new user', 'Roles'];
  const tableHeads = ['User name', 'Full name', 'Role', 'Create at', 'Status'];

  const getTabColor = (index: number) => {
    if (index === 0) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="pl-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">User management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">User management for administrator</p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col pr-15">
        {/* Tabs */}
        <div className="flex">
          {tabs.map((element, index) => (
            <button
              className="relative h-12 w-40 flex items-center justify-center -mr-5.5 group cursor-pointer"
              style={{ zIndex: tabs.length - index }}
              key={index}
            >
              {index === 0 ? (
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ color: getTabColor(index) }}
                  preserveAspectRatio="none"
                  width="160"
                  height="48"
                  viewBox="0 0 160 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 12C0 5.37258 5.37258 0 12 0H130.631C136.137 0 140.937 3.74757 142.272 9.08957L149.382 37.5286C150.683 42.7311 154.78 46.7717 160 48H1C0.447719 48 0 47.5523 0 47V12Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ color: getTabColor(index) }}
                  preserveAspectRatio="none"
                  width="220"
                  height="48"
                  viewBox="0 0 220 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8492 8.49337C23.3912 3.44698 28.0487 0 33.3255 0H186.675C191.951 0 196.609 3.44698 198.151 8.49338L206.52 35.8821C208.421 42.1066 213.609 46.7696 220 48H0C6.39123 46.7696 11.5785 42.1066 13.4805 35.8821L21.8492 8.49337Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span className={`relative z-10 text-[14px] ${index === 0 ? 'pr-3' : ''}`}>
                {element}
              </span>
            </button>
          ))}
        </div>

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          {/* Filter */}
          <div className="flex justify-between items-center mb-6.25">
            <div className="flex items-center gap-3.75">
              <div className="flex items-center gap-2.5 text-[13px] font-medium">
                <label>User name</label>
                <input
                  className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-muted"
                  type="text"
                  placeholder="Please enter here"
                />
              </div>
              <div className="flex items-center gap-2.5 text-[13px] font-medium">
                <label>Role name</label>
                <select className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-muted">
                  <option>Please choose</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <button className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-transparent border border-solid border-wms-primary text-wms-primary">
                Search
              </button>
            </div>
            <button className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-wms-primary border border-solid border-wms-primary text-white flex items-center gap-2">
              <i className="fa-solid fa-download"></i>
              Export
            </button>
          </div>

          {/* Table */}
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
              <tr>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  Frieren
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  Himel Frieren
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  Admin
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  28/03/2026
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  Active
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-1.25 mt-6.25">
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              <i className="fa-solid fa-angle-left"></i>
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border rounded-sm text-[13px] cursor-pointer bg-white border-wms-primary text-wms-primary">
              1
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              2
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              3
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              4
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              5
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              ...
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              17
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] text-wms-muted cursor-pointer bg-white">
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

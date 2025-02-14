import React, { useEffect, useState } from 'react';
import CardDataStats from '../../../../components/CardDataStats';
import UserOnline from '../../../../components/UserOnline';
import { FaUserCheck, FaUserClock, FaUsers, FaUserTimes } from 'react-icons/fa';
import { User as UserOnlineType } from '../../../../components/UserOnline'; // Import User type from UserOnline
import Pagination from '../../../../components/Table/Pagination';

const DashboardSuperAdmin: React.FC = () => {
  const [userOnline, setUserOnline] = useState<string>("0");
  const [totalUser, setTotalUser] = useState<string>("0");
  const [userActive, setUserActive] = useState<string>("0");
  const [userDeactive, setUserDeactive] = useState<string>("0");

  // Align the User type with what UserOnline expects
  const [onlineUsers, setOnlineUsers] = useState<UserOnlineType[]>([
    { 
      id: "1", 
      name: "John Doe", 
      role: "1", 
      last_login: "10:00 AM", 
      last_update: "10:30 AM", 
      token: "abc123", 
      username: "johndoe" 
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      role: "2", 
      last_login: "11:00 AM", 
      last_update: "11:30 AM", 
      token: "xyz456", 
      username: "janesmith" 
    }
  ]);

  useEffect(() => {
    setUserOnline("10");
    setTotalUser("100");
    setUserActive("80");
    setUserDeactive("20");
  }, []);

  const handleLogoutUser = (userId: string) => {
    console.log(`Logging out user ${userId}`);
    setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const getRoleName = (roleId: string) => {
    const roles: Record<string, string> = {
      "1": "Super Admin",
      "2": "Admin Accounting",
      "3": "Supplier"
    };
    return roles[roleId] || "Unknown";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const filteredData = onlineUsers; // Ubah sesuai dengan kebutuhan filter

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <CardDataStats
          title="User Online"
          total={userOnline}
          rate=""
          levelUp={Number(userOnline) > 0}
          levelDown={Number(userOnline) <= 0}
        >
          <FaUserClock className="fill-green-500 dark:fill-white" size={24} />
        </CardDataStats>
        <CardDataStats
          title="Total User"
          total={totalUser}
          rate=""
          levelUp={Number(totalUser) > 0}
          levelDown={Number(totalUser) <= 0}
        >
          <FaUsers className="fill-blue-500 dark:fill-white" size={24} />
        </CardDataStats>
        <CardDataStats
          title="User Active"
          total={userActive}
          rate=""
          levelUp={Number(userActive) > 0}
          levelDown={Number(userActive) <= 0}
        >
          <FaUserCheck className="fill-yellow-500 dark:fill-white" size={24} />
        </CardDataStats>
        <CardDataStats
          title="User Deactive"
          total={userDeactive}
          rate=""
          levelUp={Number(userDeactive) > 0}
          levelDown={Number(userDeactive) <= 0}
        >
          <FaUserTimes className="fill-red-500 dark:fill-white" size={24} />
        </CardDataStats>
      </div>

      {/* Tabel User Online */}
      <div className="bg-white">
        <div className="p-2 md:p-4 lg:p-6 space-y-6">
          <UserOnline
            onlineUsers={onlineUsers} // Pass the correctly typed dummy data
            handleLogoutUser={handleLogoutUser}
            getRoleName={getRoleName}
          />
          {/* Pagination */}
          <Pagination
              totalRows={filteredData.length}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
    </div>
  );
};

export default DashboardSuperAdmin;

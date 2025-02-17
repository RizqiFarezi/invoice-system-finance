import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {API_Dashboard, API_User_Login_Performance__Admin, API_User_Logout_Admin, API_User_Online_Admin,} from '../../../../api/api';
import CardDataStats from '../../../../components/CardDataStats';
import UserOnline from '../../../../components/UserOnline';
import Pagination from '../../../../components/Table/Pagination';
import { FaUserCheck, FaUserClock, FaUsers, FaUserTimes } from 'react-icons/fa';
import BarChart from '../../../../components/Charts/BarChart';

interface LoginData {
  username: string;
  login_count: number;
}

const DashboardSuperAdmin: React.FC = () => {
  // Dashboard stats
  const [dashboardData, setDashboardData] = useState({
    user_online: '-',
    total_user: '-',
    user_active: '-',
    user_deactive: '-',
  });

  // Online users
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  // Login performance for bar charts
  const [dailyLoginData, setDailyLoginData] = useState<LoginData[]>([]);
  const [monthlyLoginData, setMonthlyLoginData] = useState<LoginData[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetching dashboard data ---
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_Dashboard(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setDashboardData({
            user_online: data.active_tokens,
            total_user: data.total_users,
            user_active: data.active_users,
            user_deactive: data.deactive_users,
          });
        } else {
          toast.error(`Error fetching dashboard data: ${result.message}`);
          setErrorCount((prevCount) => prevCount + 1);
        }
      } else {
        toast.error(`Gagal mengambil data: ${response.status}`);
        setErrorCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      setErrorCount((prevCount) => prevCount + 1);
      if (error instanceof Error) {
        toast.error(`Error fetching dashboard data: ${error.message}`);
      } else {
        toast.error('Error fetching dashboard data');
      }
    }
  };

  // --- Fetching online user data ---
  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_User_Online_Admin(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOnlineUsers(result.data);
        } else {
          console.error('Error fetching online users:', result.message);
          setErrorCount((prevCount) => prevCount + 1);
        }
      } else {
        console.error('Error fetching online users:', response.status);
        setErrorCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
      setErrorCount((prevCount) => prevCount + 1);
    }
  };

  // --- Logout a user from the online users table ---
  const handleLogoutUser = async (token_id: string) => {
    try {
      const adminToken = localStorage.getItem('access_token');
      const response = await fetch(API_User_Logout_Admin(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_id }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const loggedOutUser = onlineUsers.find((user) => user.token === token_id);
          toast.success(`User ${loggedOutUser?.name || 'unknown'} logged out successfully`);
          setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.token !== token_id));
        } else {
          toast.error(`Error logging out user: ${result.message}`);
        }
      } else {
        toast.error('Error logging out user');
      }
    } catch (error) {
      console.error('Error logging out user:', error);
      toast.error('Error logging out user');
    }
  };

  // --- Helper to map role IDs to names ---
  const getRoleName = (roleId: string) => {
    const roles: Record<string, string> = {
      '1': 'Super Admin',
      '2': 'Admin Finance',
      '3': 'Supplier',
    };
    return roles[roleId] || 'Unknown';
  };

  // --- Fetching login performance data for bar chart ---
  const fetchLoginData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_User_Login_Performance__Admin(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Sort daily data (descending by login_count) and top 10
          const sortedDailyData = result.data.daily
            .sort((a: LoginData, b: LoginData) => b.login_count - a.login_count)
            .slice(0, 10);

          // Sort monthly data (descending by login_count) and top 10
          const sortedMonthlyData = result.data.monthly
            .sort((a: LoginData, b: LoginData) => b.login_count - a.login_count)
            .slice(0, 10);

          setDailyLoginData(sortedDailyData);
          setMonthlyLoginData(sortedMonthlyData);
        } else {
          console.error('Error fetching login data:', result.message);
        }
      } else {
        console.error('Error fetching login data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  // --- Periodic fetching of data on mount and refresh ---
  useEffect(() => {
    fetchLoginData();
    fetchDashboardData();
    fetchOnlineUsers();

    const intervalId = setInterval(() => {
      if (errorCount < 3) {
        fetchLoginData();
        fetchDashboardData();
        fetchOnlineUsers();
      } else {
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // --- Prepare bar chart data ---
  const categoriesDaily = dailyLoginData.map((item) => item.username);
  const dataDaily = dailyLoginData.map((item) => item.login_count);
  const categoriesMonthly = monthlyLoginData.map((item) => item.username);
  const dataMonthly = monthlyLoginData.map((item) => item.login_count);

  // --- Pagination logic for user online table ---
  const filteredData = onlineUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="space-y-6">
        {/* Cards for dashboard stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats
            title="User Online"
            total={dashboardData.user_online.toString()}
            rate=""
            levelUp={Number(dashboardData.user_online) > 0}
            levelDown={Number(dashboardData.user_online) <= 0}
          >
            <FaUserClock className="fill-green-500 dark:fill-white" size={24} />
          </CardDataStats>
          <CardDataStats
            title="Total User"
            total={dashboardData.total_user.toString()}
            rate=""
            levelUp={Number(dashboardData.total_user) > 0}
            levelDown={Number(dashboardData.total_user) <= 0}
          >
            <FaUsers className="fill-blue-500 dark:fill-white" size={24} />
          </CardDataStats>
          <CardDataStats
            title="User Active"
            total={dashboardData.user_active.toString()}
            rate=""
            levelUp={Number(dashboardData.user_active) > 0}
            levelDown={Number(dashboardData.user_active) <= 0}
          >
            <FaUserCheck className="fill-yellow-500 dark:fill-white" size={24} />
          </CardDataStats>
          <CardDataStats
            title="User Deactive"
            total={dashboardData.user_deactive.toString()}
            rate=""
            levelUp={Number(dashboardData.user_deactive) > 0}
            levelDown={Number(dashboardData.user_deactive) <= 0}
          >
            <FaUserTimes className="fill-red-500 dark:fill-white" size={24} />
          </CardDataStats>
        </div>

        {/* Bar charts for login performance */}
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 2xl:gap-7">
          <BarChart
            title="Login Performance"
            categories={categoriesDaily}
            data={dataDaily}
            subTitle="24 Hours"
            footer="User Login Daily Performance"
          />
          <BarChart
            title="Login Performance"
            categories={categoriesMonthly}
            data={dataMonthly}
            subTitle="Monthly"
            footer="User Login Monthly Performance"
          />
        </div>

        {/* Table for Users Online */}
        <UserOnline
          onlineUsers={filteredData}
          handleLogoutUser={handleLogoutUser}
          getRoleName={getRoleName}
        />

        {/* Pagination */}
        <Pagination
          totalRows={onlineUsers.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default DashboardSuperAdmin;
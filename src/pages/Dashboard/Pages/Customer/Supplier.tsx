import React, { useEffect, useState } from 'react';
import CardDataStats from '../../../../components/CardDataStats';

const Dashboard: React.FC = () => {
  const [userOnline, setUserOnline] = useState<string>("0");
  const [totalUser, setTotalUser] = useState<string>("0");
  const [userActive, setUserActive] = useState<string>("0");
  const [userDeactive, setUserDeactive] = useState<string>("0");

  useEffect(() => {
    // Example to set data, this can come from an API
    setUserOnline("10");
    setTotalUser("100");
    setUserActive("80");
    setUserDeactive("20");
  }, []);

  return (
    <div className="space-y-4">
      {/* Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardDataStats title="User Online" total={userOnline} rate="100">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1h20v14H1z" />
          </svg>
        </CardDataStats>

        <CardDataStats title="Total User" total={totalUser} rate="100">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1h20v14H1z" />
          </svg>
        </CardDataStats>

        <CardDataStats title="User Active" total={userActive} rate="100">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1h20v14H1z" />
          </svg>
        </CardDataStats>

        <CardDataStats title="User Deactive" total={userDeactive} rate="100">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1h20v14H1z" />
          </svg>
        </CardDataStats>
      </div>

      {/* Chart Section */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg">
        {/* Replace with your chart component */}
        <p className="text-center text-white py-16">Chart Goes Here</p>
      </div>
    </div>
  );
};

export default Dashboard;



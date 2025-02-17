import React, { useEffect, useState } from 'react';
import CardDataStats from '../../../../components/CardDataStats';
import ListProgress from '../../../../components/ListProgress';
import { FaFileInvoice, FaHourglassHalf, FaTimesCircle, FaMoneyCheckAlt, FaMoneyBillWave } from "react-icons/fa";

const DashboardSuperAdmin: React.FC = () => {
  const [totalUser, setTotalUser] = useState<string>("0");
  const [userActive, setUserActive] = useState<string>("0");
  const [userDeactive, setUserDeactive] = useState<string>("0");

  useEffect(() => {
    setTotalUser("100");
    setUserActive("80");
    setUserDeactive("20");
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardDataStats
          title={<span className="text-sm font-font-medium text-blue-400">New Invoice</span>}
          total={<span className=" text-2xl font-semibold text-blue-400">{totalUser}</span>}
          rate=""
          levelUp={Number(totalUser) > 0}
          levelDown={Number(totalUser) <= 0}
        >
          <FaFileInvoice className="fill-blue-400 dark:fill-white" size={24} />
        </CardDataStats>
  
        <CardDataStats
          title={<span className="text-sm font-font-medium text-yellow-300">In Process Invoice</span>}
          total={<span className="text-2xl font-semibold text-yellow-300">{userActive}</span>}
          rate=""
          levelUp={Number(userActive) > 0}
          levelDown={Number(userActive) <= 0}
        >
          <FaHourglassHalf className="fill-yellow-300 dark:fill-white" size={24} />
        </CardDataStats>
  
        <CardDataStats
          title={<span className="text-sm font-font-medium text-red-500">Reject Invoice</span>}
          total={<span className="text-2xl font-semibold text-red-500">{userDeactive}</span>}
          rate=""
          levelUp={Number(userDeactive) > 0}
          levelDown={Number(userDeactive) <= 0}
        >
          <FaTimesCircle className="fill-red-500 dark:fill-white" size={24} />
        </CardDataStats>
  
        <CardDataStats
          title={<span className="text-sm font-font-medium text-green-500">Ready to Payment</span>}
          total={<span className="text-2xl font-semibold text-green-500">{userDeactive}</span>}
          rate=""
          levelUp={Number(userDeactive) > 0}
          levelDown={Number(userDeactive) <= 0}
        >
          <FaMoneyCheckAlt className="fill-green-500 dark:fill-white" size={24} />
        </CardDataStats>
  
        <CardDataStats
          title={<span className="text-sm font-medium text-blue-800">Paid Invoice</span>}
          total={<span className="text-2xl font-semibold text-blue-800">{userDeactive}</span>}
          rate=""
          levelUp={Number(userDeactive) > 0}
          levelDown={Number(userDeactive) <= 0}
        >
          <FaMoneyBillWave className="fill-blue-800 dark:fill-white" size={24} />
        </CardDataStats>
      </div>

      {/* List Progress untuk Invoice */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <ListProgress />
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;

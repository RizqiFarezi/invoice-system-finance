import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from './Header';
import Footer from './Footer/Footer';

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetching user role from localStorage and setting the state
  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log('User Role:', role); // Debugging role value
    setUserRole(role);
    setIsLoading(false);
  }, []);

  // If still loading, show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-red-50"> {/* Added bg-red-50 */}
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={userRole} />
      
      <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;

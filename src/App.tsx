import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/Pages/SignIn';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
import ListUser from './components/Sidebar/SidebarMenu/component/ListUser';  // Ensure this path is correct
import AddUser from './components/Sidebar/SidebarMenu/component/AddUser';  // Ensure this path is correct
import { AuthProvider } from './pages/Authentication/AuthContext';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading state
  }, []);

  if (loading) {
    return <Loader />;  // Show loading screen while loading
  }

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/auth/login" element={<SignIn />} />

        {/* Protected Routes for Admin & Superadmin */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin', 'admin-accounting']} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            {/* ListUser is now directly accessible under this route */}
            <Route path="/list-user" element={<ListUser />} />
            <Route path="/add-user" element={<AddUser />} />
          </Route>
        </Route>

        {/* Protected Routes for Supplier */}
        <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/tables" element={<Tables />} />
          </Route>
        </Route>

        {/* Optional 404 route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

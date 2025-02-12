import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/Pages/SignIn';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
import { AuthProvider } from './pages/Authentication/AuthContext';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/auth/login" element={<SignIn />} />
        
        {/* Routes for Admin & Superadmin */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin', 'admin-accounting']} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Routes for Supplier */}
        <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/tables" element={<><PageTitle title="Tables | PT SANOH INDONESIA" /><Tables /></>} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;

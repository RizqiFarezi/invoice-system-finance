import { HashRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/Pages/SignIn';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
import ManageUser from './pages/ManageUser/Pages/ManageUser';  // Ensure this path is correct
import AddUser from './pages/ManageUser/Pages/AddUser';  // Ensure this path is correct
import EditUser from './pages/ManageUser/Pages/EditUser';  // Ensure this path is correct
import { AuthProvider } from './pages/Authentication/AuthContext';
import GrTracking from './pages/GrTracking';
import InvoiceCreation from './pages/InvoiceCreation';
import InvoiceReport from './pages/InvoiceReport';

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
      <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/auth/login" element={<SignIn />} />

        {/* Protected Routes for Superadmin */}
        <Route element={<ProtectedRoute allowedRoles={['super-admin']} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            {/* ListUser is now directly accessible under this route */}
            <Route path="/list-user" element={<ManageUser />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-user" element={<EditUser />} />
            <Route path="/gr-tracking" element={<GrTracking />} />
            <Route path="/invoice-creation" element={<InvoiceCreation />} />
            <Route path="/invoice-report" element={<InvoiceReport />} />
          </Route>
        </Route>

        {/* Protected Routes for Admin Accounting */}
        <Route element={<ProtectedRoute allowedRoles={['admin-finance']} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/dashboardfinance" element={<Dashboard />} />
            <Route path="/gr-tracking2" element={<GrTracking />} />
            <Route path="/invoice-creation2" element={<InvoiceCreation />} />
            <Route path="/invoice-report2" element={<InvoiceReport />} />

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
      </HashRouter>
    </AuthProvider>
  );
};

export default App;

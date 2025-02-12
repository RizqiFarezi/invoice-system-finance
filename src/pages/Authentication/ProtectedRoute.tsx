import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Debugging log to verify the values of isAuthenticated and userRole
  console.log('isAuthenticated:', isAuthenticated);
  console.log('userRole:', userRole);
  console.log('allowedRoles:', allowedRoles);

  // Jika tidak terautentikasi, arahkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // Jika peran tidak diizinkan, arahkan ke halaman utama
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Jika lulus pengecekan, tampilkan konten
  return <Outlet />;
};

export default ProtectedRoute;

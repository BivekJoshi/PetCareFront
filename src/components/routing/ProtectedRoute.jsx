import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Guards nested routes. Redirects unauthenticated users to /login,
 * and signed-in users without the required role to the 401 page.
 */
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length && !roles.includes(role)) {
    return <Navigate to="/401" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

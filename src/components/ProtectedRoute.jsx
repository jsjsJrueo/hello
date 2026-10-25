import { Navigate } from "react-router";
import { getToken } from "../api/auth";

// Wraps a page: without login info the user is sent to Login instead.
function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;

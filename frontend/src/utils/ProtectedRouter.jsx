import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../context/AuthContext.jsx";
import CircleLoader from '../components/CircleLoader.jsx'


export function ProtectedRouter({ allowedRoles }) {
  const { isAuthenticate, accessToken } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (isAuthenticate === null) return; // Still checking authentication

    if (!isAuthenticate) {
      setIsAuthorized(false);
      return;
    }

    if (allowedRoles && accessToken) {
      try {
        const userRole = jwtDecode(accessToken)?.role;
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [accessToken, allowedRoles, isAuthenticate]);

  if (isAuthorized === null) {
    return <div className="w-full h-screen flex justify-center items-center">
      <CircleLoader />
    </div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
}

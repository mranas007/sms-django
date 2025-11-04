import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../context/AuthContext.jsx";

export function ProtectedRouter({ children, allowedRoles }) {
  const { isAuthenticate, accessToken } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const isAuth = await isAuthenticate();

      if (!isAuth) {
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
    };

    verifyUser();
  }, [accessToken, allowedRoles]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

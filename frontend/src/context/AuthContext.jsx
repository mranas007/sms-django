// REACT HOOKS
import { React,  createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// CONSTANT
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant/TokensConstant.js';

// SERVICES
import Api from '../services/Api.jsx';



// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_TOKEN));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_TOKEN));
  const [checkAuthenticate, setCheckAuthenticate] = useState(null);

  // ✅ Convert to boolean properly
  const isAuthenticate = async () => {
    try {
      if (!accessToken) return false;

      const decoded = jwtDecode(accessToken);
      if (!decoded?.exp) return false;

      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        const refreshed = await getRefreshToken();
        return refreshed;
      }

      return true;
    } catch (err) {
      console.error('Error checking authentication:', err);
      return false;
    }
  };

  const getRefreshToken = async () => {
    try {
      const res = await Api.post('/account/login/refresh/', { refresh: refreshToken });
      if (res?.data?.access) updateAccessToken(res.data.access);

      if (res?.data?.refresh) updateRefreshToken(res.data.refresh);

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  const updateAccessToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN, token);
    setAccessToken(token);
  };

  const updateRefreshToken = (token) => {
    localStorage.setItem(REFRESH_TOKEN, token);
    setRefreshToken(token);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setAccessToken(null);
    setRefreshToken(null);
    setCheckAuthenticate(false);
  };

  // ✅ Always run once on mount
  useEffect(() => {
    (async () => {
      const authenticated = await isAuthenticate();
      setCheckAuthenticate(authenticated);
    })();
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticate,
        accessToken,
        setAccessToken: updateAccessToken,
        refreshToken,
        setRefreshToken: updateRefreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

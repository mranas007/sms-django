// REACT HOOKS
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

// JWT
import { jwtDecode } from 'jwt-decode';

// CONTEXT
import { AuthProvider, useAuthContext } from './context/AuthContext.jsx';

// PAGES
import NotFound from './pages/NotFound.jsx';

// ROUTES
import GuestRoutes from './routers/Guest.Routes.jsx';
import AdminRoutes from './routers/Admin.Routes.jsx';
import StudentRoutes from './routers/Student.Routes.jsx';
import TeacherRoutes from './routers/Teacher.Routes.jsx';


const AppRoutes = () => {
  const { isAuthenticate, accessToken } = useAuthContext();

  if (!isAuthenticate || !accessToken) {
    return <GuestRoutes />;
  }

  try {
    const user = jwtDecode(accessToken);
    
    if (user && user.role) {
      switch (user.role) {
        case 'Admin':
          return <AdminRoutes />;
        case 'Student':
          return <StudentRoutes />;
        case 'Teacher':
          return <TeacherRoutes />;
        default:
          return <GuestRoutes />;
      }
    } else {
      return <GuestRoutes />;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return <GuestRoutes />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

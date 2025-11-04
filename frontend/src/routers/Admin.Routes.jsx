// REACT HOOK
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// PAGES
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import Users from '../pages/admin/Users.jsx';
import AddUser from '../pages/admin/AddUser.jsx';
import NotFound from '../pages/NotFound.jsx';

// COMPONENTS
import AdminNavbar from '../components/AdminNavbar.jsx';
import Footer from '../components/Footer.jsx';


export default function AdminRoutes() {
  return (
    
    <>
      <AdminNavbar/>
        <main className="max-w-7xl mx-auto p-4 bg-gray-100">
          <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/user/add" element={<AddUser />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      <Footer />
    </>
  );
}

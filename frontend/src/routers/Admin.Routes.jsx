// REACT HOOK
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// PAGES
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import Users from '../pages/admin/Users.jsx';
import AddUser from '../pages/admin/AddUser.jsx';



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/add" element={<AddUser />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

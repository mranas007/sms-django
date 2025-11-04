import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { FaUserCircle, FaBars, FaTimes, FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt, FaChalkboardTeacher, FaBook, FaGraduationCap } from 'react-icons/fa';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Navbar - Fixed */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-white shadow-md p-4 z-40">
        <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
          <FaBars className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-blue-800 md:ml-0 ml-4">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium flex items-center">
            <FaUserCircle className="mr-2 text-xl" /> Admin
          </span>
          <button
            onClick={handleLogout}
            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition hidden md:block"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar - Closed by default */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out bg-gray-800 text-white w-64 p-4 z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AdminPanel</h2>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/dashboard");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/dashboard")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaTachometerAlt className="mr-3" /> Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/users");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/users")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaUsers className="mr-3" /> Users
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/classes");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/classes")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaGraduationCap className="mr-3" /> Classes
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/subjects");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/subjects")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaBook className="mr-3" /> Subjects
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/teachers");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/teachers")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaChalkboardTeacher className="mr-3" /> Teachers
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  navigate("/admin/settings");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center py-2 px-4 rounded w-full text-left ${
                  isActive("/admin/settings")
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <FaCog className="mr-3" /> Settings
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="flex items-center py-2 px-4 rounded hover:bg-gray-700 w-full text-left text-red-400"
              >
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

    </>
  );
}
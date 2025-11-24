import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaGraduationCap,
  FaBook,
  FaChartLine
} from 'react-icons/fa';
import Button from '../common/Button.jsx';

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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/classes', icon: FaGraduationCap, label: 'Classes' },
    { path: '/admin/subjects', icon: FaBook, label: 'Subjects' },
    { path: '/admin/activities', icon: FaChartLine, label: 'Activities' },
  ];

  return (
    <>
      {/* Top Navbar - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section: Menu Button + Logo */}
            <div className="flex items-center gap-4">
              {/* Menu Button - Works on all screen sizes */}
              <button
                onClick={toggleSidebar}
                className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <FaBars className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <FaGraduationCap className="text-white text-lg" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Excellence Institute</p>
                </div>
              </div>
            </div>

            {/* Right Section: User Info + Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-700">
                <FaUserCircle className="text-xl text-gray-400" />
                <span className="text-sm font-medium">Administrator</span>
              </div>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Sidebar - Works the same on all screen sizes */}
      <div
        className={`fixed inset-y-0 left-0 top-16 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 w-64 z-50`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-700 hover:text-gray-900 focus:outline-none p-2"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer - Logout (Mobile only) */}
          <div className="border-t border-gray-200 p-4 lg:hidden">
            <Button
              variant="danger"
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className="w-full justify-center"
              icon={<FaSignOutAlt />}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile only */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
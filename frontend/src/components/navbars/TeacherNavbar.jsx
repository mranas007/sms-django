import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";


export default function TeacherNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuthContext();
  const handleLogout = () => {
    logout()
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/teacher/dashboard")}
          >
            <h1 className="text-2xl font-bold text-indigo-600">TeacherPanel</h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/teacher/classes")}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Classes
            </button>
            <button
              onClick={() => navigate("/teacher/students")}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Students
            </button>
            <button
              onClick={() => navigate("/teacher/assignments")}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Assignments
            </button>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Teacher</span>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 text-2xl font-bold focus:outline-none"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <button
              onClick={() => {
                navigate("/teacher/dashboard");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-800 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/teacher/classes");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-800 font-medium"
            >
              Classes
            </button>
            <button
              onClick={() => {
                navigate("/teacher/students");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-800 font-medium"
            >
              Students
            </button>
            <button
              onClick={() => {
                navigate("/teacher/assignments");
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-800 font-medium"
            >
              Assignments
            </button>
            <hr className="border-gray-300" />
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left text-red-600 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from'react-router-dom';
import {FaUserPlus, FaUsers, FaChalkboardTeacher,FaGraduationCap, FaUserGraduate, FaBook, FaPlus } from 'react-icons/fa';
import Api from '../../services/Api.jsx';
import AdminNavbar from '../../components/AdminNavbar'; // Import the new AdminNavbar


const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4`}>
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AddClassModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', academic_year: '', schedule: '' });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to create class
    console.log(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="className"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">Academic Year (e.g., 2024-2025)</label>
            <input
              type="text"
              id="academicYear"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule (e.g., Mon/Wed 10:00-11:00)</label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {/* Add multi-select for subjects, teachers, students here */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddSubjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', code: '' });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to create subject
    console.log(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="subjectName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              id="subjectCode"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [stats, setStats] = useState({});

  useEffect( () => {
    async function fetchData() {
      try {
        const res = await Api.get('/admin/dashboard-stats/')
        // console.log(res.data);
        setStats(res.data);
        
      } catch (error) {
        console.log(error.message);
        
      }
    }
    fetchData()
  }, []);

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
            </div>
            <FaUsers className="text-indigo-400 text-5xl" />
          </div>

          {/* Card 2: Total Students */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Student</h2>
              <p className="text-3xl font-bold text-green-600">{stats.totalStudents}</p>
            </div>
            <FaUsers className="text-green-400 text-5xl" />
          </div>

          {/* Card 2: Total Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Classes</h2>
              <p className="text-3xl font-bold text-green-600">{stats.totalClasses}</p>
            </div>
            <FaGraduationCap className="text-green-400 text-5xl" />
          </div>

          {/* Card 3: Total Subjects */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Subjects</h2>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalSubjects}</p>
            </div>
            <FaBook className="text-yellow-400 text-5xl" />
          </div>

          {/* Card 4: Total Teachers */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Teachers</h2>
              <p className="text-3xl font-bold text-red-600">{stats.totalTeachers}</p>
            </div>
            <FaChalkboardTeacher className="text-red-400 text-5xl" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New Class
            </button>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New Subject
            </button>
            <Link to="/admin/user/add"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New User
            </Link>
          </div>
        </div>

        {/* Recent Activities / Notifications (Placeholder) */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Activities</h2>
        <div className="flex item-center justify-center gap-2">
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          
            <ul>
              {stats.recentActivities && stats.recentActivities.map((activity) => (
                <li key={activity.id} className="border-b border-gray-200 py-2">
                  {activity.message}
                </li>
              ))}
            </ul>

          </div>
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <ul>
              {stats.recentUsers && stats.recentUsers.map((user) => (
                <li key={user.id} className="border-b border-gray-200 py-2">
                  User {user.username} ({user.email || '-'}) added on {new Date(user.date_joined).toLocaleDateString()}.
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AddClassModal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} />
        <AddSubjectModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} />
      </div>
  );
}

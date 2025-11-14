// REACT IMPORTS
import React, { useState, useEffect } from 'react';
import { Link } from'react-router-dom';

// ICONS
import {FaUsers, FaChalkboardTeacher,FaGraduationCap, FaBook, FaPlus } from 'react-icons/fa';

// UTILS
import Api from '../../services/Api.jsx';

// CONSTANTS
import { STUDENT, TEACHER } from '../../constant/RoleConstant.js';


const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4`}>
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);


export default function AdminDashboard() {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [stats, setStats] = useState({});

  // Fetching the data from the API
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
      <div className="container mx-auto p-8 pt-20">

        {/* Quick Actions */}
        <div className="mb-8">  
          {/* <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={"/admin/add/class"}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New Class
            </Link>
            <Link
              to={'/admin/add/subject'}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New Subject
            </Link>
            <Link to="/admin/user/add"
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FaPlus className="-ml-1 mr-3 h-5 w-5" /> Add New User
            </Link>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Users */}
          <Link to={'/admin/users'} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
              <p className="text-3xl font-bold text-indigo-600">{stats.total_users}</p>
            </div>
            <FaUsers className="text-indigo-400 text-5xl" />
          </Link>

          {/* Card 2: Total Students */}
          <Link to={`/admin/users/?role=${STUDENT}`}  className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Student</h2>
              <p className="text-3xl font-bold text-green-600">{stats.total_students}</p>
            </div>
            <FaUsers className="text-green-400 text-5xl" />
          </Link>

          {/* Card 3: Total Teachers */}
          <Link to={`/admin/users/?role=${TEACHER}`}  className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Teachers</h2>
              <p className="text-3xl font-bold text-red-600">{stats.total_teachers}</p>
            </div>
            <FaChalkboardTeacher className="text-red-400 text-5xl" />
          </Link>

          {/* Card 4: Total Classes */}
          <Link to={`/admin/classes`} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Classes</h2>
              <p className="text-3xl font-bold text-green-600">{stats.total_classes}</p>
            </div>
            <FaGraduationCap className="text-green-400 text-5xl" />
          </Link>

          {/* Card 5: Total Subjects */}
          <Link to={'/admin/subjects'} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Subjects</h2>
              <p className="text-3xl font-bold text-yellow-600">{stats.total_subjects}</p>
            </div>
            <FaBook className="text-yellow-400 text-5xl" />
          </Link>

          
        </div>

        

         {/* Recent Activities Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>

            <Link
              to="/admin/activities"
              className="p-3 rounded bg-indigo-600 hover:bg-indigo-700 transition-all text-white"
            >
              See All Activities
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Activity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Timestamp
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent_activities?.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                        {activity.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
  );
}

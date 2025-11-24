// REACT IMPORTS
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ICONS
import { FaUsers, FaChalkboardTeacher, FaGraduationCap, FaBook, FaPlus, FaClock } from 'react-icons/fa';

// COMPONENTS
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import CircleLoader from '../../components/CircleLoader.jsx';

// UTILS
import Api from '../../services/Api.jsx';

// CONSTANTS
import { STUDENT, TEACHER } from '../../constant/RoleConstant.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await Api.get('/admin/dashboard-stats/');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users || 0,
      icon: FaUsers,
      color: 'indigo',
      link: '/admin/users'
    },
    {
      title: 'Students',
      value: stats.total_students || 0,
      icon: FaGraduationCap,
      color: 'blue',
      link: `/admin/users/?role=${STUDENT}`
    },
    {
      title: 'Teachers',
      value: stats.total_teachers || 0,
      icon: FaChalkboardTeacher,
      color: 'purple',
      link: `/admin/users/?role=${TEACHER}`
    },
    {
      title: 'Classes',
      value: stats.total_classes || 0,
      icon: FaGraduationCap,
      color: 'green',
      link: '/admin/classes'
    },
    {
      title: 'Subjects',
      value: stats.total_subjects || 0,
      icon: FaBook,
      color: 'yellow',
      link: '/admin/subjects'
    }
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to Excellence Institute Admin Panel</p>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/add/class">
              <Button
                variant="primary"
                icon={<FaPlus />}
                className="w-full justify-center"
              >
                Add New Class
              </Button>
            </Link>
            <Link to="/admin/add/subject">
              <Button
                variant="primary"
                icon={<FaPlus />}
                className="w-full justify-center bg-green-600 hover:bg-green-700"
              >
                Add New Subject
              </Button>
            </Link>
            <Link to="/admin/user/add">
              <Button
                variant="primary"
                icon={<FaPlus />}
                className="w-full justify-center bg-yellow-600 hover:bg-yellow-700"
              >
                Add New User
              </Button>
            </Link>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`text-${stat.color}-600 text-2xl`} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activities */}
        <Card
          title="Recent Activities"
          action={
            <Link to="/admin/activities">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {stats.recent_activities && stats.recent_activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent_activities.slice(0, 5).map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {activity.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400 text-xs" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activities to display
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

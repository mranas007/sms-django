// REACT HOOKS
import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaEdit, FaUserPlus, FaUserSlash, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// SERVICES & UTILS
import Api from '../../../services/Api';
import { useSearchParams } from 'react-router-dom';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Badge from '../../../components/common/Badge.jsx';
import Table from '../../../components/common/Table.jsx';
import CircleLoader from '../../../components/CircleLoader';
import FailedCom from '../../../components/FailedCom';
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  const getUsers = useCallback(async (page = 1, search = '', roleParam = '') => {
    try {
      setLoading(true);
      setError(null);
      const roleQuery = roleParam ? `&role=${roleParam}` : '';
      const res = await Api.get(`admin/users/?page=${page}&search=${search}${roleQuery}`);
      setUsers(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error(error.message);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      getUsers(1, searchQuery, role || roleFilter);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, roleFilter, getUsers, role]);

  const isDeleteSuccess = (success) => {
    if (success) {
      getUsers(currentPage, searchQuery, roleFilter);
    }
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const deactivateAction = async (userId, action) => {
    try {
      await Api.put(`admin/user/${userId}/`, { is_active: action });
      getUsers(currentPage, searchQuery, roleFilter);
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    }
  };

  if (loading && !users.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <FailedCom message={error} onRetry={() => getUsers(currentPage, searchQuery, roleFilter)} />
      </div>
    );
  }

  const columns = [
    {
      header: 'Username',
      key: 'username',
      render: (user) => (
        <div className="font-medium text-gray-900">{user.username}</div>
      )
    },
    {
      header: 'Full Name',
      key: 'full_name',
      render: (user) => (
        <div className="font-medium text-gray-900">{user.full_name}</div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      render: (user) => (
        <div className="text-gray-600">{user.email || '—'}</div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (user) => (
        <Badge
          variant={
            user.role === 'Student' ? 'info' :
              user.role === 'Teacher' ? 'primary' :
                'default'
          }
        >
          {user.role || '—'}
        </Badge>
      )
    },
    {
      header: 'Joined',
      key: 'date_joined',
      render: (user) => (
        <div className="text-sm text-gray-600">
          {new Date(user.date_joined).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (user) => (
        <Badge variant={user.is_active ? 'success' : 'danger'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (user) => (
        <div className="flex items-center justify-center gap-2">
          <Link
            to={`/admin/user/${user.id}`}
            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-indigo-100 transition-colors"
            aria-label="View user details"
          >
            <FaInfoCircle className="w-4 h-4 text-indigo-600" />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Info
            </span>
          </Link>

          <Link
            to={`/admin/users/${user.id}/update`}
            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-blue-100 transition-colors"
            aria-label="Edit user"
          >
            <FaEdit className="w-4 h-4 text-blue-600" />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Edit
            </span>
          </Link>

          <button
            onClick={() => deactivateAction(user.id, !user.is_active)}
            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-yellow-100 transition-colors"
            aria-label={user.is_active ? 'Deactivate user' : 'Activate user'}
          >
            {user.is_active ? (
              <FaUserSlash className="w-4 h-4 text-yellow-600" />
            ) : (
              <FaUserPlus className="w-4 h-4 text-green-600" />
            )}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {user.is_active ? 'Deactivate' : 'Activate'}
            </span>
          </button>

          <DeleteConfirmation
            deleteUrl={`/admin/user/${user.id}/`}
            onDeleteSuccess={isDeleteSuccess}
            itemName={user.full_name}
            triggerType="icon"
          />
        </div>
      )
    }
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all users, students, and teachers</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 sm:max-w-xs">
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Role
                </label>
                <select
                  id="role-filter"
                  onChange={handleRoleFilter}
                  value={roleFilter}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Users</option>
                  <option value="Student">Students</option>
                  <option value="Teacher">Teachers</option>
                </select>
              </div>

              <div className="flex-1 sm:max-w-md">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <Link to="/admin/user/add">
              <Button variant="primary" icon={<FaUserPlus />}>
                Add User
              </Button>
            </Link>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          {loading ? (
            <div className="py-12">
              <CircleLoader fullScreen={false} />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={users}
                emptyMessage="No users found"
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => getUsers(currentPage - 1, searchQuery, roleFilter)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => getUsers(currentPage + 1, searchQuery, roleFilter)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
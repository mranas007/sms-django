// REACT HOOKS
import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaUserSlash } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import Api from '../../services/Api';
import CircleLoader from '../../components/CircleLoader';
import FailedCom from '../../components/FailedCom';
import { useParams, useSearchParams } from 'react-router-dom';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">Confirm</button>
      </div>
    </div>
  </div>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });
  
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');


  const getUsers = useCallback(async (page = 1, search = '', roleParam = '') => {
    try {
      setLoading(true);
      setError(null);
      const roleQuery = roleParam ? `&role=${roleParam}` : '';
      const res = await Api.get(`admin/users/?page=${page}&search=${search}${roleQuery}`);
      // console.log(res.data.results);
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
      getUsers(1, searchQuery, role);
    }, 300); // Debounce search
    return () => clearTimeout(handler);
  }, [searchQuery, getUsers, role]);

  // DELETE ACTION
  const deleteAction = async (userId, action) => {
    const performAction = async () => {
      try {
        await Api.delete(`admin/user/${userId}/`);
        alert(`User ${action} successful`);
        getUsers(currentPage, searchQuery);
      } catch (err) {
        console.error(err);
        alert('Action failed.');
      }
      closeModal();
    };

    if (action === 'delete') {
      setModal({
        isOpen: true,
        message: 'Are you sure you want to delete this user?',
        onConfirm: performAction,
      });
    } else {
      performAction();
    }
  };

  const closeModal = () => setModal({ isOpen: false, message: '', onConfirm: null });

  if (loading && !users.length) return <div className="h-screen w-full"><CircleLoader fullScreen={false}/></div>;
  if (error) return <FailedCom message={error} onRetry={() => getUsers(currentPage, searchQuery)} />;

  return (
    <>
      {modal.isOpen && <ConfirmationModal message={modal.message} onConfirm={modal.onConfirm} onCancel={closeModal} />}
      <div className="min-h-screen bg-gray-100 p-8 sm:p-6" style={{ margin: '50px 0' }}>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
            <div className="relative mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading && <div className="h-screen w-full"><CircleLoader fullScreen={false}/></div>}
          {!loading && users.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.role || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(user.date_joined).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Info */}
                          <button
                            onClick={() => window.open(`/admin/user/${user.id}`, '_blank')}
                            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="View user details">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Info
                            </span>
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            onClick={() => handleAction(user.id, user.is_active ? 'deactivate' : 'activate')}
                            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label={user.is_active ? 'Deactivate user' : 'Activate user'}>
                            {user.is_active
                              ? <FaUserSlash className="w-4 h-4 text-yellow-600" />
                              : <FaUserPlus className="w-4 h-4 text-green-600" />}
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </span>
                          </button>

                          {/* Edit */}
                          <Link to={`/admin/users/${user.id}/update`}
                            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="Edit user" >
                            <FaEdit className="w-4 h-4 text-blue-600" />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Edit
                            </span>
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => deleteAction(user.id)}
                            className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 hover:ring-2 hover:ring-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-label="Delete user" >
                            <FaTrash className="w-4 h-4 text-red-600" />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => getUsers(currentPage - 1, searchQuery)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50">Previous</button>
              <button onClick={() => getUsers(currentPage + 1, searchQuery)} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../../../services/Api.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import { Link } from 'react-router-dom';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await Api.get(`/admin/user/${id}/`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details.');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return <CircleLoader />;
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  if (!user) {
    return <ErrorMsg message="User not found." />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-medium">Username:</p>
            <p className="text-gray-900 text-lg">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Email:</p>
            <p className="text-gray-900 text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Role:</p>
            <p className="text-gray-900 text-lg">{user.role}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">First Name:</p>
            <p className="text-gray-900 text-lg">{user.first_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Last Name:</p>
            <p className="text-gray-900 text-lg">{user.last_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Date Joined:</p>
            <p className="text-gray-900 text-lg">{new Date(user.date_joined).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Last Login:</p>
            <p className="text-gray-900 text-lg">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Link
           to="/admin/users" 
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

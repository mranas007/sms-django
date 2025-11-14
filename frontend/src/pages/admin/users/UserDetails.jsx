import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../../../services/Api.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaSignInAlt, FaIdCard } from 'react-icons/fa';

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
        // console.log(response.data);
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircleLoader />
      </div>
    );
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  if (!user) {
    return <ErrorMsg message="User not found." />;
  }

  const renderDetailItem = (icon, label, value) => (
    <div className="flex items-center space-x-3">
      <div className="text-indigo-500 text-xl">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-900 text-base break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        {/* Left Section - Profile Picture and Basic Info */}
        <div className="md:w-1/3 bg-indigo-600 text-white p-8 flex flex-col items-center justify-center">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center mb-4">
              <FaUser className="text-6xl text-gray-600" />
            </div>
          )}
          <h2 className="text-3xl font-bold mb-1 text-center">{user.full_name || user.username}</h2>
          <p className="text-indigo-200 text-center">{user.role}</p>
          {user.is_active ? (
            <span className="mt-3 inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Active</span>
          ) : (
            <span className="mt-3 inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Inactive</span>
          )}
        </div>

        {/* Right Section - Detailed Information */}
        <div className="md:w-2/3 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">User Details</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {renderDetailItem(<FaIdCard />, 'Username', user.username)}
            {renderDetailItem(<FaEnvelope />, 'Email', user.email)}
            {renderDetailItem(<FaPhone />, 'Phone Number', user.phone_number)}
            {renderDetailItem(<FaBirthdayCake />, 'Birth Date', user.birth_date)}
            {renderDetailItem(<FaMapMarkerAlt />, 'Address', user.address)}
            {renderDetailItem(<FaCalendarAlt />, 'Date Joined', new Date(user.date_joined).toLocaleDateString())}
            {renderDetailItem(<FaSignInAlt />, 'Last Login', user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A')}
          </div>

          {user.bio && (
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Link
              to="/admin/users"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

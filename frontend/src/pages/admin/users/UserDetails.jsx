import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaSignInAlt,
  FaIdCard,
  FaEdit
} from 'react-icons/fa';

// COMPONENTS
import Api from '../../../services/Api.jsx';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Badge from '../../../components/common/Badge.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';

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
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 lg:p-8">
        <ErrorMsg message={error || 'User not found.'} />
      </div>
    );
  }

  const detailItems = [
    { icon: FaIdCard, label: 'Username', value: user.username },
    { icon: FaEnvelope, label: 'Email', value: user.email },
    { icon: FaPhone, label: 'Phone Number', value: user.phone_number },
    { icon: FaBirthdayCake, label: 'Birth Date', value: user.birth_date },
    { icon: FaMapMarkerAlt, label: 'Address', value: user.address },
    { icon: FaCalendarAlt, label: 'Date Joined', value: new Date(user.date_joined).toLocaleDateString() },
    { icon: FaSignInAlt, label: 'Last Login', value: user.last_login ? new Date(user.last_login).toLocaleDateString() : null }
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Details</h1>
            <p className="text-gray-600">View user information and profile</p>
          </div>
          <Link to="/admin/users">
            <Button variant="secondary">
              Back to Users
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-indigo-100 mb-4 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center mb-4">
                  <FaUser className="text-5xl text-gray-400" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.full_name || user.username}
              </h2>
              <p className="text-gray-600 mb-3">{user.role}</p>

              <Badge variant={user.is_active ? 'success' : 'danger'} className="mb-4">
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>

              <Link to={`/admin/users/${user.id}/update`} className="w-full">
                <Button variant="primary" className="w-full" icon={<FaEdit />}>
                  Edit User
                </Button>
              </Link>
            </div>
          </Card>

          {/* Details Card */}
          <Card title="User Information" className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {detailItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <item.icon className="text-indigo-600 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                    <p className="text-base text-gray-900 break-words">
                      {item.value || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

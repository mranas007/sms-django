import React, { useState, useEffect } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import { useNavigate, useParams, Link } from 'react-router-dom';

// SERVICES & UTILS
import Api from '../../../services/Api.jsx';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import InputField from '../../../components/common/InputField.jsx';
import CircleLoader from '../../../components/CircleLoader';
import ErrorMsg from '../../../components/ErrorMsg';

export default function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone_number: '',
    address: '',
    bio: '',
    birth_date: '',
    role: '',
    email: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await Api.get(`/admin/user/${id}/`);
        setFormData({
          username: response.data.username || '',
          full_name: response.data.full_name || '',
          phone_number: response.data.phone_number || '',
          address: response.data.address || '',
          bio: response.data.bio || '',
          birth_date: response.data.birth_date || '',
          role: response.data.role || '',
          email: response.data.email || '',
          is_active: response.data.is_active,
        });
      } catch (err) {
        setError('Failed to fetch user details.');
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await Api.put(`/admin/user/${id}/`, formData);
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/users'), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user.';
      setError(msg);
      console.error('Update user error:', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
     
        <div className="w-full h-screen flex items-center justify-center">
          <CircleLoader fullScreen={false}/>
        </div>
    );
  }

  if (error && !formData.username) {
    return (
      <div className="p-6 lg:p-8">
        <ErrorMsg message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update User</h1>
            <p className="text-gray-600">Edit user information and settings</p>
          </div>
          <Link to="/admin/users">
            <Button variant="secondary">
              Back to Users
            </Button>
          </Link>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Success/Error Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <strong className="font-semibold">Error: </strong>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <strong className="font-semibold">Success! </strong>
                <span>User updated successfully! Redirecting...</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField
                label="Username"
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <InputField
                label="Full Name"
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Phone Number"
                id="phone_number"
                name="phone_number"
                type="text"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />

              <InputField
                label="Address"
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <InputField
                label="Birth Date"
                id="birth_date"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                required
              />

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              <div>
                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <div className="mt-1 flex items-center h-[42px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-3 text-sm text-gray-700">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional bio or description"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={<FaUserEdit />}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

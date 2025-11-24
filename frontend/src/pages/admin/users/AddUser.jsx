import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// SERVICES & UTILS
import Api from '../../../services/Api';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import InputField from '../../../components/common/InputField.jsx';

export default function AddUser() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: '',
      full_name: '',
      phone_number: '',
      address: '',
      bio: '',
      birth_date: '',
      role: 'Student',
      password: '',
      cpassword: '',
      profile_picture: null,
      email: '',
    }
  });

  const password = watch('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(false);

    if (data.password !== data.cpassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post(
        '/admin/users/',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        reset();
        setTimeout(() => navigate('/admin/users'), 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add user.';
      setError(msg);
      console.error('Add user error:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New User</h1>
            <p className="text-gray-600">Create a new student or teacher account</p>
          </div>
          <Link to="/admin/users">
            <Button variant="secondary">
              Back to Users
            </Button>
          </Link>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <span>User added successfully! Redirecting...</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField
                label="Username"
                id="username"
                type="text"
                register={register('username', { required: 'Username is required' })}
                error={errors.username?.message}
                required
              />

              <InputField
                label="Full Name"
                id="full_name"
                type="text"
                register={register('full_name', { required: 'Full Name is required' })}
                error={errors.full_name?.message}
                required
              />

              <InputField
                label="Email"
                id="email"
                type="email"
                register={register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
                required
              />

              <InputField
                label="Phone Number"
                id="phone_number"
                type="text"
                register={register('phone_number', { required: 'Phone Number is required' })}
                error={errors.phone_number?.message}
                required
              />

              <InputField
                label="Address"
                id="address"
                type="text"
                register={register('address', { required: 'Address is required' })}
                error={errors.address?.message}
                required
              />

              <InputField
                label="Birth Date"
                id="birth_date"
                type="date"
                register={register('birth_date', { required: 'Birth Date is required' })}
                error={errors.birth_date?.message}
                required
              />

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
              </div>

              <InputField
                label="Password"
                id="password"
                type="password"
                register={register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                error={errors.password?.message}
                required
              />

              <InputField
                label="Confirm Password"
                id="cpassword"
                type="password"
                register={register('cpassword', {
                  required: 'Confirm Password is required',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={errors.cpassword?.message}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional bio or description"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                id="profile_picture"
                {...register('profile_picture')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Link to="/admin/users">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                icon={<FaUserPlus />}
                disabled={loading}
              >
                {loading ? 'Adding User...' : 'Add User'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

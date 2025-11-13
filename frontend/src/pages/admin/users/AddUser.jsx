import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Api from '../../../services/Api';
import BackBtn from '../../../components/BackBtn'; // Import the new BackBtn component

import { Link } from 'react-router-dom'


export default function AddUser() {

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
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
        // console.log('User added successfully:', response.data);
        reset(); // Reset form fields after successful submission
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
    <div className="container mx-auto p-4">
      <BackBtn />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl border-b border-gray-400 font-bold mb-6 text-gray-800">Add New User</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> User added successfully!</span>
        </div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="full_name"
              {...register('full_name', { required: 'Full Name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required', pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message || 'Invalid email address'}</p>}
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              {...register('phone_number', { required: 'Phone Number is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              {...register('address', { required: 'Address is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              id="birth_date"
              {...register('birth_date', { required: 'Birth Date is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.birth_date && <p className="text-red-500 text-xs mt-1">{errors.birth_date.message}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              {...register('role', { required: 'Role is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              {...register('cpassword', {
                required: 'Confirm Password is required',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.cpassword && <p className="text-red-500 text-xs mt-1">{errors.cpassword.message}</p>}
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            {...register('bio')}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            {...register('profile_picture')}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div className="flex justify-end">
          <BackBtn /> {/* Use the new BackBtn component */}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            <FaUserPlus className="-ml-1 mr-2 h-5 w-5" />
            {loading ? 'Adding User...' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
}

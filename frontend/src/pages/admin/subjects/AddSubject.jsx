import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../../services/Api.jsx';
import BackBtn from '../../../components/BackBtn';
import { useForm } from 'react-hook-form';

export default function AddSubject() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { name: '', code: '' }
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await Api.post('/admin/subjects/', data);
      setSuccessMessage('Subject added successfully!');
      reset(); // Reset form fields after successful submission
      setTimeout(() => {
        navigate('/admin/subjects');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to add subject.');
      console.error('Error adding subject:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Subject</h2>
          <BackBtn />
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="subjectName"
              {...register('name', { required: 'Subject name is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              id="subjectCode"
              {...register('code', { required: 'Subject code is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              className="inline-flex justify-center px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

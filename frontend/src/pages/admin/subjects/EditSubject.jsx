import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

// SERVICES & UTILS
import apiClient from '../../../services/Api.jsx';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import InputField from '../../../components/common/InputField.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';

export default function EditSubject() {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/admin/subject/${id}/`);
        reset({
          name: response.data.name,
          code: response.data.code
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load subject data.');
        console.error('Error fetching subject:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSuccess('');
    setError('');
    setSubmitting(true);
    try {
      await apiClient.put(`/admin/subject/${id}/`, data);
      setSuccess('Subject updated successfully!');
      setTimeout(() => {
        navigate('/admin/subjects');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subject.');
      console.error('Error updating subject:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Subject</h1>
            <p className="text-gray-600">Update subject information</p>
          </div>
          <Link to="/admin/subjects">
            <Button variant="secondary">Back to Subjects</Button>
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
                <span>{success} Redirecting...</span>
              </div>
            )}

            <div className="space-y-6">
              <InputField
                label="Subject Name"
                id="subjectName"
                type="text"
                register={register('name', { required: 'Subject name is required' })}
                error={errors.name?.message}
                placeholder="e.g., Mathematics"
                required
              />

              <InputField
                label="Subject Code"
                id="subjectCode"
                type="text"
                register={register('code', { required: 'Subject code is required' })}
                error={errors.code?.message}
                placeholder="e.g., MATH101"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Link to="/admin/subjects">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                icon={<FaEdit />}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Subject'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaBook, FaCalendarAlt, FaClock, FaFileAlt, FaSave, FaCheckCircle, FaDownload } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export default function StudentSubmittedAssignmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch submission details
    async function fetchSubmission() {
        try {
            setLoading(true);
            const res = await apiClient.get(`teacher/assignments/submissions/${id}/`);
            setSubmission(res.data);
            // Pre-populate form if already graded
            if (res.data.grade) {
                setValue('grade', res.data.grade);
            }
            if (res.data.feedback) {
                setValue('feedback', res.data.feedback);
            }
        } catch (err) {
            console.error('Error fetching submission:', err);
            setError(err.response?.data?.message || 'Failed to load submission details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Handle grading submission
    const onSubmit = async (data) => {
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        try {
            const response = await apiClient.put(`/teacher/assignments/submissions/${id}/`, {
                grade: data.grade,
                feedback: data.feedback
            });

            if (response.status === 200) {
                setSuccess(true);
                setSubmission(response.data);
                setTimeout(() => {
                    navigate('/teacher/assignment-submissions');
                }, 2000);
            }
        } catch (err) {
            console.error('Grading error:', err);

            // Extract error message
            let msg = 'Failed to save grade and feedback.';
            if (err.response?.data) {
                const errorData = err.response.data;
                if (Array.isArray(errorData) && errorData.length > 0) {
                    msg = errorData[0];
                } else if (errorData.message) {
                    msg = errorData.message;
                } else if (typeof errorData === 'object') {
                    const firstError = Object.values(errorData)[0];
                    if (Array.isArray(firstError)) {
                        msg = firstError[0];
                    } else if (typeof firstError === 'string') {
                        msg = firstError;
                    }
                } else if (typeof errorData === 'string') {
                    msg = errorData;
                }
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
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

    if (error && !submission) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-5xl mx-auto space-y-4">
                    <BackBtn />
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-5xl mx-auto space-y-4">
                    <BackBtn />
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                        <p className="text-sm text-yellow-700">Submission not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <BackBtn />

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                        {submission.grade !== null ? (
                            <FaCheckCircle className="text-green-600 text-2xl" />
                        ) : (
                            <FaFileAlt className="text-indigo-600 text-2xl" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Assignment Submission</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={submission.grade !== null ? 'success' : 'warning'}>
                                {submission.grade !== null ? `Graded: ${submission.grade}` : 'Pending Review'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Student & Assignment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Info Card */}
                    <Card title="Student Information" icon={<FaUser className="text-indigo-600" />}>
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-100 text-indigo-700 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                                {getInitials(submission.student?.full_name)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{submission.student?.full_name}</h3>
                                <p className="text-sm text-gray-500">@{submission.student?.username}</p>
                                <div className="mt-3 space-y-1">
                                    {submission.student?.email && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Email:</span> {submission.student.email}
                                        </p>
                                    )}
                                    {submission.student?.phone_number && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Phone:</span> {submission.student.phone_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Assignment Info Card */}
                    <Card title="Assignment Details" icon={<FaBook className="text-purple-600" />}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Title</p>
                                <p className="font-semibold text-gray-900">{submission.assignment?.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-500" />
                                    {formatDate(submission.assignment?.due_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Submitted</p>
                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                    <FaClock className="text-green-500" />
                                    {formatDate(submission.submitted_at)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Assignment Description */}
                <Card title="Assignment Description">
                    <p className="text-gray-700 whitespace-pre-wrap">{submission.assignment?.description}</p>
                </Card>

                {/* Student Submission Content */}
                <Card title="Student's Submission">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-800 whitespace-pre-wrap">{submission.content || 'No content provided'}</p>
                    </div>

                    {/* File Upload (if exists) */}
                    {submission.file_upload && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaFileAlt className="text-blue-600 text-2xl" />
                                    <div>
                                        <p className="font-medium text-gray-900">Attached File</p>
                                        <p className="text-sm text-gray-500">Click to download</p>
                                    </div>
                                </div>
                                <a
                                    href={submission.file_upload}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                                    <FaDownload />
                                    Download
                                </a>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Grading Form */}
                <Card title="Grade & Feedback">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Success Alert */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FaCheckCircle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">Grade and feedback saved successfully! Redirecting...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Grade Input */}
                            <div>
                                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade (0-100)
                                </label>
                                <input
                                    type="number"
                                    id="grade"
                                    {...register('grade', {
                                        required: 'Grade is required',
                                        min: { value: 0, message: 'Grade must be at least 0' },
                                        max: { value: 100, message: 'Grade cannot exceed 100' }
                                    })}
                                    className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                    placeholder="Enter grade (0-100)"
                                    step="0.01"
                                />
                                {errors.grade && (
                                    <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>
                                )}
                            </div>

                            {/* Current Status */}
                            <div className="flex items-center">
                                <div className={`w-full p-4 rounded-lg border-2 ${submission.grade !== null
                                    ? 'bg-green-50 border-green-500'
                                    : 'bg-orange-50 border-orange-500'
                                    }`}>
                                    <p className="text-sm font-medium text-gray-600">Current Status</p>
                                    <p className={`text-2xl font-bold ${submission.grade !== null ? 'text-green-700' : 'text-orange-700'
                                        }`}>
                                        {submission.grade !== null ? `Graded: ${submission.grade}` : 'Not Graded'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Textarea */}
                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback (Optional)
                            </label>
                            <textarea
                                id="feedback"
                                {...register('feedback')}
                                rows="6"
                                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                placeholder="Provide feedback to the student..."
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-2">
                                Share constructive feedback to help the student improve.
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/teacher/assignment-submissions')}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save Grade & Feedback'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

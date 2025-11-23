import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaUser, FaBook, FaCalendarAlt, FaClock, FaFileAlt, FaSave, FaCheckCircle, FaDownload } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';

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
            console.log(res.data)
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <CircleLoader />
            </div>
        );
    }

    if (error && !submission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-5xl mx-auto">
                    <BackBtn />
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-5xl mx-auto">
                    <BackBtn />
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mt-4">
                        Submission not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <BackBtn />

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
                    <div className={`p-6 text-white ${submission.grade !== null ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                                {submission.grade !== null ? (
                                    <FaCheckCircle className="text-4xl" />
                                ) : (
                                    <FaFileAlt className="text-4xl" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Assignment Submission</h1>
                                <p className="text-green-100 mt-1">
                                    {submission.grade !== null ? `Graded: ${submission.grade}` : 'Pending Review'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student & Assignment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Student Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUser className="text-indigo-600" />
                            Student Information
                        </h2>
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                                {getInitials(submission.student?.full_name)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">{submission.student?.full_name}</h3>
                                <p className="text-sm text-gray-600">@{submission.student?.username}</p>
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
                    </div>

                    {/* Assignment Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaBook className="text-purple-600" />
                            Assignment Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Title</p>
                                <p className="font-semibold text-gray-800">{submission.assignment?.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Date</p>
                                <p className="font-medium text-gray-700 flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-500" />
                                    {formatDate(submission.assignment?.due_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Submitted</p>
                                <p className="font-medium text-gray-700 flex items-center gap-2">
                                    <FaClock className="text-green-500" />
                                    {formatDate(submission.submitted_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignment Description */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{submission.assignment?.description}</p>
                </div>

                {/* Student Submission Content */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Student's Submission</h2>
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
                                        <p className="font-medium text-gray-800">Attached File</p>
                                        <p className="text-sm text-gray-600">Click to download</p>
                                    </div>
                                </div>
                                <a
                                    href={submission.file_upload}
                                    download
                                    target="_blank"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                    <FaDownload />
                                    Download
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grading Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Grade & Feedback</h2>

                    {/* Success Alert */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                            <FaCheckCircle className="text-2xl" />
                            <div>
                                <strong className="font-bold">Success! </strong>
                                <span className="block sm:inline">Grade and feedback saved successfully! Redirecting...</span>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Grade Input */}
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
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
                    <div className="mb-6">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback (Optional)
                        </label>
                        <textarea
                            id="feedback"
                            {...register('feedback')}
                            rows="6"
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="Provide feedback to the student..."
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">
                            Share constructive feedback to help the student improve.
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/teacher/assignment-submissions')}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            <FaSave />
                            {submitting ? 'Saving...' : 'Save Grade & Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

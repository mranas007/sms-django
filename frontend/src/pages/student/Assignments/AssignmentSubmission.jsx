import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaClipboardList, FaFileUpload, FaCalendarAlt, FaBook, FaUser, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';

export default function AssignmentSubmission() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch assignment details
    async function fetchAssignment() {
        try {
            setLoading(true);
            const res = await apiClient.get(`/student/assignments/${id}/`);
            setAssignment(res.data);
        } catch (err) {
            console.error('Error fetching assignment:', err);
            setError(err.response?.data?.message || 'Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    // Check if assignment is overdue
    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

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

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('assignment', id);
            formData.append('content', data.content);  // Changed from 'submission_text' to 'content'

            if (selectedFile) {
                formData.append('file_upload', selectedFile);  // Changed from 'file' to 'file_upload'
            }

            // Note: 'student' is automatically set by the backend from request.user
            const response = await apiClient.post('/student/submissions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // console.log(response);
            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/student/assignments');
                }, 2000);
            }
        } catch (err) {
            console.error('Submission error:', err);

            // Extract error message from different response formats
            let msg = 'Failed to submit assignment.';

            if (err.response?.data) {
                const errorData = err.response.data;

                // Check if it's an array (like ["You have already submitted this assignment."])
                if (Array.isArray(errorData) && errorData.length > 0) {
                    msg = errorData[0];
                }
                // Check if it's an object with a message property
                else if (errorData.message) {
                    msg = errorData.message;
                }
                // Check if it's an object with field-specific errors
                else if (typeof errorData === 'object') {
                    // Get the first error message from any field
                    const firstError = Object.values(errorData)[0];
                    if (Array.isArray(firstError)) {
                        msg = firstError[0];
                    } else if (typeof firstError === 'string') {
                        msg = firstError;
                    }
                }
                // If it's a string
                else if (typeof errorData === 'string') {
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

    if (error && !assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <BackBtn />
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <BackBtn />
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mt-4">
                        Assignment not found
                    </div>
                </div>
            </div>
        );
    }

    const overdueStatus = isOverdue(assignment.due_date);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <BackBtn />

                <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
                    {/* Header */}
                    <div className={`p-6 text-white ${overdueStatus ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                        <div className="flex items-center gap-3">
                            <div className="text-indigo-600 bg-white bg-opacity-20 p-3 rounded-lg">
                                <FaPaperPlane className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Submit Assignment</h1>
                                <p className="text-green-100 mt-1">{assignment.title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Info */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Subject */}
                            <div className="flex items-center gap-2">
                                <FaBook className="text-purple-500" />
                                <div>
                                    <p className="text-xs text-gray-600">Subject</p>
                                    <p className="font-semibold text-gray-800">{assignment.subject?.name || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Teacher */}
                            <div className="flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                <div>
                                    <p className="text-xs text-gray-600">Teacher</p>
                                    <p className="font-semibold text-gray-800">{assignment.teacher?.full_name || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className={overdueStatus ? 'text-red-500' : 'text-green-500'} />
                                <div>
                                    <p className="text-xs text-gray-600">Due Date</p>
                                    <p className={`font-semibold ${overdueStatus ? 'text-red-700' : 'text-gray-800'}`}>
                                        {formatDate(assignment.due_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overdue Warning */}
                    {overdueStatus && (
                        <div className="p-6 bg-red-50 border-b border-red-200">
                            <div className="flex items-center gap-3 text-red-700">
                                <FaClipboardList className="text-2xl" />
                                <div>
                                    <p className="font-bold">This assignment is overdue</p>
                                    <p className="text-sm">Submissions may not be accepted. Please contact your teacher.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submission Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Submission</h2>

                        {/* Success Alert */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                                <FaCheckCircle className="text-2xl" />
                                <div>
                                    <strong className="font-bold">Success! </strong>
                                    <span className="block sm:inline">Assignment submitted successfully! Redirecting...</span>
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

                        {/* Submission Text */}
                        <div className="mb-6">
                            <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FaClipboardList className="text-indigo-500" />
                                Submission Text / Answer
                            </label>
                            <textarea
                                id="content"
                                {...register('content', {
                                    required: 'Submission text is required',
                                    minLength: { value: 10, message: 'Submission must be at least 10 characters' }
                                })}
                                rows="10"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                                placeholder="Write your answer or submission details here..."
                            ></textarea>
                            {errors.content && (
                                <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Provide a detailed answer or explanation for your submission.
                            </p>
                        </div>

                        {/* File Upload */}
                        <div className="mb-6">
                            <label htmlFor="file" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FaFileUpload className="text-purple-500" />
                                Attach File (Optional)
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                            />
                            {selectedFile && (
                                <p className="text-sm text-green-600 mt-2">
                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Accepted formats: PDF, DOC, DOCX, TXT, ZIP, JPG, PNG (Max 10MB)
                            </p>
                        </div>

                        {/* Assignment Description Reference */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">Assignment Description:</h3>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{assignment.description}</p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/student/assignments')}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting || overdueStatus}
                            >
                                <FaPaperPlane />
                                {submitting ? 'Submitting...' : overdueStatus ? 'Submission Closed' : 'Submit Assignment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

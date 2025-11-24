import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaClipboardList, FaFileUpload, FaCalendarAlt, FaBook, FaUser, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

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
            formData.append('content', data.content);
            if (selectedFile) {
                formData.append('file_upload', selectedFile);
            }

            const response = await apiClient.post('/student/submissions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/student/assignments');
                }, 2000);
            }
        } catch (err) {
            console.error('Submission error:', err);
            let msg = 'Failed to submit assignment.';
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
                <CircleLoader fullScreen={false} />
            </div>
        );
    }

    if (error && !assignment) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <BackBtn />
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <BackBtn />
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                        <p className="text-sm text-yellow-700">Assignment not found</p>
                    </div>
                </div>
            </div>
        );
    }

    const overdueStatus = isOverdue(assignment.due_date);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackBtn />

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                        <FaPaperPlane className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Submit Assignment</h1>
                        <p className="text-gray-500">{assignment.title}</p>
                    </div>
                </div>

                {/* Assignment Info Card */}
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Subject */}
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FaBook className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Subject</p>
                                <p className="text-sm font-bold text-gray-900">{assignment.subject?.name || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Teacher */}
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FaUser className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Teacher</p>
                                <p className="text-sm font-bold text-gray-900">{assignment.teacher?.full_name || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-3">
                            <div className={`${overdueStatus ? 'bg-red-100' : 'bg-green-100'} p-2 rounded-lg`}>
                                <FaCalendarAlt className={overdueStatus ? 'text-red-600' : 'text-green-600'} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Due Date</p>
                                <p className={`text-sm font-bold ${overdueStatus ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatDate(assignment.due_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Overdue Warning */}
                {overdueStatus && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex items-center gap-3">
                            <FaExclamationTriangle className="text-red-500 text-xl" />
                            <div>
                                <p className="font-semibold text-red-800">This assignment is overdue</p>
                                <p className="text-sm text-red-600 mt-1">
                                    Submissions may not be accepted. Please contact your teacher.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submission Form */}
                <Card title="Your Submission">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Success Alert */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 text-xl" />
                                <div>
                                    <p className="font-semibold text-green-800">Success!</p>
                                    <p className="text-sm text-green-700">Assignment submitted successfully! Redirecting...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submission Text */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Submission Text / Answer
                            </label>
                            <textarea
                                id="content"
                                {...register('content', {
                                    required: 'Submission text is required',
                                    minLength: { value: 10, message: 'Submission must be at least 10 characters' }
                                })}
                                rows="8"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
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
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                                Attach File (Optional)
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaFileUpload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (MAX. 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                                    />
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                    <FaCheckCircle />
                                    <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                                </div>
                            )}
                        </div>

                        {/* Assignment Description Reference */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Assignment Description:</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{assignment.description}</p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/student/assignments')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                disabled={submitting || overdueStatus}
                                icon={<FaPaperPlane />}
                            >
                                {submitting ? 'Submitting...' : overdueStatus ? 'Submission Closed' : 'Submit Assignment'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

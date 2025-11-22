import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBook, FaUser, FaCalendarAlt, FaFileAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaUpload } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';

export default function AssignmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Check if assignment is due soon (within 3 days)
    const isDueSoon = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 3;
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

    // Get time remaining
    const getTimeRemaining = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        if (diffDays < 0) {
            return {
                text: `${Math.abs(diffDays)} days overdue`,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
            };
        }
        if (diffDays === 0) {
            if (diffHours > 0) {
                return {
                    text: `Due in ${diffHours} hours`,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200'
                };
            }
            return {
                text: 'Due today',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200'
            };
        }
        if (diffDays === 1) {
            return {
                text: 'Due tomorrow',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200'
            };
        }
        if (diffDays <= 3) {
            return {
                text: `${diffDays} days remaining`,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200'
            };
        }
        return {
            text: `${diffDays} days remaining`,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <CircleLoader />
            </div>
        );
    }

    if (error) {
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

    const timeRemaining = getTimeRemaining(assignment.due_date);
    const overdueStatus = isOverdue(assignment.due_date);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <BackBtn />

                <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
                    {/* Header */}
                    <div className={`p-6 text-white ${overdueStatus ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-indigo-600 bg-white bg-opacity-20 p-3 rounded-lg">
                                <FaClipboardList className="text-2xl" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold">{assignment.title}</h1>
                                <p className="text-indigo-100 mt-1">Assignment Details</p>
                            </div>
                        </div>

                        {/* Status Banner */}
                        <div className="text-indigo-600 bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {overdueStatus ? (
                                    <FaExclamationTriangle className="text-2xl" />
                                ) : (
                                    <FaClock className="text-2xl" />
                                )}
                                <div>
                                    <p className="text-sm opacity-90">Time Remaining</p>
                                    <p className="text-xl font-bold">{timeRemaining.text}</p>
                                </div>
                            </div>
                            {/* Future: Add submission status here */}
                            {/* <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-300" />
                                <span className="font-semibold">Submitted</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Subject */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500 p-3 rounded-lg">
                                        <FaBook className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-600 font-medium">Subject</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {assignment.subject?.name || 'N/A'}
                                        </p>
                                        {assignment.subject?.code && (
                                            <p className="text-xs text-purple-600 mt-1">
                                                Code: {assignment.subject.code}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Teacher */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500 p-3 rounded-lg">
                                        <FaUser className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Teacher</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {assignment.teacher?.full_name || 'N/A'}
                                        </p>
                                        {assignment.teacher?.email && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                {assignment.teacher.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Class */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 p-3 rounded-lg">
                                        <FaClipboardList className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Class</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {assignment.class_assigned?.name || 'N/A'}
                                        </p>
                                        {assignment.class_assigned?.academic_year && (
                                            <p className="text-xs text-green-600 mt-1">
                                                {assignment.class_assigned.academic_year}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className={`bg-gradient-to-br ${timeRemaining.bgColor} p-4 rounded-lg border ${timeRemaining.borderColor}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`${overdueStatus ? 'bg-red-500' : isDueSoon(assignment.due_date) ? 'bg-orange-500' : 'bg-blue-500'} p-3 rounded-lg`}>
                                        <FaCalendarAlt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${timeRemaining.color}`}>Due Date</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {formatDate(assignment.due_date)}
                                        </p>
                                        <p className={`text-xs mt-1 font-semibold ${timeRemaining.color}`}>
                                            {timeRemaining.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Description */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <FaFileAlt className="text-indigo-500 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Assignment Description</h2>
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {assignment.description}
                                </p>
                            </div>
                        </div>

                        {/* Assignment Info */}
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-2 text-sm text-indigo-600">
                                <FaClock />
                                <span>
                                    <span className="font-medium">Created on:</span>{' '}
                                    {formatDate(assignment.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            {/* Future: Add submission functionality */}
                            {/* <button
                                className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                disabled={overdueStatus}
                            >
                                <FaUpload />
                                {overdueStatus ? 'Submission Closed' : 'Submit Assignment'}
                            </button> */}

                            <button
                                onClick={() => navigate('/student/assignments')}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Back to Assignments
                            </button>
                        </div>

                        {/* Warning for overdue */}
                        {overdueStatus && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex items-center gap-3">
                                    <FaExclamationTriangle className="text-red-500 text-xl" />
                                    <div>
                                        <p className="font-semibold text-red-800">This assignment is overdue</p>
                                        <p className="text-sm text-red-600 mt-1">
                                            Please contact your teacher if you need an extension.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Warning for due soon */}
                        {!overdueStatus && isDueSoon(assignment.due_date) && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-orange-500 text-xl" />
                                    <div>
                                        <p className="font-semibold text-orange-800">This assignment is due soon!</p>
                                        <p className="text-sm text-orange-600 mt-1">
                                            Make sure to complete and submit your work before the deadline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

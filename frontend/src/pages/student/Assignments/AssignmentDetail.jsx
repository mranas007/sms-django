import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBook, FaUser, FaCalendarAlt, FaFileAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaUpload } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

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
                variant: 'danger'
            };
        }
        if (diffDays === 0) {
            if (diffHours > 0) {
                return {
                    text: `Due in ${diffHours} hours`,
                    variant: 'warning'
                };
            }
            return {
                text: 'Due today',
                variant: 'warning'
            };
        }
        if (diffDays === 1) {
            return {
                text: 'Due tomorrow',
                variant: 'warning'
            };
        }
        if (diffDays <= 3) {
            return {
                text: `${diffDays} days remaining`,
                variant: 'warning'
            };
        }
        return {
            text: `${diffDays} days remaining`,
            variant: 'info'
        };
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <CircleLoader fullScreen={false} />
            </div>
        );
    }

    if (error) {
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

    const timeRemaining = getTimeRemaining(assignment.due_date);
    const overdueStatus = isOverdue(assignment.due_date);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackBtn />

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                        <FaClipboardList className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={timeRemaining.variant}>{timeRemaining.text}</Badge>
                            {overdueStatus && <Badge variant="danger">Overdue</Badge>}
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject */}
                    <Card className="border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FaBook className="text-purple-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Subject</p>
                                <p className="text-lg font-bold text-gray-900">{assignment.subject?.name || 'N/A'}</p>
                                {assignment.subject?.code && (
                                    <p className="text-xs text-purple-600">Code: {assignment.subject.code}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Teacher */}
                    <Card className="border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FaUser className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Teacher</p>
                                <p className="text-lg font-bold text-gray-900">{assignment.teacher?.full_name || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Class */}
                    <Card className="border-l-4 border-l-green-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <FaClipboardList className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Class</p>
                                <p className="text-lg font-bold text-gray-900">{assignment.class_assigned?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Due Date */}
                    <Card className={`border-l-4 ${overdueStatus ? 'border-l-red-500' : 'border-l-indigo-500'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`${overdueStatus ? 'bg-red-100' : 'bg-indigo-100'} p-2 rounded-lg`}>
                                <FaCalendarAlt className={`${overdueStatus ? 'text-red-600' : 'text-indigo-600'} text-xl`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Due Date</p>
                                <p className="text-lg font-bold text-gray-900">{formatDate(assignment.due_date)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Assignment Description */}
                <Card title="Assignment Description" icon={<FaFileAlt className="text-indigo-600" />}>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {assignment.description}
                        </p>
                    </div>
                </Card>

                {/* Warning for overdue */}
                {overdueStatus && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
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
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/student/assignments')}
                    >
                        Back to Assignments
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="text-center text-xs text-gray-400">
                    <span className="font-medium">Created on:</span>{' '}
                    {formatDate(assignment.created_at)}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaClipboardList, FaBook, FaUsers, FaCalendarAlt, FaFileAlt, FaEdit, FaClock } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';
import DeleteConfirmation from '../../../components/DeleteConfirmation';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export default function AssignmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchAssignment() {
        try {
            setLoading(true);
            const res = await apiClient.get(`/teacher/assignments/${id}/`);
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

    const handleDeleteSuccess = () => {
        navigate('/teacher/assignments');
    };

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

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
          <CircleLoader fullScreen={false}/>
        </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <BackBtn />
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
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">Assignment not found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackBtn />

                <Card>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <FaClipboardList className="text-indigo-600 text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="primary">Assignment</Badge>
                                    <span className="text-sm text-gray-500">Created on {new Date(assignment.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/teacher/assignment/edit/${assignment.id}`)}
                                className="flex items-center gap-2"
                            >
                                <FaEdit /> Edit
                            </Button>

                            <DeleteConfirmation
                                deleteUrl={`/teacher/assignments/${id}/`}
                                onDeleteSuccess={handleDeleteSuccess}
                                itemName={assignment.title}
                                triggerType="button"
                            />
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Class */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-green-100 p-2 rounded-md">
                                <FaUsers className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Assigned to Class</p>
                                <p className="text-base font-bold text-gray-900">
                                    {assignment.class_assigned?.name || 'N/A'}
                                </p>
                                {assignment.class_assigned?.academic_year && (
                                    <p className="text-xs text-gray-500">
                                        {assignment.class_assigned.academic_year}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-purple-100 p-2 rounded-md">
                                <FaBook className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Subject</p>
                                <p className="text-base font-bold text-gray-900">
                                    {assignment.subject?.name || 'N/A'}
                                </p>
                                {assignment.subject?.code && (
                                    <p className="text-xs text-gray-500">
                                        Code: {assignment.subject.code}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-blue-100 p-2 rounded-md">
                                <FaCalendarAlt className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Due Date</p>
                                <p className="text-base font-bold text-gray-900">
                                    {formatDate(assignment.due_date)}
                                </p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-orange-100 p-2 rounded-md">
                                <FaClock className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created On</p>
                                <p className="text-base font-bold text-gray-900">
                                    {formatDate(assignment.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FaFileAlt className="text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900">Description</h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {assignment.description}
                            </p>
                        </div>
                    </div>

                    {/* Teacher Info */}
                    {assignment.teacher?.full_name && (
                        <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                            <span>Created by <span className="font-medium text-gray-900">{assignment.teacher.full_name}</span></span>
                            {assignment.teacher.email && (
                                <span>{assignment.teacher.email}</span>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

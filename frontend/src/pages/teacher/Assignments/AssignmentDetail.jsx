import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaClipboardList, FaBook, FaUsers, FaCalendarAlt, FaFileAlt, FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import BackBtn from '../../../components/BackBtn';
import CircleLoader from '../../../components/CircleLoader';
import DeleteConfirmation from '../../../components/DeleteConfirmation';

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
            // console.log(res.data)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <BackBtn />

                <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg">
                                    <FaClipboardList className="text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">{assignment.title}</h1>
                                    <p className="text-indigo-100 mt-1">Assignment Details</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/teacher/assignment/edit/${assignment.id}`}
                                    className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition flex items-center gap-2">
                                    <FaEdit />
                                </Link>

                                <div className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center gap-2">
                                    <DeleteConfirmation
                                        deleteUrl={`/teacher/assignments/${id}/`}
                                        onDeleteSuccess={handleDeleteSuccess}
                                        itemName={assignment.title}
                                        triggerType="icon" // or "button" (default)
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Class */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 p-3 rounded-lg">
                                        <FaUsers className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Assigned to Class</p>
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

                            {/* Due Date */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500 p-3 rounded-lg">
                                        <FaCalendarAlt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Due Date</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {formatDate(assignment.due_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-500 p-3 rounded-lg">
                                        <FaClock className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-orange-600 font-medium">Created On</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {formatDate(assignment.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <FaFileAlt className="text-indigo-500 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Description</h2>
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {assignment.description}
                                </p>
                            </div>
                        </div>

                        {/* Teacher Info */}
                        {assignment.teacher?.full_name && (
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                <p className="text-sm text-indigo-600">
                                    <span className="font-medium">Created by:</span>{' '}
                                    <span className="font-bold">{assignment.teacher.full_name}</span>
                                </p>
                                {assignment.teacher.email && (
                                    <p className="text-xs text-indigo-500 mt-1">
                                        {assignment.teacher.email}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { FaBook, FaCalendarAlt, FaUser, FaClock, FaClipboardList, FaCheckCircle, FaExclamationCircle, FaFilter, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';

export default function Assignments() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, overdue, completed
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dueDate'); // dueDate, subject, createdDate

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/student/assignments/');
            // console.log(res.data)    
            setAssignments(res.data);
        } catch (error) {
            const msg = error.message || "Something went wrong!";
            setError(msg);
            console.error("Error fetching assignments:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

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

    // Get assignment status
    const getStatus = (assignment) => {
        // You can add a 'status' or 'completed' field from backend
        if (isOverdue(assignment.due_date)) return 'overdue';
        if (isDueSoon(assignment.due_date)) return 'due-soon';
        return 'pending';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time remaining
    const getTimeRemaining = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `${diffDays} days remaining`;
    };

    // Filter and sort assignments
    const filteredAssignments = assignments
        .filter(assignment => {
            // Filter by status
            if (filterStatus === 'overdue' && !isOverdue(assignment.due_date)) return false;
            if (filterStatus === 'pending' && isOverdue(assignment.due_date)) return false;
            // Add completed filter when backend supports it
            // if (filterStatus === 'completed' && !assignment.completed) return false;

            // Filter by search term
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    assignment.title?.toLowerCase().includes(search) ||
                    assignment.subject?.name?.toLowerCase().includes(search) ||
                    assignment.teacher?.full_name?.toLowerCase().includes(search)
                );
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'dueDate') {
                return new Date(a.due_date) - new Date(b.due_date);
            }
            if (sortBy === 'subject') {
                return (a.subject?.name || '').localeCompare(b.subject?.name || '');
            }
            if (sortBy === 'createdDate') {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

    // Calculate stats
    const totalAssignments = assignments.length;
    const overdueCount = assignments.filter(a => isOverdue(a.due_date)).length;
    const pendingCount = assignments.filter(a => !isOverdue(a.due_date)).length;
    const dueSoonCount = assignments.filter(a => isDueSoon(a.due_date)).length;

    if (loading) return <div className="h-screen w-full flex items-center justify-center"><CircleLoader /></div>;
    if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Assignments</h1>
                    <p className="text-gray-600">Track and manage your coursework assignments</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{totalAssignments}</p>
                            </div>
                            <div className="bg-indigo-100 p-4 rounded-lg">
                                <FaClipboardList className="text-indigo-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{pendingCount}</p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg">
                                <FaClock className="text-yellow-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Due Soon</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{dueSoonCount}</p>
                            </div>
                            <div className="bg-orange-100 p-4 rounded-lg">
                                <FaExclamationCircle className="text-orange-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Overdue</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{overdueCount}</p>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg">
                                <FaExclamationCircle className="text-red-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                        </div>

                        {/* Filter by Status */}
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white"
                            >
                                <option value="all">All Assignments</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                                {/* <option value="completed">Completed</option> */}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white"
                            >
                                <option value="dueDate">Sort by Due Date</option>
                                <option value="subject">Sort by Subject</option>
                                <option value="createdDate">Sort by Created Date</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Assignments List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Assignment List</h3>

                    {filteredAssignments.length === 0 ? (
                        <div className="text-center py-12">
                            <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchTerm || filterStatus !== 'all'
                                    ? 'No assignments found matching your criteria'
                                    : 'No assignments available'}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                {searchTerm || filterStatus !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'New assignments will appear here when your teachers create them'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAssignments.map((assignment) => {
                                const status = getStatus(assignment);
                                const statusColors = {
                                    'overdue': 'bg-red-50 border-red-200',
                                    'due-soon': 'bg-orange-50 border-orange-200',
                                    'pending': 'bg-white border-gray-200'
                                };
                                const badgeColors = {
                                    'overdue': 'bg-red-100 text-red-700',
                                    'due-soon': 'bg-orange-100 text-orange-700',
                                    'pending': 'bg-blue-100 text-blue-700'
                                };

                                return (
                                    <div
                                        key={assignment.id}
                                        className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${statusColors[status]}`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Left Section - Assignment Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={`p-3 rounded-lg ${status === 'overdue' ? 'bg-red-100' : status === 'due-soon' ? 'bg-orange-100' : 'bg-indigo-100'}`}>
                                                        <FaClipboardList className={`text-2xl ${status === 'overdue' ? 'text-red-600' : status === 'due-soon' ? 'text-orange-600' : 'text-indigo-600'}`} />
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <h4 className="text-xl font-bold text-gray-800">{assignment.title}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeColors[status]}`}>
                                                                {status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Pending'}
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                            {assignment.description}
                                                        </p>

                                                        {/* Meta Information */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {/* Subject */}
                                                            <div className="flex items-center gap-2">
                                                                <FaBook className="text-purple-500 text-sm" />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Subject</p>
                                                                    <p className="text-sm font-semibold text-gray-800">{assignment.subject?.name || 'N/A'}</p>
                                                                    <p className="text-xs text-gray-500">{assignment.subject?.code || ''}</p>
                                                                </div>
                                                            </div>

                                                            {/* Teacher */}
                                                            <div className="flex items-center gap-2">
                                                                <FaUser className="text-blue-500 text-sm" />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Teacher</p>
                                                                    <p className="text-sm font-semibold text-gray-800">{assignment.teacher?.full_name || 'N/A'}</p>
                                                                </div>
                                                            </div>

                                                            {/* Class */}
                                                            <div className="flex items-center gap-2">
                                                                <FaClipboardList className="text-green-500 text-sm" />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Class</p>
                                                                    <p className="text-sm font-semibold text-gray-800">{assignment.class_assigned?.name || 'N/A'}</p>
                                                                </div>
                                                            </div>

                                                            {/* Due Date */}
                                                            <div className="flex items-center gap-2">
                                                                <FaCalendarAlt className={`text-sm ${status === 'overdue' ? 'text-red-500' : status === 'due-soon' ? 'text-orange-500' : 'text-blue-500'}`} />
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Due Date</p>
                                                                    <p className={`text-sm font-semibold ${status === 'overdue' ? 'text-red-700' : status === 'due-soon' ? 'text-orange-700' : 'text-gray-800'}`}>
                                                                        {formatDate(assignment.due_date)}
                                                                    </p>
                                                                    <p className={`text-xs ${status === 'overdue' ? 'text-red-600' : status === 'due-soon' ? 'text-orange-600' : 'text-gray-500'}`}>
                                                                        {getTimeRemaining(assignment.due_date)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section - Actions */}
                                            <div className="flex lg:flex-col gap-2">
                                                <Link
                                                    to={`/student/assignment/${assignment.id}`}
                                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center whitespace-nowrap"
                                                >
                                                    View Details
                                                </Link>

                                                {/* Check if assignment is already submitted */}
                                                {assignment.assignment_submissions && assignment.assignment_submissions.length > 0 ? (
                                                    // Already submitted - show submitted badge
                                                    <div className="px-6 py-3 bg-green-100 text-green-700 border-2 border-green-500 rounded-lg font-medium text-center whitespace-nowrap flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Submitted
                                                    </div>
                                                ) : (
                                                    // Not submitted - show submit button (or disabled if overdue)
                                                    <Link
                                                        to={status === 'overdue' ? '#' : `/student/assignment/${assignment.id}/submit`}
                                                        className={`px-6 py-3 rounded-lg transition-colors font-medium text-center whitespace-nowrap ${status === 'overdue'
                                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                            }`}
                                                        onClick={(e) => status === 'overdue' && e.preventDefault()}
                                                    >
                                                        {status === 'overdue' ? 'Submission Closed' : 'Submit Work'}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

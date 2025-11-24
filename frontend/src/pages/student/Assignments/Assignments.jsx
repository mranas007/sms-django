import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaClock, FaExclamationCircle } from 'react-icons/fa';

import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import Table from '../../../components/common/Table.jsx';
import Badge from '../../../components/common/Badge.jsx';

export default function Assignments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/student/assignments/');
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

    const isOverdue = (dueDate) => new Date(dueDate) < new Date();
    const isDueSoon = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffDays = (due - now) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 3;
    };

    const getStatus = (assignment) => {
        if (assignment.assignment_submissions?.length > 0) return 'submitted';
        if (isOverdue(assignment.due_date)) return 'overdue';
        if (isDueSoon(assignment.due_date)) return 'due-soon';
        return 'pending';
    };

    const filteredAssignments = assignments.filter(assignment => {
        const status = getStatus(assignment);
        if (filterStatus === 'overdue' && status !== 'overdue') return false;
        if (filterStatus === 'pending' && status !== 'pending' && status !== 'due-soon') return false;
        if (filterStatus === 'submitted' && status !== 'submitted') return false;

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                assignment.title?.toLowerCase().includes(search) ||
                assignment.subject?.name?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    const columns = [
        {
            header: "Title",
            accessor: "title",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.title}</p>
                    <p className="text-xs text-gray-500">{row.subject?.name}</p>
                </div>
            )
        },
        {
            header: "Due Date",
            accessor: "due_date",
            render: (row) => {
                const status = getStatus(row);
                return (
                    <span className={`text-sm ${status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                        {new Date(row.due_date).toLocaleDateString()}
                    </span>
                );
            }
        },
        {
            header: "Status",
            render: (row) => {
                const status = getStatus(row);
                const variants = {
                    'submitted': 'success',
                    'overdue': 'danger',
                    'due-soon': 'warning',
                    'pending': 'info'
                };
                const labels = {
                    'submitted': 'Submitted',
                    'overdue': 'Overdue',
                    'due-soon': 'Due Soon',
                    'pending': 'Pending'
                };
                return <Badge variant={variants[status]}>{labels[status]}</Badge>;
            }
        },
        {
            header: "Action",
            render: (row) => {
                const status = getStatus(row);
                if (status === 'submitted') {
                    return <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => navigate(`/student/assignment/${row.id}`)}>View</Button>;
                }
                if (status === 'overdue') {
                    return <span className="text-xs text-gray-400 italic">Closed</span>;
                }
                return (
                    <Button variant="primary" className="text-xs py-1 px-2" onClick={() => navigate(`/student/assignment/${row.id}/submit`)}>
                        Submit
                    </Button>
                );
            }
        }
    ];

    // Stats
    const totalAssignments = assignments.length;
    const pendingCount = assignments.filter(a => getStatus(a) === 'pending' || getStatus(a) === 'due-soon').length;
    const overdueCount = assignments.filter(a => getStatus(a) === 'overdue').length;

    if (loading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <CircleLoader fullScreen={false} />
        </div>);
    if (error) return <div className="p-6 text-red-600 bg-red-50">{error}</div>;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
                <p className="text-gray-500">Track and submit your coursework.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <FaClipboardList className="text-indigo-600 text-xl" />
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <FaClock className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Overdue</p>
                            <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full">
                            <FaExclamationCircle className="text-red-600 text-xl" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Table */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                <Table
                    columns={columns}
                    data={filteredAssignments}
                    emptyMessage="No assignments found matching your filters."
                />
            </Card>
        </div>
    );
}


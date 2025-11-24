import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaUsers, FaClipboardList, FaPlus } from 'react-icons/fa';

import apiClient from '../../../services/Api.jsx';
import CircleLoader from '../../../components/CircleLoader';
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import Table from '../../../components/common/Table.jsx';
import Badge from '../../../components/common/Badge.jsx';

export default function Assignments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('teacher/assignments/');
            setAssignments(res.data);
        } catch (error) {
            const msg = error.message || "something went wrong!";
            setError(msg);
            console.log("something went wrong during fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate stats
    const totalAssignments = assignments.length;
    const totalStudents = assignments.reduce((sum, assignment) =>
        sum + (assignment.class_assigned?.students?.length || 0), 0
    );
    const totalSubjects = new Set(assignments.map(a => a.subject?.name)).size;

    const isOverdue = (dueDate) => new Date(dueDate) < new Date();

    const columns = [
        {
            header: "Title",
            accessor: "title",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{row.description}</p>
                </div>
            )
        },
        {
            header: "Subject",
            accessor: "subject",
            render: (row) => <Badge variant="info">{row.subject?.name || 'N/A'}</Badge>
        },
        {
            header: "Class",
            accessor: "class_assigned",
            render: (row) => (
                <span className="text-sm text-gray-700">
                    {row.class_assigned?.name || 'N/A'}
                </span>
            )
        },
        {
            header: "Due Date",
            accessor: "due_date",
            render: (row) => {
                const overdue = isOverdue(row.due_date);
                return (
                    <div>
                        <p className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                            {row.due_date ? new Date(row.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {overdue && <span className="text-xs text-red-500">Overdue</span>}
                    </div>
                );
            }
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => navigate(`/teacher/assignment/detail/${row.id}`)}>
                        View
                    </Button>
                    <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => navigate(`/teacher/assignment/edit/${row.id}`)}>
                        Edit
                    </Button>
                    <div className="inline-block">
                        <DeleteConfirmation
                            deleteUrl={`/teacher/assignments/${row.id}/`}
                            onDeleteSuccess={fetchData}
                            itemName={row.title}
                            triggerType="icon"
                        />
                    </div>
                </div>
            )
        }
    ];

    if (loading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <CircleLoader fullScreen={false} />
        </div>)
    if (error) return <div className="p-6 text-red-600 bg-red-50">{error}</div>;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                    <p className="text-gray-500">Manage your assigned tasks and student submissions.</p>
                </div>
                <Button onClick={() => navigate('/teacher/assignments/create')}>
                    <FaPlus className="mr-2 inline" /> Create Assignment
                </Button>
            </div>

            {/* Stats Overview */}
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

                <Card className="border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Students Targeted</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FaUsers className="text-green-600 text-xl" />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Subjects</p>
                            <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <FaBook className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Assignments Table */}
            <Card title="Assignment List">
                <Table
                    columns={columns}
                    data={assignments}
                    emptyMessage="No assignments found. Create one to get started."
                />
            </Card>
        </div>
    );
}


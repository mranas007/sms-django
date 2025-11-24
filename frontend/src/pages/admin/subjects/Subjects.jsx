import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaBook } from 'react-icons/fa';

// SERVICES & UTILS
import Api from '../../../services/Api.jsx';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Table from '../../../components/common/Table.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx';

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSubjects = async (search = '') => {
        try {
            const res = await Api.get(`/admin/subjects/?s=${search}`);
            if (res.status === 200 || res.status === 201)
                setSubjects(res.data);
        } catch (err) {
            setError('Failed to fetch subjects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSubjects(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const handleDelete = () => {
        fetchSubjects(searchQuery);
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
            <div className="lg:ml-64 p-6 lg:p-8">
                <ErrorMsg message={error} />
            </div>
        );
    }

    const columns = [
        {
            header: 'Subject Name',
            key: 'name',
            render: (subject) => (
                <div className="font-medium text-gray-900">{subject.name}</div>
            )
        },
        {
            header: 'Subject Code',
            key: 'code',
            render: (subject) => (
                <div className="text-gray-600 font-mono">{subject.code}</div>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (subject) => (
                <div className="flex items-center gap-2">
                    <Link to={`/admin/edit/subject/${subject.id}`}>
                        <Button variant="primary" size="sm" icon={<FaEdit />}>
                            Edit
                        </Button>
                    </Link>
                    <DeleteConfirmation
                        deleteUrl={`/admin/subject/${subject.id}/`}
                        onDeleteSuccess={handleDelete}
                        itemName={subject.name}
                        buttonSize="sm"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Subject Management</h1>
                    <p className="text-gray-600">Manage your school subjects and course codes</p>
                </div>

                {/* Search and Add Section */}
                <Card className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                        <div className="flex-1 max-w-md">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Subjects
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search by subject name or code..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <Link to="/admin/add/subject">
                            <Button variant="primary" icon={<FaPlus />}>
                                Add New Subject
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Subjects Table */}
                <Card>
                    {subjects.length === 0 ? (
                        <div className="text-center py-12">
                            <FaBook className="text-gray-300 text-6xl mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">No subjects found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your search or add a new subject</p>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={subjects}
                            emptyMessage="No subjects found"
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}

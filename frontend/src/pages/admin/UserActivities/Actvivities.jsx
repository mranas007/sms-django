import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

// SERVICES & UTILS
import apiClient from '../../../services/Api';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Badge from '../../../components/common/Badge.jsx';
import Table from '../../../components/common/Table.jsx';
import CircleLoader from '../../../components/CircleLoader';
import ErrorMsg from '../../../components/ErrorMsg';
import Pagination from '../../../components/Pagination';

export default function Actvivities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getActivities(currentPage);
    }, [currentPage]);

    const getActivities = async (page) => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get(`/admin/activities/?page=${page}`);
            setActivities(res.data.results);
            setPagination({
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous
            });
            setTotalPages(Math.ceil(res.data.count / 10));
        } catch (err) {
            setError(err.message || 'Failed to fetch activities');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <div className="p-6 lg:p-8">
                <ErrorMsg message={error} />
            </div>
        );
    }

    const columns = [
        {
            header: 'Action Type',
            key: 'action_type',
            render: (activity) => (
                <Badge variant="primary">{activity.action_type}</Badge>
            )
        },
        {
            header: 'Message',
            key: 'message',
            render: (activity) => (
                <div className="text-gray-900">{activity.message}</div>
            )
        },
        {
            header: 'User',
            key: 'user_username',
            render: (activity) => (
                <div className="font-medium text-gray-700">{activity.user_username}</div>
            )
        },
        {
            header: 'Timestamp',
            key: 'timestamp',
            render: (activity) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-gray-400" />
                    {new Date(activity.timestamp).toLocaleString()}
                </div>
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Activities</h1>
                        <p className="text-gray-600">View all user actions and system activities</p>
                    </div>
                    <Link to="/admin/dashboard">
                        <Button variant="secondary">Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Activities Table */}
                <Card>
                    <Table
                        columns={columns}
                        data={activities}
                        emptyMessage="No activities found"
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

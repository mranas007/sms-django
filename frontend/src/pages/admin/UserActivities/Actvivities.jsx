import React, { useEffect, useState } from 'react'

import apiClient from '../../../services/Api'
import BackBtn from '../../../components/BackBtn'
import CircleLoader from '../../../components/CircleLoader'
import ErrorMsg from '../../../components/ErrorMsg'
import Pagination from '../../../components/Pagination'



export default function Actvivities() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        getActivities(currentPage)
    }, [currentPage])

    const getActivities = async (page) => {
        setLoading(true)
        setError('')
        try {
            const res = await apiClient.get(`/admin/activities/?page=${page}`)
            setActivities(res.data.results)
            setPagination({
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous
            })
            setTotalPages(Math.ceil(res.data.count / 10)) // Assuming 10 items per page
        } catch (err) {
            setError(err.message || 'Failed to fetch activities')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <BackBtn to="/admin/dashboard" children="Go Back" />
                    <h1 className="text-2xl font-bold text-gray-900">User Activities</h1>
                </div>

                {loading ? (
                    <div className="w-full h-[80vh] flex justify-center py-12">
                        <CircleLoader fullScreen={false} />
                    </div>
                ) : error ? (
                    <ErrorMsg message={error} />
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activities.map((activity) => (
                                            <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{activity.action_type}</td>
                                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{activity.message}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user_username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange} />
                    </>
                )}
            </div>
        </div>
    )
}

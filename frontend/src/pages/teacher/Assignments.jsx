import React, { useEffect, useState } from 'react'

import apiClient from '../../services/Api.jsx'


export default function Assignments() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [assignments, setAssignments] = useState([])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get('teacher/assignments/')
            console.log(res.data)
            setAssignments(res.data)
        } catch (error) {
            const msg = error.message || "something went wrong!"
            setError(msg)
            console.log("something went wrong during fetching data: " + error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <div className="h-screen w-full"><CircleLoader /></div>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <>
            <h2 className="text-3xl font-bold mb-4">Assignments</h2>
            <p className="text-lg mb-4">Manage your assigned tasks and student submissions.</p>

            <div className="bg-white shadow p-4 rounded mb-6">
                <h3 className="text-xl font-semibold mb-2">Your Assigned Tasks</h3>
                {assignments.length === 0 ? (
                    <p>No assignments found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="bg-gray-100 p-4 rounded shadow-sm">
                                <h4 className="text-lg font-bold mb-1">{assignment.title}</h4>
                                <p className="text-sm text-gray-600">Subject: {assignment.subject?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-600">Due Date: {assignment.due_date || 'N/A'}</p>
                                <p className="text-sm mt-2">{assignment.description?.slice(0, 80) || 'No description provided'}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

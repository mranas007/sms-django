import React, { useEffect, useState } from 'react'
import { FaBook,FaInfo, FaEdit, FaCalendarAlt, FaUsers, FaClock, FaClipboardList } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import apiClient from '../../../services/Api.jsx'
import CircleLoader from '../../../components/CircleLoader'
import Btn from '../../../components/Btn.jsx'
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx'

export default function Assignments() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [assignments, setAssignments] = useState([])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get('teacher/assignments/')
            // console.log(res.data)
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

    // Calculate stats
    const totalAssignments = assignments.length
    const totalStudents = assignments.reduce((sum, assignment) =>
        sum + (assignment.class_assigned?.students?.length || 0), 0
    )

    // Check if assignment is overdue
    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date()
    }

    const isDeleteSuccess = () => {
        fetchData()
    }

    if (loading) return <div className="h-screen w-full flex items-center justify-center"><CircleLoader /></div>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>

                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Assignments</h1>
                        <p className="text-gray-600">Manage your assigned tasks and student submissions</p>
                    </div>

                    <div>
                        <Link to="/teacher/assignments/create">
                            <Btn
                                text={'Create Assignment'} />
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Assignments</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{totalAssignments}</p>
                            </div>
                            <div className="bg-indigo-100 p-4 rounded-lg">
                                <FaClipboardList className="text-indigo-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{totalStudents}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <FaUsers className="text-green-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Subjects</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {new Set(assignments.map(a => a.subject?.name)).size}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-lg">
                                <FaBook className="text-purple-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignments List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Assigned Tasks</h3>

                    {assignments.length === 0 ? (
                        <div className="text-center py-12">
                            <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No assignments found</p>
                            <p className="text-gray-400 text-sm mt-2">You haven't created any assignments yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    {/* Card Header */}
                                    <div className={`p-6 text-white ${isOverdue(assignment.due_date) ? 'bg-red-600' : 'bg-indigo-600'}`}>

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-2xl font-bold mb-2">{assignment.title}</h4>
                                                <div className="flex items-center gap-2 text-indigo-100">
                                                    <FaBook className="text-sm" />
                                                    <span className="text-sm">{assignment.subject?.name || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/teacher/assignment/detail/${assignment.id}`}
                                                    className="bg-white bg-opacity-20 text-indigo-600 hover:bg-opacity-30 p-2 rounded-lg transition"
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <FaInfo />
                                                </Link>
                                                <Link
                                                    to={`/teacher/assignment/edit/${assignment.id}`}
                                                    className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition flex items-center gap-2">
                                                    <FaEdit />
                                                </Link>
                                                <div className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center gap-2">
                                                    <DeleteConfirmation
                                                        deleteUrl={`/teacher/assignments/${assignment.id}/`}
                                                        onDeleteSuccess={isDeleteSuccess}
                                                        itemName={assignment.name}
                                                        triggerType="icon" // or "button" (default)
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Class Info */}
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUsers className="text-green-500" />
                                                <h5 className="font-semibold text-gray-700">Class</h5>
                                            </div>
                                            <div className="bg-green-50 rounded-lg px-4 py-2 inline-block">
                                                <p className="text-gray-800 font-medium">{assignment.class_assigned?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{assignment.class_assigned?.academic_year || ''}</p>
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaCalendarAlt className={isOverdue(assignment.due_date) ? 'text-red-500' : 'text-blue-500'} />
                                                <h5 className="font-semibold text-gray-700">Due Date</h5>
                                            </div>
                                            <div className={`rounded-lg px-4 py-2 inline-block ${isOverdue(assignment.due_date) ? 'bg-red-50' : 'bg-blue-50'}`}>
                                                <p className={`font-medium ${isOverdue(assignment.due_date) ? 'text-red-700' : 'text-blue-700'}`}>
                                                    {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </p>
                                                {isOverdue(assignment.due_date) && (
                                                    <p className="text-xs text-red-600 mt-1">Overdue</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Students Count */}
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUsers className="text-purple-500" />
                                                <h5 className="font-semibold text-gray-700">Students</h5>
                                                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                    {assignment.class_assigned?.students?.length || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h5 className="font-semibold text-gray-700 mb-2">Description</h5>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {assignment.description || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

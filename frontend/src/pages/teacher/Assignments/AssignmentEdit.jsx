import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBook, FaUsers, FaCalendarAlt, FaFileAlt, FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../../services/Api";
import BackBtn from "../../../components/BackBtn";
import CircleLoader from "../../../components/CircleLoader";

export default function AssignmentEdit() {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Fetch classes and subjects
    async function getClassesSubjects() {
        try {
            const res = await apiClient.get("/teacher/assignments/classes-subjects/");
            // console.log(res.data)
            setClasses(res.data.classes || []);
            setSubjects(res.data.subjects || []);
        } catch (error) {
            console.log("Error fetching classes and subjects:", error.message);
        }
    }

    // Fetch existing assignment data
    async function getAssignmentData() {
        try {
            setFetchLoading(true);
            const res = await apiClient.get(`/teacher/assignments/${id}/`);
            const assignment = res.data;
            // console.log(res.data);

            // Format the due_date for datetime-local input
            // Convert ISO string to format: YYYY-MM-DDTHH:mm
            const dueDate = new Date(assignment.due_date);
            const formattedDate = dueDate.toISOString().slice(0, 16);

            // Set form values
            setValue('title', assignment.title);
            setValue('description', assignment.description);
            // Extract IDs from nested objects for the select dropdowns
            setValue('class_assigned', assignment.class_assigned?.id || '');
            setValue('subject', assignment.subject?.id || '');
            setValue('due_date', formattedDate);

        } catch (error) {
            // console.error("Error fetching assignment:", error);
            setError(error.response?.data?.message || "Failed to load assignment data");
        } finally {
            setFetchLoading(false);
        }
    }

    useEffect(() => {
        getClassesSubjects();
        getAssignmentData();
    }, [id]);

    const onSubmit = async (data) => {
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            // Prepare assignment data
            const assignmentData = {
                title: data.title,
                description: data.description,
                class_assigned: data.class_assigned,
                subject: data.subject,
                due_date: new Date(data.due_date).toISOString(),
            };

            const response = await apiClient.put(`/teacher/assignments/${id}/`, assignmentData);

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                // Navigate back to assignments list after 2 seconds
                setTimeout(() => {
                    navigate('/teacher/assignments');
                }, 2000);
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to update assignment.';
            setError(msg);
            console.error('Update assignment error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <CircleLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <BackBtn />

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg mt-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-300">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <FaEdit className="text-indigo-600 text-2xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Edit Assignment</h1>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                            <strong className="font-bold">Success! </strong>
                            <span className="block sm:inline">Assignment updated successfully! Redirecting...</span>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FaFileAlt className="text-indigo-500" />
                                Assignment Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register('title', {
                                    required: 'Title is required',
                                    maxLength: { value: 255, message: 'Title must not exceed 255 characters' }
                                })}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Enter assignment title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Class and Subject Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Class Dropdown */}
                            <div>
                                <label htmlFor="class_assigned" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaUsers className="text-green-500" />
                                    Assign to Class
                                </label>
                                <select
                                    id="class_assigned"
                                    {...register('class_assigned', { required: 'Class is required' })}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                >
                                    <option value="">Select a class</option>
                                    {classes.map((cls) => (
                                        <option className="text-gray-700" key={cls.id} value={cls.id}>
                                            {cls.name} - {cls.academic_year}
                                        </option>
                                    ))}
                                </select>
                                {errors.class_assigned && <p className="text-red-500 text-xs mt-1">{errors.class_assigned.message}</p>}
                            </div>

                            {/* Subject Dropdown */}
                            <div>
                                <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaBook className="text-purple-500" />
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    {...register('subject', { required: 'Subject is required' })}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option className="text-gray-700" key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                        </div>

                        {/* Due Date Field */}
                        <div>
                            <label htmlFor="due_date" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FaCalendarAlt className="text-blue-500" />
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                id="due_date"
                                {...register('due_date', {
                                    required: 'Due date is required'
                                })}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                            {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date.message}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FaFileAlt className="text-orange-500" />
                                Description
                            </label>
                            <textarea
                                id="description"
                                {...register('description', { required: 'Description is required' })}
                                rows="6"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Provide detailed instructions for the assignment..."
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/teacher/assignments')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            <FaEdit className="mr-2 h-5 w-5" />
                            {loading ? 'Updating Assignment...' : 'Update Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

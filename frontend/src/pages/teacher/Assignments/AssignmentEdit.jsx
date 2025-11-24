import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBook, FaUsers, FaCalendarAlt, FaFileAlt, FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../../services/Api";
import BackBtn from "../../../components/BackBtn";
import CircleLoader from "../../../components/CircleLoader";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

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

            // Format the due_date for datetime-local input
            const dueDate = new Date(assignment.due_date);
            const formattedDate = dueDate.toISOString().slice(0, 16);

            // Set form values
            setValue('title', assignment.title);
            setValue('description', assignment.description);
            setValue('class_assigned', assignment.class_assigned?.id || '');
            setValue('subject', assignment.subject?.id || '');
            setValue('due_date', formattedDate);

        } catch (error) {
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
            <div className="w-full h-screen flex items-center justify-center">
                <CircleLoader fullScreen={false} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackBtn />

                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                        <FaEdit className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
                        <p className="text-gray-500">Update assignment details.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">Assignment updated successfully! Redirecting...</p>
                            </div>
                        </div>
                    </div>
                )}

                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Assignment Title
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFileAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    {...register('title', {
                                        required: 'Title is required',
                                        maxLength: { value: 255, message: 'Title must not exceed 255 characters' }
                                    })}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                    placeholder="e.g., Algebra Homework Chapter 5"
                                />
                            </div>
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Class and Subject Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Class Dropdown */}
                            <div>
                                <label htmlFor="class_assigned" className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign to Class
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUsers className="text-gray-400" />
                                    </div>
                                    <select
                                        id="class_assigned"
                                        {...register('class_assigned', { required: 'Class is required' })}
                                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                    >
                                        <option value="">Select a class</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name} - {cls.academic_year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.class_assigned && <p className="text-red-500 text-xs mt-1">{errors.class_assigned.message}</p>}
                            </div>

                            {/* Subject Dropdown */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBook className="text-gray-400" />
                                    </div>
                                    <select
                                        id="subject"
                                        {...register('subject', { required: 'Subject is required' })}
                                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                    >
                                        <option value="">Select a subject</option>
                                        {subjects.map((subject) => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                        </div>

                        {/* Due Date Field */}
                        <div>
                            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="datetime-local"
                                    id="due_date"
                                    {...register('due_date', {
                                        required: 'Due date is required'
                                    })}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                />
                            </div>
                            {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date.message}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                {...register('description', { required: 'Description is required' })}
                                rows="6"
                                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-3"
                                placeholder="Provide detailed instructions for the assignment..."
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/teacher/assignments')}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Assignment'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

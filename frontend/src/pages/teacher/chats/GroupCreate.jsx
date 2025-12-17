import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUsers } from 'react-icons/fi';
import apiClient from "../../../services/Api";
import ErrorMsg from '../../../components/ErrorMsg';

export default function GroupCreate() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await apiClient.get('/teacher/classes/');
                setClasses(response.data);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/teacher/groups/', data);
            navigate('/teacher/chat/groups');
        } catch (error) {
            console.error("Failed to create group", error);
            setError("Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Group</h1>
                    <p className="text-gray-500 text-sm">Start a new discussion group for a class</p>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <FiUsers size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Group Details</h3>
                        <p className="text-sm text-gray-500">Provide the basic information for your group</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {error && <ErrorMsg error={error} />}
                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group Name *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Class 10-A Physics Discussion"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            {...register('name', { required: 'Group name is required' })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Class Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Class *
                        </label>
                        <div className="relative">
                            <select
                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white ${errors.group_class ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                {...register('group_class', { required: 'Please select a class' })}
                            >
                                <option value="">-- Choose a class --</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name_display || cls.name || `${cls.grade} ${cls.section}`}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.group_class && (
                            <p className="mt-1 text-sm text-red-500">{errors.group_class.message}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Only students from the selected class will be added to this group initially.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <FiSave size={18} />
                            {loading ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

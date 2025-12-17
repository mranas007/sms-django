import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUsers, FiHash, FiChevronRight } from 'react-icons/fi';
import apiClient from "../../../services/Api"; // Correct import path
import DeleteConfirmation from '../../../components/DeleteConfirmation';

export default function GroupList() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // get groups from api
                const response = await apiClient.get('/teacher/groups/');
                // console.log(response.data);
                setGroups(response.data);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading chat groups...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chat Groups</h1>
                    <p className="mt-2 text-gray-600">Manage and communicate with your classes and groups</p>
                </div>
                <button
                    onClick={() => navigate('/teacher/chat/groups/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <FiPlus size={20} />
                    <span>Create New Group</span>
                </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => navigate(`/teacher/chat/room/${group.id}`)}
                        className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 relative overflow-hidden"
                    >
                        {/* Decorative background visual */}
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FiHash size={80} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <FiUsers size={24} />
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                    {new Date(group.updated_at || group.created_at).toLocaleDateString()}
                                </span>
                                <DeleteConfirmation
                                    triggerType="icon"
                                    deleteUrl={`/chat/groups/${group.id}`}
                                    itemName={group.name}
                                    description="Are you sure you want to delete this group?"
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                {group.name}
                            </h3>

                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {group.group_class?.name || 'No Class'} • {group.members_count || 0} Members
                            </p>

                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <p className="text-sm text-gray-600 line-clamp-1 italic">
                                    {group.last_message ? `"${group.last_message}"` : "No messages yet"}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <span className="text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Open Chat <FiChevronRight size={16} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State (Hidden if groups exist) */}
                {groups.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <FiUsers size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No groups found</h3>
                        <p className="mt-2 text-gray-500">Get started by creating a new chat group.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

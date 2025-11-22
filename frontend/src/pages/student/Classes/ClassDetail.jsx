import React, { useEffect, useState } from 'react';
import { FaBook, FaUsers, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserGraduate } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import BackBtn from '../../../components/BackBtn';

export default function ClassDetail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [classData, setClassData] = useState(null);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/student/class/');
            const classInfo = Array.isArray(res.data) ? res.data[0] : res.data;
            setClassData(classInfo);
        } catch (error) {
            const msg = error.message || "Something went wrong!";
            setError(msg);
            console.error("Error fetching class data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, []);

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Generate random color for avatar
    const getAvatarColor = (index) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-teal-500'
        ];
        return colors[index % colors.length];
    };

    if (loading) return <div className="h-screen w-full flex items-center justify-center"><CircleLoader /></div>;
    if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
    if (!classData) return <p className="text-gray-600 text-center mt-8">No class data available</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <BackBtn />

                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-indigo-600 bg-white bg-opacity-20 p-4 rounded-lg">
                                <FaGraduationCap className="text-4xl" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">{classData.name}</h1>
                                <p className="text-indigo-100 text-lg mt-1">My Class Information</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-indigo-600">
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaCalendarAlt className="text-xl" />
                                    <p className="text-sm opacity-90">Academic Year</p>
                                </div>
                                <p className="text-xl font-bold">{classData.academic_year}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaBook className="text-xl" />
                                    <p className="text-sm opacity-90">Subjects</p>
                                </div>
                                <p className="text-xl font-bold">{classData.subjects?.length || 0}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaUsers className="text-xl" />
                                    <p className="text-sm opacity-90">Classmates</p>
                                </div>
                                <p className="text-xl font-bold">{classData.students?.length || 0}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaChalkboardTeacher className="text-xl" />
                                    <p className="text-sm opacity-90">Teachers</p>
                                </div>
                                <p className="text-xl font-bold">{classData.teachers?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <FaClock className="text-indigo-600 text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Class Schedule</p>
                                <p className="text-xl font-bold text-gray-800">{classData.schedule}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Subjects Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FaBook className="text-purple-600 text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
                        </div>

                        {classData.subjects && classData.subjects.length > 0 ? (
                            <div className="space-y-3">
                                {classData.subjects.map((subject, index) => (
                                    <div
                                        key={subject.id}
                                        className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{subject.name}</h3>
                                                    <p className="text-sm text-purple-600 font-medium">Code: {subject.code}</p>
                                                </div>
                                            </div>
                                            <FaBook className="text-purple-400 text-2xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No subjects assigned</p>
                        )}
                    </div>

                    {/* Teachers Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaChalkboardTeacher className="text-blue-600 text-xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
                        </div>

                        {classData.teachers && classData.teachers.length > 0 ? (
                            <div className="space-y-3">
                                {classData.teachers.map((teacher, index) => (
                                    <div
                                        key={teacher.id}
                                        className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`${getAvatarColor(index)} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                                                {getInitials(teacher.full_name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-lg">{teacher.full_name}</h3>
                                                <p className="text-sm text-gray-600">@{teacher.username}</p>
                                                {teacher.email && (
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                        <FaEnvelope className="text-blue-500" />
                                                        <span className="truncate">{teacher.email}</span>
                                                    </div>
                                                )}
                                                {teacher.phone_number && (
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                        <FaPhone className="text-green-500" />
                                                        <span>{teacher.phone_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No teachers assigned</p>
                        )}
                    </div>
                </div>

                {/* Classmates Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <FaUserGraduate className="text-green-600 text-xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">My Classmates</h2>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {classData.students?.length || 0} Students
                        </span>
                    </div>

                    {classData.students && classData.students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classData.students.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`${getAvatarColor(index)} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                                            {getInitials(student.full_name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800">{student.full_name}</h3>
                                            <p className="text-sm text-gray-500">@{student.username}</p>

                                            {/* <div className="mt-3 space-y-1">
                                                {student.email && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <FaEnvelope className="text-blue-500 flex-shrink-0" />
                                                        <span className="truncate">{student.email}</span>
                                                    </div>
                                                )}
                                                {student.phone_number && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <FaPhone className="text-green-500 flex-shrink-0" />
                                                        <span>{student.phone_number}</span>
                                                    </div>
                                                )}
                                                {student.address && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                                                        <span className="truncate">{student.address}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {student.bio && (
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                                                    "{student.bio}"
                                                </p>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No classmates found</p>
                    )}
                </div>

                {/* Class Info Footer */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-indigo-600">
                        <FaClock />
                        <span>
                            <span className="font-medium">Class created on:</span>{' '}
                            {new Date(classData.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { FaBook, FaUsers, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserGraduate } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import BackBtn from '../../../components/BackBtn';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';

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

    if (loading) return (
        <div className="w-full h-screen flex items-center justify-center">
            <CircleLoader fullScreen={false} />
        </div>);
        
    if (error) return <div className="p-6 text-red-600 bg-red-50">{error}</div>;
    if (!classData) return <div className="p-6 text-gray-600 bg-gray-50 text-center">No class data available</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <BackBtn />

                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                        <FaGraduationCap className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
                        <p className="text-gray-500">My Class Information</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-indigo-500">
                        <div className="flex items-center gap-2 mb-1">
                            <FaCalendarAlt className="text-indigo-500" />
                            <p className="text-xs text-gray-500 font-medium">Academic Year</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{classData.academic_year}</p>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-2 mb-1">
                            <FaBook className="text-purple-500" />
                            <p className="text-xs text-gray-500 font-medium">Subjects</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{classData.subjects?.length || 0}</p>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <div className="flex items-center gap-2 mb-1">
                            <FaUsers className="text-green-500" />
                            <p className="text-xs text-gray-500 font-medium">Classmates</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{classData.students?.length || 0}</p>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2 mb-1">
                            <FaChalkboardTeacher className="text-blue-500" />
                            <p className="text-xs text-gray-500 font-medium">Teachers</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{classData.teachers?.length || 0}</p>
                    </Card>
                </div>

                {/* Schedule Section */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-full">
                            <FaClock className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Class Schedule</p>
                            <p className="text-lg font-bold text-gray-900">{classData.schedule}</p>
                        </div>
                    </div>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subjects Section */}
                    <Card title="Subjects" icon={<FaBook className="text-purple-600" />}>
                        {classData.subjects && classData.subjects.length > 0 ? (
                            <div className="space-y-3">
                                {classData.subjects.map((subject, index) => (
                                    <div
                                        key={subject.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                                                <p className="text-xs text-gray-500">Code: {subject.code}</p>
                                            </div>
                                        </div>
                                        <Badge variant="info">Subject</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8 text-sm">No subjects assigned</p>
                        )}
                    </Card>

                    {/* Teachers Section */}
                    <Card title="Teachers" icon={<FaChalkboardTeacher className="text-blue-600" />}>
                        {classData.teachers && classData.teachers.length > 0 ? (
                            <div className="space-y-3">
                                {classData.teachers.map((teacher, index) => (
                                    <div
                                        key={teacher.id}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className={`${getAvatarColor(index)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                                            {getInitials(teacher.full_name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">{teacher.full_name}</h3>
                                            <p className="text-xs text-gray-500">@{teacher.username}</p>
                                            {teacher.email && (
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <FaEnvelope className="text-blue-400" />
                                                    <span className="truncate">{teacher.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8 text-sm">No teachers assigned</p>
                        )}
                    </Card>
                </div>

                {/* Classmates Section */}
                <Card
                    title="My Classmates"
                    icon={<FaUserGraduate className="text-green-600" />}
                    action={<Badge variant="success">{classData.students?.length || 0} Students</Badge>}
                >
                    {classData.students && classData.students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classData.students.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all"
                                >
                                    <div className={`${getAvatarColor(index)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                                        {getInitials(student.full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm">{student.full_name}</h3>
                                        <p className="text-xs text-gray-500">@{student.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8 text-sm">No classmates found</p>
                    )}
                </Card>

                {/* Class Info Footer */}
                <div className="text-center text-xs text-gray-400 mt-6">
                    <span className="font-medium">Class created on:</span>{' '}
                    {new Date(classData.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
    );
}
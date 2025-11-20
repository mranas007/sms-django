// REACT HOOKS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaCalendarAlt, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

// SERVICES
import apiClient from "../../services/Api.jsx";

// COMPONENTS
import CircleLoader from '../../components/CircleLoader.jsx'


function Classes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {

      const res = await apiClient.get("teacher/dashboard/");
      // console.log(res.data);
      setClasses(res.data);

    } catch (error) {
      console.error("Error fetching teacher data:", error);
      setError(
        error.response?.data?.message ||
        "Failed to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // Calculate stats
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);
  const uniqueSubjects = new Set(classes.flatMap(cls => cls.subjects?.map(s => s.name) || [])).size;

  if (loading) return <div className="h-screen w-full flex items-center justify-center">
    <CircleLoader />
  </div>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Classes</h1>
          <p className="text-gray-600">Manage your assigned classes and students with ease</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalClasses}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <FaGraduationCap className="text-indigo-600 text-2xl" />
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
                <p className="text-3xl font-bold text-gray-800 mt-1">{uniqueSubjects}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaBook className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Classes List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Classes</h3>
          
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <FaGraduationCap className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No classes found</p>
              <p className="text-gray-400 text-sm mt-2">You haven't been assigned to any classes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {classes.map((cls) => (
                <div 
                  key={cls.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="bg-indigo-600 p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{cls.name}</h4>
                        <div className="flex items-center gap-2 text-indigo-100">
                          <FaCalendarAlt className="text-sm" />
                          <span className="text-sm">{cls.academic_year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Schedule */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        <h5 className="font-semibold text-gray-700">Schedule</h5>
                      </div>
                      <p className="text-gray-600 bg-gray-50 rounded-lg px-4 py-2 inline-block">
                        {cls.schedule}
                      </p>
                    </div>

                    {/* Subjects */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FaBook className="text-purple-500" />
                        <h5 className="font-semibold text-gray-700">Subjects</h5>
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {cls.subjects?.length || 0}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cls.subjects && cls.subjects.length > 0 ? (
                          cls.subjects.map((subject) => (
                            <span
                              key={subject.id}
                              className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200"
                            >
                              {subject.name} ({subject.code})
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No subjects assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Teachers */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FaChalkboardTeacher className="text-blue-500" />
                        <h5 className="font-semibold text-gray-700">Teachers</h5>
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {cls.teachers?.length || 0}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {cls.teachers && cls.teachers.length > 0 ? (
                          cls.teachers.slice(0, 3).map((teacher) => (
                            <div
                              key={teacher.id}
                              className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100"
                            >
                              <div className="bg-blue-200 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {teacher.full_name?.charAt(0) || teacher.username?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{teacher.full_name || teacher.username}</p>
                                <p className="text-xs text-gray-500">@{teacher.username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No teachers assigned</span>
                        )}
                        {cls.teachers && cls.teachers.length > 3 && (
                          <p className="text-xs text-gray-500 mt-2">+{cls.teachers.length - 3} more teachers</p>
                        )}
                      </div>
                    </div>

                    {/* Students */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FaUsers className="text-green-500" />
                        <h5 className="font-semibold text-gray-700">Students</h5>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {cls.students?.length || 0}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {cls.students && cls.students.length > 0 ? (
                          cls.students.slice(0, 5).map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-100"
                            >
                              <div className="bg-green-200 text-green-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {student.full_name?.charAt(0) || student.username?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{student.full_name || student.username}</p>
                                <p className="text-xs text-gray-500">@{student.username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No students enrolled</span>
                        )}
                        {cls.students && cls.students.length > 5 && (
                          <p className="text-xs text-gray-500 mt-2">+{cls.students.length - 5} more students</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classes
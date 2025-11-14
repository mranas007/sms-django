import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft,FaEdit, FaTrash, FaPlus, FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaSearch, FaInfo } from 'react-icons/fa';
import Api from '../../../services/Api.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import BackBtn from '../../../components/BackBtn'
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx';



export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await Api.get('/admin/classes/');
      // console.log(res.data);
      setClasses(res.data.results || []);
    } catch (err) {
      setError('Failed to fetch classes.');
      // console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };
 

  const filteredClasses = Array.isArray(classes) ? classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.academic_year.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const isDeleteSuccess = async () => {
    fetchClasses();
  };

  if (loading) {
    return <CircleLoader />;
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Class Management</h1>
            <p className="text-gray-600">Manage your school classes, students, and teachers</p>
          </div>
          <div>
            <BackBtn />
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by class name or academic year..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/admin/add/class"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <FaPlus /> Add New Class
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{filteredClasses.length}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <FaBook className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {filteredClasses.reduce((sum, cls) => sum + cls.students.length, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {filteredClasses.reduce((sum, cls) => sum + cls.teachers.length, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaChalkboardTeacher className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Class Cards */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaBook className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No classes found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new class</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Card Header */}
                <div className="bg-indigo-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{cls.name}</h2>
                      <div className="flex items-center gap-2 text-indigo-100">
                        <FaCalendarAlt className="text-sm" />
                        <span className="text-sm">{cls.academic_year}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/class/detail/${cls.id}`}
                        className="bg-white bg-opacity-20 text-indigo-600 hover:bg-opacity-30 p-2 rounded-lg transition"
                        onClick={(e) => e.stopPropagation()}>
                        <FaInfo />
                      </Link>
                      <Link
                        to={`/admin/class/edit/${cls.id}`}
                        className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition flex items-center gap-2">
                        <FaEdit />
                      </Link>
                      <DeleteConfirmation
                        deleteUrl={`/admin/class/${cls.id}/`}
                        onDeleteSuccess={isDeleteSuccess}
                        itemName={cls.name}
                        triggerType="icon" // or "button" (default)
                      />
                   
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Schedule */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="text-indigo-500" />
                      <h3 className="font-semibold text-gray-700">Schedule</h3>
                    </div>
                    <p className="text-gray-600 bg-gray-50 rounded-lg px-4 py-2 inline-block">
                      {cls.schedule}
                    </p>
                  </div>

                  {/* Subjects */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBook className="text-purple-500" />
                      <h3 className="font-semibold text-gray-700">Subjects</h3>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {cls.subjects.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cls.subjects.length > 0 ? (
                        cls.subjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200"
                          >
                            {sub.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No subjects assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Teachers and Students Side by Side */}
                  <div className="flex gap-6">
                    {/* Teachers - Left Side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <FaChalkboardTeacher className="text-blue-500" />
                        <h3 className="font-semibold text-gray-700">Teachers</h3>
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {cls.teachers.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {cls.teachers.length > 0 ? (
                          cls.teachers.map((teacher, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100"
                            >
                              <div className="bg-blue-200 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {teacher.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{teacher.full_name}</p>
                                <p className="text-xs text-gray-500">@{teacher.username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No teachers assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Students - Right Side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <FaUsers className="text-green-500" />
                        <h3 className="font-semibold text-gray-700">Students</h3>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {cls.students.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {cls.students.length > 0 ? (
                          cls.students.map((student, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-100"
                            >
                              <div className="bg-green-200 text-green-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {student.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{student.full_name}</p>
                                <p className="text-xs text-gray-500">@{student.username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No students enrolled</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
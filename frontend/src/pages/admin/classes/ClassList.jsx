import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEdit,
  FaPlus,
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaSearch,
  FaInfo
} from 'react-icons/fa';

// SERVICES & UTILS
import Api from '../../../services/Api.jsx';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Badge from '../../../components/common/Badge.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
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
      setClasses(res.data.results || []);
    } catch (err) {
      setError('Failed to fetch classes.');
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
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <ErrorMsg message={error} />
      </div>
    );
  }

  const totalStudents = filteredClasses.reduce((sum, cls) => sum + cls.students.length, 0);
  const totalTeachers = filteredClasses.reduce((sum, cls) => sum + cls.teachers.length, 0);

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Management</h1>
          <p className="text-gray-600">Manage your school classes, students, and teachers</p>
        </div>

        {/* Search and Add Section */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Classes
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search by class name or academic year..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Link to="/admin/add/class">
              <Button variant="primary" icon={<FaPlus />}>
                Add New Class
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{filteredClasses.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-100">
                <FaBook className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{totalTeachers}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <FaChalkboardTeacher className="text-purple-600 text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Class Cards */}
        {filteredClasses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FaBook className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No classes found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or add a new class</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="overflow-hidden">
                {/* Card Header */}
                <div className="bg-indigo-600 p-6 -m-6 mb-6 text-white">
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
                        className="p-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                      >
                        <FaInfo className="text-white" />
                      </Link>
                      <Link
                        to={`/admin/class/edit/${cls.id}`}
                        className="p-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                      >
                        <FaEdit className="text-white" />
                      </Link>
                      <div className="rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
                        <DeleteConfirmation
                          deleteUrl={`/admin/class/${cls.id}/`}
                          onDeleteSuccess={isDeleteSuccess}
                          itemName={cls.name}
                          triggerType="icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Schedule</h3>
                  </div>
                  <Badge variant="default">{cls.schedule}</Badge>
                </div>

                {/* Subjects */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBook className="text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Subjects</h3>
                    <Badge variant="default">{cls.subjects.length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cls.subjects.length > 0 ? (
                      cls.subjects.map((sub, idx) => (
                        <Badge key={idx} variant="info">
                          {sub.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">No subjects assigned</span>
                    )}
                  </div>
                </div>

                {/* Teachers and Students */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Teachers */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FaChalkboardTeacher className="text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Teachers</h3>
                      <Badge variant="primary">{cls.teachers.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {cls.teachers.length > 0 ? (
                        cls.teachers.map((teacher, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-blue-50 rounded-md p-2 border border-blue-100"
                          >
                            <div className="bg-blue-200 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                              {teacher.full_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{teacher.full_name}</p>
                              <p className="text-xs text-gray-500 truncate">@{teacher.username}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No teachers</span>
                      )}
                    </div>
                  </div>

                  {/* Students */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FaUsers className="text-green-600" />
                      <h3 className="font-semibold text-gray-900">Students</h3>
                      <Badge variant="success">{cls.students.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {cls.students.length > 0 ? (
                        cls.students.slice(0, 3).map((student, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-green-50 rounded-md p-2 border border-green-100"
                          >
                            <div className="bg-green-200 text-green-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                              {student.full_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{student.full_name}</p>
                              <p className="text-xs text-gray-500 truncate">@{student.username}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No students</span>
                      )}
                      {cls.students.length > 3 && (
                        <p className="text-xs text-gray-500 text-center pt-1">
                          +{cls.students.length - 3} more students
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
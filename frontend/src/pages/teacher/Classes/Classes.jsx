// REACT HOOKS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaCalendarAlt, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

// SERVICES
import apiClient from "../../../services/Api.jsx";

// COMPONENTS
import CircleLoader from '../../../components/CircleLoader.jsx'
import Card from '../../../components/common/Card.jsx';
import Badge from '../../../components/common/Badge.jsx';
import Button from '../../../components/common/Button.jsx';

function Classes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {

      const res = await apiClient.get("teacher/classes/");
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

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircleLoader fullScreen={false} />
    </div>)
  if (error) return <div className="p-6 text-red-600 bg-red-50">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-500">Manage your assigned classes and students.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <FaGraduationCap className="text-indigo-600 text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FaUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueSubjects}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FaBook className="text-purple-600 text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Classes List */}
      <Card title="Your Classes">
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
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{cls.name}</h4>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <FaCalendarAlt className="text-xs" />
                      <span>{cls.academic_year}</span>
                    </div>
                  </div>
                  <Badge variant="primary">{cls.schedule}</Badge>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  {/* Subjects */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaBook className="text-purple-500 text-sm" />
                      <h5 className="text-sm font-semibold text-gray-700">Subjects</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cls.subjects && cls.subjects.length > 0 ? (
                        cls.subjects.map((subject) => (
                          <Badge key={subject.id} variant="info">
                            {subject.name} ({subject.code})
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">No subjects assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Teachers */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaChalkboardTeacher className="text-blue-500 text-sm" />
                      <h5 className="text-sm font-semibold text-gray-700">Teachers</h5>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {cls.teachers && cls.teachers.length > 0 ? (
                        cls.teachers.slice(0, 5).map((teacher) => (
                          <div key={teacher.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600" title={teacher.full_name}>
                            {teacher.full_name?.charAt(0) || teacher.username?.charAt(0)}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">No teachers</span>
                      )}
                      {cls.teachers && cls.teachers.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          +{cls.teachers.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Students */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaUsers className="text-green-500 text-sm" />
                      <h5 className="text-sm font-semibold text-gray-700">Students ({cls.students?.length || 0})</h5>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {cls.students && cls.students.length > 0 ? (
                        cls.students.slice(0, 5).map((student) => (
                          <div key={student.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-green-100 flex items-center justify-center text-xs font-bold text-green-600" title={student.full_name}>
                            {student.full_name?.charAt(0) || student.username?.charAt(0)}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">No students</span>
                      )}
                      {cls.students && cls.students.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          +{cls.students.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end">
                  <Button variant="secondary" className="text-xs">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Classes;
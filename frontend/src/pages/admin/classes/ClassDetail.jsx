import React, { useState, useEffect } from 'react';
import { Link, useNavigate , useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaInfo,
  FaEdit,
  FaTrash,
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import Api from '../../../services/Api.jsx';
import DeleteConfirmation from '../../../components/DeleteConfirmation.jsx';
import BackBtn from '../../../components/BackBtn'


export default function ClassDetail() {
  const { id } = useParams(); // Get class ID from URL
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchClassDetail();
  }, [id]);

  const fetchClassDetail = async () => {
    try {
      const res = await Api.get(`/admin/class/${id}/`);
      // console.log(res.data);
      setClassData(res.data);
    } catch (err) {
      setError('Failed to fetch class details.');
      console.error('Error fetching class detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDeleteSuccess = async () => {
    navigate('/admin/classes');
  };

  if (loading) {
    return <CircleLoader />;
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Class not found</p>
          <BackBtn />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
        <BackBtn />
        </div>

        {/* Class Header Card */}
        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">{classData.name}</h1>
              <div className="flex flex-wrap gap-4 text-indigo-100">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Academic Year: {classData.academic_year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{classData.schedule}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <DeleteConfirmation
                deleteUrl={`/admin/class/${classData.id}/`}
                onDeleteSuccess={isDeleteSuccess}
                itemName={classData.name}
            
                triggerType="button" // or "icon" (default)
              />
              <Link
                to={`/admin/class/edit/${classData.id}`}
                className="bg-white text-indigo-600 bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition flex items-center gap-2">
                <FaEdit /> Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Subjects</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{classData.subjects.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaBook className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Teachers</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{classData.teachers.length}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaChalkboardTeacher className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{classData.students.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaBook className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
            </div>

            {classData.subjects.length > 0 ? (
              <div className="space-y-4">
                {classData.subjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{subject.name}</h3>
                    <p className="text-purple-600 text-sm font-medium">Code: {subject.code}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No subjects assigned yet</p>
            )}
          </div>

          {/* Teachers Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaChalkboardTeacher className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
            </div>

            {classData.teachers.length > 0 ? (
              <div className="space-y-4">
                {classData.teachers.map((teacher, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center text-lg">
                        {teacher.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{teacher.full_name}</h3>
                        <p className="text-gray-500 text-sm">@{teacher.username}</p>
                      </div>
                    </div>

                    {teacher.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaEnvelope className="text-blue-500" />
                        <span>{teacher.email}</span>
                      </div>
                    )}

                    {teacher.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaPhone className="text-blue-500" />
                        <span>{teacher.phone_number}</span>
                      </div>
                    )}

                    {teacher.bio && (
                      <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-blue-200">
                        {teacher.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No teachers assigned yet</p>
            )}
          </div>

          {/* Students Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Students</h2>
            </div>

            {classData.students.length > 0 ? (
              <div className="space-y-4">
                {classData.students.map((student, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center text-lg">
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{student.full_name}</h3>
                        <p className="text-gray-500 text-sm">@{student.username}</p>
                      </div>
                    </div>

                    {student.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaEnvelope className="text-green-500" />
                        <span>{student.email}</span>
                      </div>
                    )}

                    {student.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaPhone className="text-green-500" />
                        <span>{student.phone_number}</span>
                      </div>
                    )}

                    {student.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaMapMarkerAlt className="text-green-500" />
                        <span>{student.address}</span>
                      </div>
                    )}

                    {student.bio && (
                      <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-green-200">
                        {student.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No students enrolled yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
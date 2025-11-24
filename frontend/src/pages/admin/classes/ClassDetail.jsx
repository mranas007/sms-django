import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaEdit,
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
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

export default function ClassDetail() {
  const { id } = useParams();
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

  if (!classData) {
    return (
      <div className="p-6 lg:p-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Class not found</p>
            <Link to="/admin/classes">
              <Button variant="secondary">Back to Classes</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
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
            <Link to="/admin/classes">
              <Button variant="secondary">Back to Classes</Button>
            </Link>
            <Link to={`/admin/class/edit/${classData.id}`}>
              <Button variant="primary" icon={<FaEdit />}>
                Edit Class
              </Button>
            </Link>
            <DeleteConfirmation
              deleteUrl={`/admin/class/${classData.id}/`}
              onDeleteSuccess={isDeleteSuccess}
              itemName={classData.name}
              triggerType="button"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{classData.subjects.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <FaBook className="text-purple-600 text-2xl" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{classData.teachers.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <FaChalkboardTeacher className="text-blue-600 text-2xl" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Students</p>
                <p className="text-3xl font-bold text-gray-900">{classData.students.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects Section */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FaBook className="text-purple-600" />
                </div>
                <span>Subjects</span>
              </div>
            }
          >
            {classData.subjects.length > 0 ? (
              <div className="space-y-3">
                {classData.subjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-50 rounded-md p-4 border border-purple-100"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                    <p className="text-purple-600 text-sm font-medium">Code: {subject.code}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No subjects assigned yet</p>
            )}
          </Card>

          {/* Teachers Section */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FaChalkboardTeacher className="text-blue-600" />
                </div>
                <span>Teachers</span>
              </div>
            }
          >
            {classData.teachers.length > 0 ? (
              <div className="space-y-3">
                {classData.teachers.map((teacher, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 rounded-md p-4 border border-blue-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        {teacher.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">{teacher.full_name}</h3>
                        <p className="text-gray-500 text-sm">@{teacher.username}</p>
                      </div>
                    </div>

                    {teacher.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaEnvelope className="text-blue-500 flex-shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                    )}

                    {teacher.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-blue-500 flex-shrink-0" />
                        <span>{teacher.phone_number}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No teachers assigned yet</p>
            )}
          </Card>

          {/* Students Section */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <FaUsers className="text-green-600" />
                </div>
                <span>Students</span>
              </div>
            }
          >
            {classData.students.length > 0 ? (
              <div className="space-y-3">
                {classData.students.map((student, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 rounded-md p-4 border border-green-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        {student.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                        <p className="text-gray-500 text-sm">@{student.username}</p>
                      </div>
                    </div>

                    {student.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaEnvelope className="text-green-500 flex-shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}

                    {student.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FaPhone className="text-green-500 flex-shrink-0" />
                        <span>{student.phone_number}</span>
                      </div>
                    )}

                    {student.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                        <span className="truncate">{student.address}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 italic">No students enrolled yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
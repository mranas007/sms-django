import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaUsers, FaGraduationCap, FaSearch } from 'react-icons/fa';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';

export default function Students() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('teacher/students/');
      setStudents(res.data);
    } catch (error) {
      const msg = error.message || "Something went wrong!";
      setError(msg);
      console.error("Error fetching students:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><CircleLoader /></div>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Students</h1>
          <p className="text-gray-600">View and manage your students' information</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{students.length}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <FaUsers className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{students.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaGraduationCap className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Age</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {students.length > 0
                    ? Math.round(students.reduce((sum, s) => sum + (calculateAge(s.birth_date) !== 'N/A' ? calculateAge(s.birth_date) : 0), 0) / students.filter(s => s.birth_date).length)
                    : 0}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaBirthdayCake className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Student Directory</h3>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No students found matching your search' : 'No students found'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they are assigned to your classes'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Card Header with Avatar */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      {student.profile_picture ? (
                        <img
                          src={student.profile_picture}
                          alt={student.full_name}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-white bg-opacity-20 flex items-center justify-center">
                          <span className="text-2xl font-bold">
                            {getInitials(student.full_name)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold">{student.full_name || 'N/A'}</h4>
                        <p className="text-indigo-100 text-sm">@{student.username || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg mt-1">
                        <FaEnvelope className="text-blue-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="text-sm text-gray-800 break-all">{student.email || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg mt-1">
                        <FaPhone className="text-green-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="text-sm text-gray-800">{student.phone_number || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg mt-1">
                        <FaMapMarkerAlt className="text-orange-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Address</p>
                        <p className="text-sm text-gray-800">{student.address || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Birth Date & Age */}
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg mt-1">
                        <FaBirthdayCake className="text-purple-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Birth Date</p>
                        <p className="text-sm text-gray-800">
                          {formatDate(student.birth_date)}
                          {student.birth_date && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({calculateAge(student.birth_date)} years old)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    {student.bio && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium mb-2">Bio</p>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {student.bio}
                        </p>
                      </div>
                    )}
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

import React, { useEffect, useState } from 'react';
import { FaUsers, FaGraduationCap, FaBirthdayCake, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import Card from '../../../components/common/Card.jsx';
import Table from '../../../components/common/Table.jsx';
import Button from '../../../components/common/Button.jsx';

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

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const columns = [
    {
      header: "Student",
      accessor: "full_name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profile_picture ? (
            <img src={row.profile_picture} alt={row.full_name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {getInitials(row.full_name)}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.full_name}</p>
            <p className="text-xs text-gray-500">@{row.username}</p>
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      render: (row) => (
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400 text-xs" />
            <span>{row.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400 text-xs" />
            <span>{row.phone_number || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      header: "Location",
      accessor: "address",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaMapMarkerAlt className="text-gray-400 text-xs" />
          <span className="truncate max-w-xs">{row.address || 'N/A'}</span>
        </div>
      )
    },
    {
      header: "Age",
      accessor: "birth_date",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {calculateAge(row.birth_date)} years
        </span>
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <Button variant="secondary" className="text-xs py-1 px-2">View Profile</Button>
      )
    }
  ];

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircleLoader fullScreen={false} />
    </div>);
  if (error) return <div className="p-6 text-red-600 bg-red-50">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500">View and manage your students' information.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <FaUsers className="text-indigo-600 text-xl" />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FaGraduationCap className="text-green-600 text-xl" />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Age</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.length > 0
                  ? Math.round(students.reduce((sum, s) => sum + (calculateAge(s.birth_date) !== 'N/A' ? calculateAge(s.birth_date) : 0), 0) / students.filter(s => s.birth_date).length)
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FaBirthdayCake className="text-purple-600 text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card title="Student Directory">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <Table
          columns={columns}
          data={filteredStudents}
          emptyMessage="No students found matching your search."
        />
      </Card>
    </div>
  );
}

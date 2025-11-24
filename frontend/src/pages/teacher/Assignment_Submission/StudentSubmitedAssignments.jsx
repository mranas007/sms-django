import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaUser, FaCalendarAlt, FaBook, FaCheckCircle, FaClock, FaSearch, FaFilter, FaStar, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import BackBtn from '../../../components/BackBtn';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export default function StudentSubmittedAssignments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGraded, setFilterGraded] = useState('all'); // all, graded, ungraded
  const [sortBy, setSortBy] = useState('submittedDate'); // submittedDate, studentName, assignmentTitle
  const navigate = useNavigate();

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/teacher/assignments/submissions/');
      setSubmissions(res.data);
    } catch (error) {
      const msg = error.message || "Something went wrong!";
      setError(msg);
      console.error("Error fetching submissions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time since submission
  const getTimeSinceSubmission = (submittedDate) => {
    const now = new Date();
    const submitted = new Date(submittedDate);
    const diffTime = Math.abs(now - submitted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
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

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(submission => {
      // Filter by graded status
      if (filterGraded === 'graded' && !submission.grade) return false;
      if (filterGraded === 'ungraded' && submission.grade) return false;

      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          submission.student?.full_name?.toLowerCase().includes(search) ||
          submission.student?.username?.toLowerCase().includes(search) ||
          submission.assignment?.title?.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'submittedDate') {
        return new Date(b.submitted_at) - new Date(a.submitted_at);
      } else if (sortBy === 'studentName') {
        return (a.student?.full_name || '').localeCompare(b.student?.full_name || '');
      } else if (sortBy === 'assignmentTitle') {
        return (a.assignment?.title || '').localeCompare(b.assignment?.title || '');
      }
      return 0;
    });

  // Calculate stats
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter(s => s.grade !== null).length;
  const ungradedCount = submissions.filter(s => s.grade === null).length;
  const avgGrade = submissions.filter(s => s.grade !== null).length > 0
    ? (submissions.filter(s => s.grade !== null).reduce((sum, s) => sum + parseFloat(s.grade || 0), 0) / gradedCount).toFixed(2)
    : 0;

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircleLoader fullScreen={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <BackBtn />
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      header: 'Student',
      accessor: (submission) => (
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
            {getInitials(submission.student?.full_name)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{submission.student?.full_name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">@{submission.student?.username}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Assignment',
      accessor: (submission) => (
        <div>
          <p className="font-medium text-gray-900">{submission.assignment?.title || 'Unknown'}</p>
          <p className="text-xs text-gray-500">{submission.assignment?.subject?.name}</p>
        </div>
      )
    },
    {
      header: 'Submitted',
      accessor: (submission) => (
        <div>
          <p className="text-sm text-gray-900">{formatDate(submission.submitted_at)}</p>
          <p className="text-xs text-gray-500">{getTimeSinceSubmission(submission.submitted_at)}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (submission) => (
        <Badge variant={submission.grade !== null ? 'success' : 'warning'}>
          {submission.grade !== null ? `Graded: ${submission.grade}` : 'Pending Review'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (submission) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/teacher/assignment-submissions/${submission.id}`)}
        >
          View & Grade
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackBtn />

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <FaClipboardList className="text-indigo-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
            <p className="text-gray-500">Review and grade student assignments.</p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full">
                <FaClipboardList className="text-indigo-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Graded</p>
                <p className="text-2xl font-bold text-gray-900">{gradedCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{ungradedCount}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <FaClock className="text-orange-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{avgGrade || 'N/A'}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <FaStar className="text-blue-600 text-xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student or assignment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
              />
            </div>

            {/* Filter by Graded Status */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterGraded}
                onChange={(e) => setFilterGraded(e.target.value)}
                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
              >
                <option value="all">All Submissions</option>
                <option value="graded">Graded</option>
                <option value="ungraded">Pending Review</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
              >
                <option value="submittedDate">Sort by Submission Date</option>
                <option value="studentName">Sort by Student Name</option>
                <option value="assignmentTitle">Sort by Assignment</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Submissions List */}
        <Table
          headers={['Student', 'Assignment', 'Submitted', 'Status', 'Actions']}
          data={filteredSubmissions}
          columns={columns}
          emptyMessage="No submissions found matching your criteria."
        />
      </div>
    </div>
  );
}

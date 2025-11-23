import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaUser, FaCalendarAlt, FaBook, FaCheckCircle, FaClock, FaSearch, FaFilter, FaStar, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/Api';
import CircleLoader from '../../../components/CircleLoader';
import BackBtn from '../../../components/BackBtn';

export default function StudentSubmittedAssignments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGraded, setFilterGraded] = useState('all'); // all, graded, ungraded
  const [sortBy, setSortBy] = useState('submittedDate'); // submittedDate, studentName, assignmentTitle

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <CircleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <BackBtn />
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
    
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg mt-4 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="text-indigo-600 bg-white bg-opacity-20 p-4 rounded-lg">
                <FaClipboardList className="text-4xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Student Submissions</h1>
                <p className="text-indigo-100 text-lg mt-1">Review and grade student assignments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalSubmissions}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <FaClipboardList className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Graded</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{gradedCount}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{ungradedCount}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <FaClock className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Grade</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{avgGrade || 'N/A'}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaStar className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student or assignment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>

            {/* Filter by Graded Status */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterGraded}
                onChange={(e) => setFilterGraded(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white"
              >
                <option value="submittedDate">Sort by Submission Date</option>
                <option value="studentName">Sort by Student Name</option>
                <option value="assignmentTitle">Sort by Assignment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Submissions List</h3>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterGraded !== 'all'
                  ? 'No submissions found matching your criteria'
                  : 'No submissions yet'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || filterGraded !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Student submissions will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${submission.grade !== null
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                    }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Student & Assignment Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Student Avatar */}
                        <div className="bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {getInitials(submission.student?.full_name)}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          {/* Student Name & Status Badge */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">
                                {submission.student?.full_name || 'Unknown Student'}
                              </h4>
                              <p className="text-sm text-gray-600">@{submission.student?.username}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${submission.grade !== null
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {submission.grade !== null ? `Graded: ${submission.grade}` : 'Pending Review'}
                            </span>
                          </div>

                          {/* Assignment Title */}
                          <div className="flex items-center gap-2 mb-3">
                            <FaBook className="text-purple-500" />
                            <p className="font-semibold text-gray-700">
                              {submission.assignment?.title || 'Unknown Assignment'}
                            </p>
                          </div>

                          {/* Meta Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Submitted Date */}
                            <div className="flex items-center gap-2 text-sm">
                              <FaCalendarAlt className="text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="font-medium text-gray-700">
                                  {formatDate(submission.submitted_at)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getTimeSinceSubmission(submission.submitted_at)}
                                </p>
                              </div>
                            </div>

                            {/* Student Contact */}
                            <div className="flex items-center gap-2 text-sm">
                              <FaUser className="text-green-500" />
                              <div>
                                <p className="text-xs text-gray-500">Contact</p>
                                <p className="font-medium text-gray-700">
                                  {submission.student?.email || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Feedback Preview */}
                          {submission.feedback && (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-xs text-blue-600 font-semibold mb-1">Your Feedback:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link
                        to={`/teacher/assignment-submissions/${submission.id}`}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        View & Grade
                      </Link>
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

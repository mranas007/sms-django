// REACT HOOKS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES
import apiClient from "../../services/Api.jsx";

// COMPONENTS
import CircleLoader from '../../components/CircleLoader.jsx';
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { useAuthContext } from '../../context/AuthContext.jsx';
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

function StudentDashboard() {
  const { isAuthenticate } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classesRes, assignmentsRes] = await Promise.all([
        apiClient.get("/student/dashboard/"),
        apiClient.get("/student/assignments/")
      ]);
      setClasses(classesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
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

  // Calculate Stats
  const totalClasses = classes.length;
  const totalSubjects = classes.reduce((acc, cls) => acc + (cls.subjects?.length || 0), 0);

  // Filter Upcoming Deadlines
  const upcomingDeadlines = assignments
    .filter(a => {
      const isSubmitted = a.assignment_submissions && a.assignment_submissions.length > 0;
      const isFuture = new Date(a.due_date) > new Date();
      return !isSubmitted && isFuture;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircleLoader fullScreen={false} />
    </div>);
    
  if (error) return <div className="p-6 text-red-600 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
          <p className="text-gray-500">Welcome back! Here is your academic overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Enrolled Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
              </div>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
              </div>
            </Card>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
          {classes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">You are not enrolled in any classes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{cls.name}</h4>
                      <p className="text-sm text-gray-500">{cls.academic_year} • {cls.schedule}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cls.subjects.map((subject) => (
                        <Badge key={subject.id} variant="info">{subject.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Teachers: </span>
                      {cls.teachers.map(t => t.full_name).join(", ")}
                    </div>
                    <Button variant="secondary" className="text-xs" onClick={() => navigate('/student/class')}>View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Quick Actions & Deadlines */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/student/assignments')}>
                View Assignments
              </Button>
              {/* <Button variant="secondary" className="w-full justify-center" onClick={() => navigate('/student/grades')}>
                Check Grades
              </Button> */}
            </div>
          </Card>

          <Card title="Upcoming Deadlines">
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                <p>No upcoming deadlines.</p>
                <p className="text-xs mt-1">Great job! You're all caught up.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((assignment) => (
                  <div key={assignment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/student/assignment/${assignment.id}`)}>
                    <div className="bg-red-100 p-2 rounded-lg mt-1">
                      <FaCalendarAlt className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{assignment.title}</h4>
                      <p className="text-xs text-gray-500">{assignment.subject?.name}</p>
                      <p className="text-xs font-medium text-red-600 mt-1">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs" onClick={() => navigate('/student/assignments')}>
                  View All Assignments
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

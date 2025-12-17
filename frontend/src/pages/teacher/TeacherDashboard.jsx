
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

function TeacherDashboard() {
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

  // Calculate Stats
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((acc, cls) => acc + (cls.students?.length || 0), 0);

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircleLoader fullScreen={false} />
    </div>);

  if (error) return <div className="p-6 text-red-600 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
          <p className="text-gray-500">Overview of your academic activities.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/teacher/assignments/create')}>Create Assignment</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
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
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Quick Actions</p>
              <div className="flex gap-2 mt-1">
                <span className="text-sm text-indigo-600 cursor-pointer hover:underline" onClick={() => navigate('/teacher/assignments')}>View Assignments</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Classes Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Classes</h3>
        {classes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">You are not assigned to any classes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} title={cls.name} className="hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Year:</span>
                    <span className="font-medium text-gray-900">{cls.academic_year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="font-medium text-gray-900">{cls.schedule}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {cls.subjects.map((subject) => (
                        <Badge key={subject.id} variant="info">{subject.name}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Students ({cls.students?.length || 0})</p>
                    <div className="flex -space-x-2 overflow-hidden">
                      {cls.students.slice(0, 5).map((student, i) => (
                        <div key={student.id || i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600" title={student.full_name}>
                          {student.full_name ? student.full_name.charAt(0) : 'S'}
                        </div>
                      ))}
                      {cls.students.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          +{cls.students.length - 5}
                        </div>
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

export default TeacherDashboard;
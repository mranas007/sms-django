// REACT HOOKS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES
import apiClient from "../../services/Api.jsx";

// COMPONENTS
import CircleLoader from '../../components/CircleLoader.jsx'

// CONTEXT
import { useAuthContext } from '../../context/AuthContext.jsx';



function StudentDashboard() {
  const { isAuthenticate } = useAuthContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const checkAuth = async () => {
    const isAuth = await isAuthenticate();
    if (!isAuth) {
      navigate("/login");
    } else {
      console.log("User is authenticated");
    }
  }

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/student/dashboard/");
      // console.log("Fetched data:", res.data);
      setClasses(res.data); // assuming res.data is an array of classes
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
    // checkAuth();

  }, []);

  if (loading) return <div className="h-screen w-full">
    <CircleLoader />
  </div>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <h2 className="text-3xl font-bold mb-4">
        Welcome to the School Management System
      </h2>
      <p className="text-lg mb-4">Manage students and more with ease.</p>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Classes</h3>
        {classes.length === 0 ? (
          <p>No classes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-gray-100 p-4 rounded shadow-sm">
                <h4 className="text-lg font-bold mb-1">{cls.name}</h4>
                <p className="text-sm text-gray-600">Academic Year: {cls.academic_year}</p>
                <p className="text-sm text-gray-600">Schedule: {cls.schedule}</p>
                <div className="mt-2">
                  <h5 className="text-md font-semibold">Subjects:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {cls.subjects.map((subject) => (
                      <li key={subject.id}>{subject.name} ({subject.code})</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <h5 className="text-md font-semibold">Teachers:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {cls.teachers.map((teacher) => (
                      <li key={teacher.id}>{teacher.full_name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </>
  );
}

export default StudentDashboard;

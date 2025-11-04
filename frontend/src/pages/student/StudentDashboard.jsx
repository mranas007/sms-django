// REACT HOOKS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SERVICES
import Api from "../../services/Api.jsx";

// COMPONENTS
import {useAuthContext} from '../../context/AuthContext.jsx';



function StudentDashboard() {
  const {isAuthenticate}= useAuthContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);


  useEffect(() => {

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
        const res = await Api.get("/student/dashboard/");
        // console.log("Fetched data:", res.data);
        setStudents(res.data); // assuming res.data is an array
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

    fetchData();
    checkAuth();
  }, []);

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <h2 className="text-3xl font-bold mb-4">
        Welcome to the School Management System
      </h2>
      <p className="text-lg mb-4">Manage students and more with ease.</p>

      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Student List</h3>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul className="list-disc ml-6">
            {students.map((std) => (
              <li key={std.id} className="mb-1">
                <strong>{std.full_name || std.username}</strong> — {std.role}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;

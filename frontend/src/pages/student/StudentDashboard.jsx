import React, { useState, useEffect } from "react";
import Api from '../../services/Api.jsx'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";

function StudentDashboard(){
    const { token } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!token) {
        navigate("/login");
      } else {
        fetchData();
      }
    }, [token, navigate]);

    // fetch data from backend for student dashboard
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Api.get('/student/dashboard/');
        console.log(res.data);
      } catch (error) {
        console.log("Something went wrong during student data fetch: ", error.message);
        setError(error.response?.data?.message || "Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return(
        <>
        <h2 className="text-3xl font-bold mb-4">Welcome to the School Management System</h2>
        <p className="text-lg">Manage students and more with ease.</p>
      </>
    )
}

export default  StudentDashboard
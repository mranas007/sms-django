import React, { useState } from 'react';
import InputField from '../../components/InputField.jsx';
import Api from '../../services/Api.jsx'
import { useNavigate } from "react-router-dom";
import Btn from '../../components/Btn.jsx';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants.js';



function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {

      const res = await Api.post('/account/token/', formData);
      // console.log(res.data);
      localStorage.setItem(ACCESS_TOKEN, res.data.access)
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
      setSuccess(true);
      if (res.data.user.role === "Admin") {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === "Teacher") {
        navigate('/teacher/dashboard');
      } else if (res.data.user.role === "Student") {
        navigate('/student/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMsg = error.response ?
        error.response.data.message || "Login failed. Please try again." :
        "Network error. Check your internet connection.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-8 py-6 sm:w-[390px] bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center mt-2">Login successful!</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <InputField
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="mt-4">
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <Btn
                type="submit"
                text={loading ? 'Processing...' : 'Login'}
                className="w-full mt-3 text-center"
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
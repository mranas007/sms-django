// REACT HOOKS
import { React, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

// SERVICES
import Api from '../../services/Api.jsx'

// CUSTOM CONTEXT
import { useAuthContext } from '../../context/AuthContext.jsx';

// COMPONENTS
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import InputField from '../../components/InputField.jsx';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { setAccessToken, setRefreshToken } = useAuthContext();
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

      const res = await Api.post('/account/login/', formData);
      setAccessToken(res.data.access)
      setRefreshToken(res.data.refresh)
      setSuccess(true);

      switch (res.data.user.role) {
        case "Student":
          navigate('/student/dashboard');
          break;
        case "Teacher":
          navigate('/teacher/dashboard');
          break;
        case "Admin":
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
          break;
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access your account</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-indigo-600">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              <p className="font-medium">Login Failed</p>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
              <p className="font-medium">Success</p>
              <p>Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5 text-base"
              disabled={loading}
              icon={<FaSignInAlt />}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                Contact Administrator
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} School Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;
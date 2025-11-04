// REACT HOOKS
import { React, useState } from 'react';
import { useNavigate } from "react-router-dom";

// SERVICES
import Api from '../../services/Api.jsx'

// CUSTOME CONTEXT
import { useAuthContext } from '../../context/AuthContext.jsx';

// COMPONENTS
import ErrorMsg from '../../components/ErrorMsg.jsx';
import Btn from '../../components/Btn.jsx';
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
      
      switch(res.data.user.role){
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
          navigate('/home');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 sm:w-[390px] bg-white shadow-lg rounded-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-center text-indigo-700">Login to your account</h3>
        {error && <ErrorMsg error={error} /> }
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
                className="w-full mt-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
import {React, useState } from 'react';
import { useNavigate } from "react-router-dom";
import InputField from '../../components/InputField';
import Btn from '../../components/Btn';
import Api from '../../services/Api.jsx'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone_number: '',
    address: '',
    bio: '',
    birth_date: '',
    role: '',
    password: '',
    cpassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // ✅ Call hook at top level

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic client-side validation
    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post(
        '/account/register/',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        console.log('Registration successful:', response.data);
        navigate('/login'); // ✅ Use navigate function
        // Optionally reset form or redirect
        setFormData({
          username: '',
          full_name: '',
          phone_number: '',
          address: '',
          bio: '',
          birth_date: '',
          role: 'Student',
          password: '',
          cpassword: '',
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
      console.error('Registration error:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-6 my-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800">Register for an account</h3>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded px-3 py-2">
            Registration successful! You can now log in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <InputField
            label="Username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <InputField
            label="Full Name"
            name="full_name"
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Phone Number"
            name="phone_number"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <InputField
            label="Address"
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <InputField
            label="Bio"
            name="bio"
            type="textarea"
            placeholder="Tell us a little about yourself"
            value={formData.bio}
            onChange={handleChange}
          />
          <InputField
            label="Birth Date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />

          <div>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            > 
              <option value="">--- Select User Role ---</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <InputField
            label="Confirm Password"
            name="cpassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.cpassword}
            onChange={handleChange}
            required
          />

          <Btn
            type="submit"
            text={loading ? 'Processing...' : 'Register'}
            className="w-full mt-3 text-center"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
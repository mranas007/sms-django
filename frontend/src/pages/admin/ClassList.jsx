import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Api from '../../services/Api.jsx';
import CircleLoader from '../../components/CircleLoader.jsx';
import ErrorMsg from '../../components/ErrorMsg.jsx';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
    //   const response = await Api.get('/admin/class/');
      setClasses(response.data);
    } catch (err) {
      setError('Failed to fetch classes.');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await Api.delete(`/admin/class/${classId}/`);
        setClasses(classes.filter((cls) => cls.id !== classId));
      } catch (err) {
        setError('Failed to delete class.');
        console.error('Error deleting class:', err);
      }
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.academic_year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <CircleLoader />;
  }

  if (error) {
    return <ErrorMsg message={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Class List</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search classes..."
          className="p-2 border border-gray-300 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/admin/add/class"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Class
        </Link>
      </div>

      {filteredClasses.length === 0 ? (
        <p className="text-gray-600">No classes found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.academic_year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.schedule}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.students.map(s => s.username).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.teachers.map(t => t.username).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.subjects.map(sub => sub.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/class/edit/${cls.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDelete(cls.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import Api from '../../../services/Api.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';
import ErrorMsg from '../../../components/ErrorMsg.jsx';
import BackBtn from '../../../components/BackBtn'


export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchSubjects = async () => {
        try {
            const res = await Api.get('/admin/subjects/');
            // console.log(res.data);
            setSubjects(res.data || []);
        } catch (err) {
            setError('Failed to fetch subjects.');
            console.error('Error fetching subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);


    const handleDelete = async (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await Api.delete('/admin/subject/' + subjectId);
                setSubjects(subjects.filter((subject) => subject.id !== subjectId));
            } catch (err) {
                setError('Failed to delete subject.');
                console.error('Error deleting subject:', err);
            }
        }
    };

    const filteredSubjects = Array.isArray(subjects) ? subjects.filter(
        (subject) =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (loading) {
        return <div className="h-screen w-full flex">
            <CircleLoader fullScreen={false} />;
        </div>
    }

    if (error) {
        return <ErrorMsg message={error} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Subject Management</h1>
                        <p className="text-gray-600">Manage your school subjects</p>
                    </div>
                    <div>
                        <BackBtn />
                    </div>
                </div>

                {/* Search and Add Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full md:w-auto">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by subject name or code..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            to="/admin/add/subject"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            <FaPlus /> Add New Subject
                        </Link>
                    </div>
                </div>

                {/* Subjects List */}
                {filteredSubjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <FaBook className="text-gray-300 text-6xl mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No subjects found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new subject</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSubjects.map((subject) => (
                                    <tr key={subject.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/admin/subject/${subject.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <FaEdit className="inline-block mr-1" /> Edit
                                            </Link>
                                            <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900">
                                                <FaTrash className="inline-block mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

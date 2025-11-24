import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTimes, FaChevronDown, FaSearch, FaEdit } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';

// SERVICES & UTILS
import apiClient from '../../../services/Api';

// COMPONENTS
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import InputField from '../../../components/common/InputField.jsx';
import CircleLoader from '../../../components/CircleLoader.jsx';

// Reusable Multi-Select Component (same as AddClass)
const MultiSelectDropdown = ({
  label,
  options = [],
  selected = [],
  onChange = () => { },
  onSearch = null,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(async () => {
      setLoading(true);
      await onSearch(searchTerm);
      setLoading(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const filteredOptions = options.filter((option) => {
    const search = searchTerm.toLowerCase();
    return (
      option.username?.toLowerCase().includes(search) ||
      option.name?.toLowerCase().includes(search)
    );
  });

  const toggleOption = (optionId) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((id) => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  const removeItem = (optionId, e) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== optionId));
  };

  const getDisplayName = (option) => option.username || option.name || 'Unknown';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selected.length === 0 ? (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          ) : (
            selected.map(id => {
              const option = options.find(opt => opt.id === id);
              return option ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-medium"
                >
                  {getDisplayName(option)}
                  <button
                    onClick={(e) => removeItem(id, e)}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <FaTimes size={14} />
                  </button>
                </span>
              ) : null;
            })
          )}
          <FaChevronDown
            size={16}
            className={`ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <FaSearch size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {getDisplayName(option)}
                  </span>
                </label>
              ))
            )}
          </div>

          {filteredOptions.length > 0 && (
            <div className="border-t border-gray-200 p-2 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(filteredOptions.map(opt => opt.id));
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EditClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      subjects: [],
      teachers: [],
      students: [],
      academic_year: '',
      schedule: ''
    }
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const mergeOptions = (existingOptions, newOptions) => {
    const existingIds = new Set(existingOptions.map(o => o.id));
    const uniqueNewOptions = newOptions.filter(o => !existingIds.has(o.id));
    return [...existingOptions, ...uniqueNewOptions];
  };

  const getStudents = async (search = '') => {
    try {
      const res = await apiClient.get(`admin/users/?role=Student&search=${search}`);
      if (res.status === 200) setAvailableStudents(res.data.results);
      else setAvailableStudents([]);
    } catch (err) {
      console.error('Error fetching students:', err.message);
    }
  };

  const getTeachers = async (search = '') => {
    try {
      const res = await apiClient.get(`admin/users/?role=Teacher&search=${search}`);
      if (res.status === 200) setAvailableTeachers(res.data.results);
      else setAvailableTeachers([]);
    } catch (err) {
      console.error('Error fetching teachers:', err.message);
    }
  };

  const getSubjects = async () => {
    try {
      const res = await apiClient.get('admin/subjects/');
      if (res.status === 200) {
        const subjectsData = Array.isArray(res.data) ? res.data : res.data.results;
        setAvailableSubjects(subjectsData || []);
      } else {
        setAvailableSubjects([]);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err.message);
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      try {
        await getStudents();
        await getTeachers();
        await getSubjects();

        const res = await apiClient.get(`admin/class/${id}/`);
        if (res.status === 200) {
          const classData = res.data;

          reset({
            name: classData.name,
            academic_year: classData.academic_year,
            schedule: classData.schedule,
            students: classData.students.map(s => s.id),
            teachers: classData.teachers.map(t => t.id),
            subjects: classData.subjects.map(s => s.id),
          });

          setAvailableStudents(prev => mergeOptions(prev, classData.students));
          setAvailableTeachers(prev => mergeOptions(prev, classData.teachers));
          setAvailableSubjects(prev => mergeOptions(prev, classData.subjects));
        }
      } catch (err) {
        setError('Failed to load class data.');
        console.error('Failed to load class data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiClient.put(`admin/class/${id}/`, data);
      if (res.status === 200) {
        setSuccess('Class updated successfully!');
        setTimeout(() => navigate('/admin/classes'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update class.');
      console.error('Failed to update class:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <CircleLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Class</h1>
            <p className="text-gray-600">Update class information and assignments</p>
          </div>
          <Link to="/admin/classes">
            <Button variant="secondary">Back to Classes</Button>
          </Link>
        </div>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Success/Error Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <strong className="font-semibold">Error: </strong>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <strong className="font-semibold">Success! </strong>
                <span>{success} Redirecting...</span>
              </div>
            )}

            <div className="space-y-6">
              <InputField
                label="Class Name"
                id="className"
                type="text"
                register={register('name', { required: 'Class Name is required' })}
                error={errors.name?.message}
                placeholder="e.g., Grade 10-A"
                required
              />

              <Controller
                name="students"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    label="Students"
                    options={availableStudents || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    onSearch={getStudents}
                    placeholder="Search and select students..."
                  />
                )}
              />

              <Controller
                name="teachers"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    label="Teachers"
                    options={availableTeachers || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    onSearch={getTeachers}
                    placeholder="Search and select teachers..."
                  />
                )}
              />

              <Controller
                name="subjects"
                control={control}
                render={({ field }) => (
                  <MultiSelectDropdown
                    label="Subjects"
                    options={availableSubjects || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select subjects..."
                  />
                )}
              />

              <InputField
                label="Academic Year"
                id="academicYear"
                type="text"
                register={register('academic_year', { required: 'Academic Year is required' })}
                error={errors.academic_year?.message}
                placeholder="e.g., 2024-2025"
                required
              />

              <InputField
                label="Schedule"
                id="schedule"
                type="text"
                register={register('schedule', { required: 'Schedule is required' })}
                error={errors.schedule?.message}
                placeholder="e.g., Mon/Wed 10:00-11:00"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Link to="/admin/classes">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                icon={<FaEdit />}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Class'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditClass;
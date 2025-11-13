import React, { useState, useEffect, useRef } from 'react';
// ✅ Added useParams to get the class ID from the URL
import { useParams } from 'react-router-dom'; 
import { FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import BackBtn from '../../../components/BackBtn';
import apiClient from '../../../services/Api';
import { useForm, Controller } from 'react-hook-form';
import SuccessMsg from '../../../components/SuccessMsg';

// Reusable Multi-Select Component (Copied as-is from your code)
const MultiSelectDropdown = ({
  label,
  options = [],
  selected = [],
  onChange = () => { },
  onSearch = null, // <-- for API search
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced API search (if onSearch is provided)
  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(async () => {
      setLoading(true);
      await onSearch(searchTerm);
      setLoading(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Local filtering of options based on searchTerm
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
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            size={20}
            className={`ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <FaSearch size={18} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Searching...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found
              </div>
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

// ✅ Renamed to EditClass
const EditClass = () => {
  // ✅ Get the class ID from the URL
  const { id } = useParams(); 

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    // Default values are still empty, we will populate them via useEffect
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
  const [loading, setLoading] = useState(true); // ✅ For loading the class data

  // Helper function to merge existing dropdown options with selected options
  // This ensures selected items are always in the list, even if not on page 1
  const mergeOptions = (existingOptions, newOptions) => {
    const existingIds = new Set(existingOptions.map(o => o.id));
    const uniqueNewOptions = newOptions.filter(o => !existingIds.has(o.id));
    return [...existingOptions, ...uniqueNewOptions];
  };

  // Fetch students with search (same as AddClass)
  const getStudents = async (search = '') => {
    try {
      const res = await apiClient.get(`admin/users/?role=Student&search=${search}`);
      if (res.status === 200) setAvailableStudents(res.data.results);
      else setAvailableStudents([]);
    } catch (err) {
      console.error('Error fetching students:', err.message);
    }
  };

  // Fetch teachers with search (same as AddClass)
  const getTeachers = async (search = '') => {
    try {
      const res = await apiClient.get(`admin/users/?role=Teacher&search=${search}`);
      if (res.status === 200) setAvailableTeachers(res.data.results);
      else setAvailableTeachers([]);
    } catch (err) {
      console.error('Error fetching teachers:', err.message);
    }
  };

  // Fetch subjects (same as AddClass)
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

  // ✅ NEW: useEffect to fetch and populate existing class data
  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all the dropdown options
        await getStudents();
        await getTeachers();
        await getSubjects();

        // 2. Fetch the specific class data
        const res = await apiClient.get(`admin/class/${id}/`);
        if (res.status === 200) {
          const classData = res.data;

          // 3. Populate the form with the fetched data
          // We map the arrays of objects to arrays of IDs for the multiselect
          reset({
            name: classData.name,
            academic_year: classData.academic_year,
            schedule: classData.schedule,
            students: classData.students.map(s => s.id),
            teachers: classData.teachers.map(t => t.id),
            subjects: classData.subjects.map(s => s.id),
          });

          // 4. Ensure selected items are in the available options lists
          // This allows the dropdown to display their names correctly
          setAvailableStudents(prev => mergeOptions(prev, classData.students));
          setAvailableTeachers(prev => mergeOptions(prev, classData.teachers));
          setAvailableSubjects(prev => mergeOptions(prev, classData.subjects));
        }
      } catch (err) {
        console.error('Failed to load class data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
    // We only want this to run once on load, or if the ID/reset function changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reset]);


  // ✅ Form submit handler (changed to PUT for update)
  const onSubmit = async (data) => {
    try {
      // ✅ Use PUT request with the class ID
      const res = await apiClient.put(`admin/class/${id}/`, data);
      
      // ✅ PUT usually returns 200 OK
      if (res.status === 200) { 
        setSuccess('Class updated successfully!');
        // ✅ Don't clear the form, just re-set it with the new data
        reset(data); 
      }
    } catch (err) {
      console.error('Failed to update class:', err.message);
    }
  };

  // ✅ Show loading spinner while fetching class data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 sm:p-8 flex items-center justify-center">
        <p>Loading class data...</p> {/* You can replace this with a spinner component */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 sm:p-8">
      <BackBtn />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        {/* ✅ Changed Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Class</h1>
        {success && (
          <SuccessMsg success={success} />
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* All form fields are identical to AddClass */}

          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              {...register('name', { required: 'Class Name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Grade 10-A"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Students Dropdown */}
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

          {/* Teachers Dropdown */}
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

          {/* Subjects Dropdown */}
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

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              id="academicYear"
              {...register('academic_year', { required: 'Academic Year is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 2024-2025"
            />
            {errors.academic_year && <p className="text-red-500 text-xs mt-1">{errors.academic_year.message}</p>}
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule
            </label>
            <input
              type="text"
              id="schedule"
              {...register('schedule', { required: 'Schedule is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Mon/Wed 10:00-11:00"
            />
            {errors.schedule && <p className="text-red-500 text-xs mt-1">{errors.schedule.message}</p>}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {/* ✅ Changed Button Text */}
              Update Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Export EditClass
export default EditClass;
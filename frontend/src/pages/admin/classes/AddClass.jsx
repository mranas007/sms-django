import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import BackBtn from '../../../components/BackBtn'; 

// Reusable Multi-Select Component
const MultiSelectDropdown = ({ label, options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection
  const toggleOption = (optionId) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter(id => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  // Remove a selected item
  const removeItem = (optionId, e) => {
    e.stopPropagation();
    onChange(selected.filter(id => id !== optionId));
  };

  // Get display name for option
  const getDisplayName = (option) => option.username || option.name || 'Unknown';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {/* Selected items display */}
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

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
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

          {/* Options list */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
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

          {/* Select/Clear all buttons */}
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

// Demo Component
const AddClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subjects: [],
    teachers: [],
    students: [],
    academic_year: '',
    schedule: ''
  });

  const availableStudents = [
    { id: 1, username: 'John Doe' },
    { id: 2, username: 'Jane Smith' },
    { id: 3, username: 'Alice Johnson' },
    { id: 4, username: 'Bob Williams' },
    { id: 5, username: 'Charlie Brown' },
    { id: 6, username: 'Diana Prince' },
    { id: 7, username: 'Ethan Hunt' }
  ];

  const availableTeachers = [
    { id: 1, username: 'Prof. Anderson' },
    { id: 2, username: 'Dr. Martinez' },
    { id: 3, username: 'Ms. Taylor' },
    { id: 4, username: 'Mr. Johnson' }
  ];

  const availableSubjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'English' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Physics' },
    { id: 6, name: 'Chemistry' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData({ ...formData, [name]: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Class created successfully! Check console for data.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BackBtn/>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Class</h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Grade 10-A"
            />
          </div>

          <MultiSelectDropdown
            label="Students"
            options={availableStudents}
            selected={formData.students}
            onChange={(values) => handleMultiSelectChange('students', values)}
            placeholder="Select students..."
          />

          <MultiSelectDropdown
            label="Teachers"
            options={availableTeachers}
            selected={formData.teachers}
            onChange={(values) => handleMultiSelectChange('teachers', values)}
            placeholder="Select teachers..."
          />

          <MultiSelectDropdown
            label="Subjects"
            options={availableSubjects}
            selected={formData.subjects}
            onChange={(values) => handleMultiSelectChange('subjects', values)}
            placeholder="Select subjects..."
          />

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              id="academicYear"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 2024-2025"
            />
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Mon/Wed 10:00-11:00"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClass;







// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Api from '../../services/Api.jsx';

// const AddClass = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     subjects: [],
//     teachers: [],
//     students: [],
//     academic_year: '',
//     schedule: ''
//   });
//   const [availableStudents, setAvailableStudents] = useState([]);
//   const [availableTeachers, setAvailableTeachers] = useState([]);
//   const [availableSubjects, setAvailableSubjects] = useState([]);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const studentsRes = await Api.get('/admin/get/students/');
//         setAvailableStudents(studentsRes.data);
//         const teachersRes = await Api.get('admin/get/teachers/');
//         setAvailableTeachers(teachersRes.data);
//         const subjectsRes = await Api.get('/admin/get/subjects/');
//         setAvailableSubjects(subjectsRes.data)
//       } catch (error) {
//         console.error("Error fetching options for class creation:", error);
//       }
//     };
//     fetchOptions();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, options, type } = e.target;
//     if (type === 'select-multiple') {
//       const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
//       setFormData({ ...formData, [name]: selectedValues });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log(formData);
//       await Api.post('/admin/class/',formData);
//       navigate('/admin/dashboard');
//     } catch (error) {
//       console.error("Error creating class:", error);
//       // Handle error, show error message
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Class</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="className" className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               id="className"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="students" className="block text-sm font-medium text-gray-700">Students</label>
//             <select
//               name="students"
//               id="students"
//               multiple
//               value={formData.students}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             >
//               <option value="">Select students</option>
//               {availableStudents.map((student) => (
//                 <option key={student.id} value={student.id}>{student.username}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="teachers" className="block text-sm font-medium text-gray-700">Teachers</label>
//             <select
//               name="teachers"
//               id="teachers"
//               multiple
//               value={formData.teachers}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             >
//               <option value="">Select teachers</option>
//               {availableTeachers.map((teacher) => (
//                 <option key={teacher.id} value={teacher.id}>{teacher.username}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects</label>
//             <select
//               name="subjects"
//               id="subjects"
//               multiple
//               value={formData.subjects}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             >
//               <option value="">Select subjects</option>
//               {availableSubjects.map((subject) => (
//                 <option key={subject.id} value={subject.id}>{subject.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">Academic Year (e.g., 2024-2025)</label>
//             <input
//               type="text"
//               id="academicYear"
//               name="academic_year"
//               value={formData.academic_year}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule (e.g., Mon/Wed 10:00-11:00)</label>
//             <input
//               type="text"
//               id="schedule"
//               name="schedule"
//               value={formData.schedule}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               required
//             />
//           </div>
//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="button"
//               onClick={() => navigate('/admin/dashboard')}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Create Class
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddClass;
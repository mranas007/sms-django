import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaUniversity,
  FaBell,
  FaSignInAlt,
  FaLaptopCode,
  FaBookOpen
} from 'react-icons/fa';
import Button from '../../components/common/Button';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-800 opacity-30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900 opacity-30 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-800 bg-opacity-50 border border-indigo-700 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sm font-medium text-indigo-100">Academic Portal Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Excellence Institute</span> Digital Campus
              </h1>

              <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Your central hub for academic management, student resources, and faculty collaboration. Access your dashboard to manage classes, assignments, and grades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  variant="primary"
                  className="px-8 py-4 text-lg shadow-lg shadow-indigo-900/50"
                  onClick={() => navigate('/login')}
                  icon={<FaSignInAlt />}
                >
                  Login to Portal
                </Button>
                <Button
                  variant="secondary"
                  className="px-8 py-4 text-lg bg-transparent border-2 border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white hover:border-indigo-300"
                  onClick={() => navigate('/about')}
                  icon={<FaUniversity className="text-xs" />}
                >
                  About Institute
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-indigo-800/50">
                <div>
                  <p className="text-3xl font-bold text-white">25+</p>
                  <p className="text-indigo-300 text-sm font-medium uppercase tracking-wide">Departments</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">5000+</p>
                  <p className="text-indigo-300 text-sm font-medium uppercase tracking-wide">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">200+</p>
                  <p className="text-indigo-300 text-sm font-medium uppercase tracking-wide">Faculty</p>
                </div>
              </div>
            </div>

            {/* Right Content - Campus/Portal Image Placeholder */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-700/50 bg-indigo-900/50 backdrop-blur-sm transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                {/* Mockup Header */}
                <div className="bg-gray-900/80 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-400 w-64">portal.institute.edu</div>
                </div>
                {/* Mockup Content - Simplified Portal View */}
                <div className="p-6 bg-gray-50/95 h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-32 bg-indigo-200 rounded"></div>
                    <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-24 bg-white rounded shadow-sm border border-gray-100 p-3">
                      <div className="h-6 w-6 bg-blue-100 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded shadow-sm border border-gray-100 p-3">
                      <div className="h-6 w-6 bg-green-100 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded shadow-sm border border-gray-100 p-4">
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-8 w-full bg-gray-50 rounded"></div>
                      <div className="h-8 w-full bg-gray-50 rounded"></div>
                      <div className="h-8 w-full bg-gray-50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Campus Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Academic Resources & Tools
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to manage your academic journey at Excellence Institute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Service Cards */}
            {[
              { icon: FaUserGraduate, color: 'indigo', title: 'Student Portal', desc: 'Access course materials, view grades, and submit assignments online.' },
              { icon: FaChalkboardTeacher, color: 'blue', title: 'Faculty Access', desc: 'Manage classes, attendance, and grading with advanced tools.' },
              { icon: FaBook, color: 'purple', title: 'Course Catalog', desc: 'Browse available courses, syllabi, and academic requirements.' },
              { icon: FaCalendarAlt, color: 'green', title: 'Academic Calendar', desc: 'Stay updated with exam schedules, holidays, and important dates.' },
              { icon: FaBookOpen, color: 'yellow', title: 'Digital Library', desc: 'Access research papers, e-books, and academic journals.' },
              { icon: FaBell, color: 'red', title: 'Notices & News', desc: 'Get the latest announcements and campus news instantly.' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className={`inline-flex items-center justify-center p-3 bg-${feature.color}-50 rounded-lg group-hover:bg-${feature.color}-100 transition-colors`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links / Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 text-white flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Need Assistance?</h2>
                <p className="text-indigo-100 mb-8 text-lg">
                  If you are having trouble accessing your account or need technical support, please contact the IT Helpdesk.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="secondary"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 border-none"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
              <div className="bg-indigo-800 p-10 flex flex-col justify-center border-l border-indigo-600">
                <h3 className="text-xl font-bold text-white mb-6">Latest Announcements</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <FaBell className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Final Exam Schedule Released</p>
                      <p className="text-indigo-200 text-sm">Check the academic calendar for details.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaLaptopCode className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">System Maintenance</p>
                      <p className="text-indigo-200 text-sm">Scheduled for this Saturday, 10 PM - 2 AM.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
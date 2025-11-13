import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBell,
  FaCheckCircle,
  FaArrowRight,
  FaGraduationCap,
  FaClipboardList,
  FaMobile,
  FaShieldAlt,
  FaStar
} from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="bg-white bg-opacity-20 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  🎓 Modern Education Management
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Transform Your School
                <span className="block text-purple-200">Into a Digital Hub</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-indigo-100">
                Streamline administrative tasks, enhance communication, and create an exceptional learning environment with our all-in-one school management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  Get Started <FaArrowRight />
                </Link>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-indigo-200 text-sm">Schools</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-indigo-200 text-sm">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-indigo-200 text-sm">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Preview Card */}
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <FaCheckCircle className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-indigo-600">Real-time Updates</p>
                      <p className="text-sm text-indigo-600">Stay connected 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <FaShieldAlt className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-indigo-600">Secure & Reliable</p>
                      <p className="text-sm text-indigo-600">Enterprise-grade security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <FaMobile className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-indigo-600">Mobile Friendly</p>
                      <p className="text-sm text-indigo-600">Access anywhere, anytime</p>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to simplify school management and enhance the educational experience for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-indigo-500">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="text-indigo-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Student Management</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive student profiles, attendance tracking, grade management, and performance analytics all in one place.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Enrollment & Records
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Attendance Tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Grade Reports
                </li>
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-blue-500">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaChalkboardTeacher className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Teacher Portal</h3>
              <p className="text-gray-600 mb-4">
                Empower educators with intuitive tools for lesson planning, grading, and seamless communication with students and parents.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Lesson Planning
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Assignment Management
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Communication Hub
                </li>
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-purple-500">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaBook className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Class & Subject Organization</h3>
              <p className="text-gray-600 mb-4">
                Efficiently organize classes, subjects, schedules, and academic calendars with smart automation and easy management.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Class Scheduling
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Subject Assignment
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Timetable Generation
                </li>
              </ul>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-green-500">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaCalendarAlt className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Automated timetable generation, event management, and calendar integration to keep everyone on the same page.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Auto Timetables
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Event Planning
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Calendar Sync
                </li>
              </ul>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-yellow-500">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaChartLine className="text-yellow-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600 mb-4">
                Gain valuable insights with comprehensive reports, performance analytics, and data-driven decision-making tools.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Performance Metrics
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Custom Reports
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Data Visualization
                </li>
              </ul>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-red-500">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FaBell className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Notifications</h3>
              <p className="text-gray-600 mb-4">
                Keep everyone informed with real-time notifications for announcements, updates, and important events.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Push Notifications
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> Email Alerts
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-500" /> SMS Integration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Why Schools Choose Django SMS
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of educational institutions that have transformed their operations with our comprehensive solution.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <FaGraduationCap className="text-indigo-600 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Improved Learning Outcomes</h4>
                    <p className="text-gray-600">Better organization and communication lead to enhanced student performance and engagement.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <FaClipboardList className="text-blue-600 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Save Time & Resources</h4>
                    <p className="text-gray-600">Automate administrative tasks and reduce paperwork, freeing up time for what matters most.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <FaStar className="text-green-600 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Enhanced Collaboration</h4>
                    <p className="text-gray-600">Foster better communication between teachers, students, parents, and administrators.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image or Stats */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Trusted by Educators Worldwide</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-4xl text-indigo-600 font-bold mb-2">99.9%</p>
                    <p className="text-sm text-indigo-600">Uptime Guarantee</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-4xl text-indigo-600 font-bold mb-2">24/7</p>
                    <p className="text-sm text-indigo-600">Support Available</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-4xl text-indigo-600 font-bold mb-2">500+</p>
                    <p className="text-sm text-indigo-600">Active Schools</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-4xl text-indigo-600 font-bold mb-2">4.9★</p>
                    <p className="text-sm text-indigo-600">User Rating</p>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-indigo-100">
            Join hundreds of educational institutions already benefiting from our comprehensive management solution. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Sign In Now <FaArrowRight />
            </Link>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              Schedule Demo
            </button>
          </div>
          
          <p className="mt-8 text-sm text-indigo-200">
            No credit card required • Free 30-day trial • Cancel anytime
          </p>
        </div>
      </section>

    </div>
  );
}

export default Home;
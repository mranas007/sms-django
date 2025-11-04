import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="School background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Welcome to Our School Management System
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Streamline administrative tasks, enhance communication, and foster a better learning environment.
          </p>
          <Link
            to="/login"
            className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-md text-lg font-semibold transition duration-300 ease-in-out"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Student Management</h3>
              <p className="text-gray-600">Manage student information, attendance, grades, and more with ease.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Teacher Portal</h3>
              <p className="text-gray-600">Empower teachers with tools for lesson planning, grading, and communication.</p>
            
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Class & Subject Organization</h3>
              <p className="text-gray-600">Efficiently organize classes, subjects, and academic schedules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            Join countless educational institutions benefiting from our comprehensive management solution.
          </p>
          <Link
            to="/login"
            className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-md text-lg font-semibold transition duration-300 ease-in-out"
          >
            Sign In Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

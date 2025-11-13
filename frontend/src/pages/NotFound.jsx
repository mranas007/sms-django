// REACT HOOKS
import { React } from 'react';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  function goBack() {
    window.history.back();
  }

  function goHome() {
    window.location.href = '/';
  }

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          {/* Icon with background */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-8 rounded-full shadow-xl">
              <FaExclamationTriangle className="text-white text-6xl" />
            </div>
          </div>

          {/* Big 404 heading with gradient */}
          <h1 className="mb-4 text-8xl tracking-tight font-extrabold lg:text-9xl bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
            404
          </h1>

          {/* Main message */}
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-800 md:text-4xl">
            Oops! Page Not Found
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-600">
            The page you're looking for seems to have wandered off. 
            Don't worry, let's get you back on track!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goBack}
              className="inline-flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 
                         focus:ring-4 focus:outline-none focus:ring-indigo-300 font-semibold rounded-lg 
                         text-sm px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
            >
              <FaArrowLeft /> Go Back
            </button>
            
            <button
              onClick={goHome}
              className="inline-flex items-center justify-center gap-2 text-indigo-600 bg-white hover:bg-gray-50 
                         border-2 border-indigo-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 
                         font-semibold rounded-lg text-sm px-6 py-3 shadow-md hover:shadow-lg 
                         transition-all duration-200 ease-in-out"
            >
              <FaHome /> Home Page
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
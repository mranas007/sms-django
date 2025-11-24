import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import Button from '../components/common/Button';

function NotFound() {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-5xl" />
          </div>
        </div>
        <h2 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h2>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">Page Not Found</h3>
        <p className="mt-4 text-gray-500 text-lg">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8">
          <Button
            variant="primary"
            onClick={() => window.history.back()}
            icon={<FaHome />}
            className="mx-auto"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
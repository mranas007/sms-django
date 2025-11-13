import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';

const BackBtn = ({ to = -1, children = 'Back' }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <FaArrowCircleLeft className="mr-2" />
      {children}
    </Link>
  );
};

export default BackBtn;
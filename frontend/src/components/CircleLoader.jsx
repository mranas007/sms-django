import React from "react";

const CircleLoader = ({ fullScreen = true, text = "Loading..." }) => {
  const containerClasses = fullScreen
    ? "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center"
    : "relative flex items-center justify-center w-full h-full min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Spinner */}
        <div 
          className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
          role="status"
          aria-label={text}
        ></div>
        
        {/* Text */}
        <p className="mt-4 text-gray-600 text-base font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default CircleLoader;
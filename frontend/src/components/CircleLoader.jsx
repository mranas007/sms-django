import React from "react";

const loaderStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  border-top-color: #4F46E5;    /* Indigo 600 - primary color from AddUser.jsx */
  border-right-color: transparent;
  border-bottom-color: #6366F1; /* Indigo 500 */
  border-left-color: transparent;
  animation: spin 1s linear infinite;
}
`;

const CircleLoader = ({ fullScreen = true, text = "Loading..." }) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-100 bg-opacity-90 backdrop-blur-sm font-inter"
    : "relative flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-90 backdrop-blur-sm font-inter rounded-lg";

  return (
    <>
      <style>{loaderStyles}</style>

      <div className={containerClasses}>
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div
            className="spinner w-16 h-16 rounded-full border-4 border-gray-300 shadow-md transition-all duration-300 ease-in-out"
            aria-label="Loading content"
            role="status"
          ></div>

          {/* Text */}
          <p className="mt-4 text-gray-700 text-lg font-semibold tracking-wider">
            {text}
          </p>
        </div>
      </div>
    </>
  );
};

export default CircleLoader;

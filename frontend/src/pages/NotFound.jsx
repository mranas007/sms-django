// REACT HOOKS
import { React } from 'react';



export default function NotFound() {
  function goBack() {
    window.history.back();
  }

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-white font-inter">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          {/* Big 404 heading */}
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600">
            404
          </h1>

          {/* Main message */}
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-800 md:text-4xl">
            Something’s missing.
          </p>

          {/* Description */}
          <p className="mb-6 text-lg font-light text-gray-500">
            Sorry, we can’t find that page. You’ll find lots to explore on the
            home page.
          </p>

          {/* Button */}
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 
                       focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                       text-sm px-5 py-2.5 text-center shadow-md transition duration-200 ease-in-out"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </section>
  );
}

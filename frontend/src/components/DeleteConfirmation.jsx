import React, { useState, useRef, useEffect } from 'react';
// import { MoreHorizontal, Loader2, TriangleAlert } from 'lucide-react';
import { FaEllipsisH, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
// Correcting the import path based on your project structure
// Assuming services is at src/services/Api.js
import apiClient from '../services/Api';

/**
 * A reusable delete confirmation popover.
 *
 * @param {object} props
 * @param {string} props.deleteUrl - The API endpoint URL to call for deletion.
 * @param {function} props.onDeleteSuccess - Callback function to run after successful deletion (e.g., to refresh a list).
 * @param {string} [props.itemName] - The name of the item to display in the confirmation (e.g., "Class 10-A").
 * @param {string} [props.buttonSize] - Size of the trigger button (e.g., 'sm', 'md').
 */
const DeleteConfirmation = ({ deleteUrl, onDeleteSuccess, itemName = 'item', buttonSize = 'md' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setError(null); // Clear error when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use apiClient.delete with the provided URL
      const res = await apiClient.delete(deleteUrl);

      // 204 (No Content) or 200 (OK) are typical success statuses for DELETE
      if (res.status === 204 || res.status === 200) {
        setIsOpen(false);
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Trigger the parent component's success handler
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      // Try to get a specific error message from the API response
      const apiError = err.response?.data?.detail || err.message || 'Failed to delete.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setError(null);
  };

  const buttonSizeClass = buttonSize === 'sm' ? 'p-1' : 'p-2';

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      {/* Trigger Button (Three Dots) */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Actions for ${itemName}`}
        className={`rounded-full ${buttonSizeClass} bg-indigo-600 text-white hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <FaEllipsisH size={buttonSize === 'sm' ? 16 : 20} />
      </button>

      {/* Confirmation Popover */}
      {isOpen && (
        <div
          className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete {itemName}?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This action is permanent and cannot be undone.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                <FaExclamationTriangle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {isLoading ? (
                  <>
                    <FaSpinner size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteConfirmation;
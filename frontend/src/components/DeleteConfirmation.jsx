import React, { useState } from 'react';
import { FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import apiClient from '../services/Api';

/**
 * A reusable delete confirmation modal (centered on screen).
 *
 * @param {object} props
 * @param {string} props.deleteUrl - The API endpoint URL to call for deletion.
 * @param {function} props.onDeleteSuccess - Callback function after successful deletion.
 * @param {string} [props.itemName] - The name of the item to display (e.g., "Class 10-A").
 * @param {string} [props.description] - Additional description text for the modal.
 * @param {string} [props.buttonSize] - Size of the trigger button ('sm', 'md', 'lg').
 * @param {'icon' | 'button'} [props.triggerType] - Type of trigger ('icon' or 'button').
 * @param {string} [props.buttonText] - Custom text for button trigger.
 * @param {React.ReactNode} [props.customTrigger] - Custom trigger element (overrides triggerType).
 */
const DeleteConfirmation = ({ 
  deleteUrl, 
  onDeleteSuccess, 
  itemName = 'item', 
  description = 'This action is permanent and cannot be undone.',
  buttonSize = 'md', 
  triggerType = 'button',
  buttonText = 'Delete',
  customTrigger = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await apiClient.delete(deleteUrl);

      if (res.status === 204 || res.status === 200) {
        setIsOpen(false);
        // Small delay to allow modal close animation
        setTimeout(() => {
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        }, 100);
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      const apiError = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to delete. Please try again.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(true);
    setError(null); // Clear any previous errors
  };

  const handleClose = () => {
    if (!isLoading) { // Prevent closing while deleting
      setIsOpen(false);
      setError(null);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Render custom trigger if provided
  if (customTrigger) {
    return (
      <>
        <div onClick={handleOpen}>
          {customTrigger}
        </div>
        {isOpen && <Modal />}
      </>
    );
  }

  // Size configurations
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  const buttonClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };
  const iconButtonClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  // Modal component
  const Modal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete {itemName}?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {description}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              <FaExclamationTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash size={14} />
                  {buttonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger Button */}
      {triggerType === 'icon' ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Delete ${itemName}`}
          className={`rounded-lg ${iconButtonClasses[buttonSize]} text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`}
        >
          <FaTrash size={iconSizes[buttonSize]} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Delete ${itemName}`}
          className={`inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-red-600 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${buttonClasses[buttonSize]}`}
        >
          <FaTrash size={iconSizes[buttonSize]} />
          {buttonText}
        </button>
      )}

      {/* Modal */}
      {isOpen && <Modal />}
    </>
  );
};

export default DeleteConfirmation;
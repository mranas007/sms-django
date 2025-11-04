import React from "react";

function Btn({ id, type, text, onClick, className, disabled }) {
    return (
        <button
            className={`px-4 py-2 font-medium text-center inline-flex items-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 ${className || ""} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            id={id || undefined}
            type={type || undefined}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Btn;

import React from "react";

function Btn({ id, type, text, onClick, className }) {
    return (
        <button
            className={`px-3 py-2 font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${className || ""}`}
            id={id || undefined}
            type={type || undefined}
            onClick={onClick}>
            {text}
        </button>
    );
}

export default Btn;

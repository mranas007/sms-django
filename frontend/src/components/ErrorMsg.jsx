import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
export default function ErrorMsg({ error }) {
  const [visible, setVisible] = useState(!!error);

  if (!visible || !error) return null;

  return (
    <div className="mt-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded px-3 py-2 flex justify-between items-center">
      <span>{error}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-3 text-red-700 font-bold hover:text-red-900"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}

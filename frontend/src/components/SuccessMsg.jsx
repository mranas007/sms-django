import React, { useState } from 'react';

export default function SuccessMsg({ success }) {
  const [visible, setVisible] = useState(!!success);

  if (!visible || !success) return null;

  return (
    <div className="mt-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded px-3 py-2 flex justify-between items-center">
      <span>{success}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-3 text-green-800 font-bold hover:text-green-900"
      >
        ×
      </button>
    </div>
  );
}

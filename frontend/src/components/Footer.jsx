
import React from 'react';

function Footer() {
  return (
    <footer className="bg-indigo-800 text-white py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
        <p className="text-xs mt-2">Designed with ❤️ by Anas</p>
      </div>
    </footer>
  );
}

export default Footer;
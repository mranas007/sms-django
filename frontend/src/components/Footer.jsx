
import React from 'react';

function Footer() {
  return (

    <footer className="bg-indigo-800 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
        <p className="text-xs mt-2">Designed with ❤️ by Anas</p>
      </div>
    </footer>
  );
}

export default Footer;



// {/* Footer */ }
// <footer className="bg-gray-900 text-gray-300 py-12 px-4">
//   <div className="max-w-7xl mx-auto">
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//       {/* Brand Section */}
//       <div className="col-span-1 md:col-span-2">
//         <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
//           <span>📚</span> Django SMS
//         </h3>
//         <p className="text-gray-400 mb-4">
//           Modern school management system designed to streamline educational operations and enhance learning experiences.
//         </p>
//         <div className="flex gap-4">
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <FaStar className="text-xl" />
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <FaGraduationCap className="text-xl" />
//           </a>
//           <a href="#" className="text-gray-400 hover:text-white transition-colors">
//             <FaBook className="text-xl" />
//           </a>
//         </div>
//       </div>

//       {/* Quick Links */}
//       <div>
//         <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//         <ul className="space-y-2">
//           <li>
//             <Link to="/" className="text-gray-400 hover:text-white transition-colors">
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
//               About Us
//             </Link>
//           </li>
//           <li>
//             <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
//               Contact
//             </Link>
//           </li>
//           <li>
//             <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
//               Login
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* Support */}
//       <div>
//         <h4 className="text-white font-semibold mb-4">Support</h4>
//         <ul className="space-y-2">
//           <li>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors">
//               Help Center
//             </a>
//           </li>
//           <li>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors">
//               Documentation
//             </a>
//           </li>
//           <li>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors">
//               Privacy Policy
//             </a>
//           </li>
//           <li>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors">
//               Terms of Service
//             </a>
//           </li>
//         </ul>
//       </div>
//     </div>

//     {/* Bottom Bar */}
//     <div className="border-t border-gray-800 pt-8 text-center">
//       <p className="text-sm text-gray-400">
//         © 2025 Django SMS. All rights reserved. Built with <span className="text-red-500">❤️</span> for educators.
//       </p>
//     </div>
//   </div>
// </footer>
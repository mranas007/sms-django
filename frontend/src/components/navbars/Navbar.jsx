import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaSignInAlt, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';




function Navbar() {
    const { isAuthenticate, logout } = useAuthContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isAuthenticate();
            if (!isAuth) {
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }
        };
        checkAuth();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white hover:text-indigo-100 transition-all duration-300 flex items-center gap-2"
                    >
                        Django SMS
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-8">
                        <li>
                            <Link
                                to="/"
                                className="text-white hover:text-indigo-100 transition-colors duration-300 flex items-center gap-2 font-medium"
                            >
                                <FaHome /> Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-white hover:text-indigo-100 transition-colors duration-300 flex items-center gap-2 font-medium"
                            >
                                <FaInfoCircle /> About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="text-white hover:text-indigo-100 transition-colors duration-300 flex items-center gap-2 font-medium"
                            >
                                <FaEnvelope /> Contact
                            </Link>
                        </li>
                    </ul>

                    {/* Desktop Auth Buttons */}
                    <ul className="hidden md:flex space-x-4 items-center">
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
                                    >
                                        <FaUser /> Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium shadow-md"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold shadow-md"
                                    >
                                        <FaSignInAlt /> Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-white hover:text-indigo-100 focus:outline-none transition-colors duration-300"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className="h-6 w-6" />
                        ) : (
                            <FaBars className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-indigo-700 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {/* Mobile Navigation Links */}
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="block text-white hover:bg-indigo-600 px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
                    >
                        <FaHome /> Home
                    </Link>
                    <Link
                        to="/about"
                        onClick={closeMobileMenu}
                        className="block text-white hover:bg-indigo-600 px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
                    >
                        <FaInfoCircle /> About Us
                    </Link>
                    <Link
                        to="/contact"
                        onClick={closeMobileMenu}
                        className="block text-white hover:bg-indigo-600 px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
                    >
                        <FaEnvelope /> Contact
                    </Link>

                    {/* Mobile Divider */}
                    <div className="border-t border-indigo-500 my-2"></div>

                    {/* Mobile Auth Links */}
                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                                className="block bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
                            >
                                <FaUser /> Profile
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    closeMobileMenu();
                                }}
                                className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="block bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-center justify-center"
                            >
                                <FaSignInAlt /> Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
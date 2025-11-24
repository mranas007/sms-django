import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { FaBars, FaTimes, FaGraduationCap } from 'react-icons/fa';
import Button from '../common/Button.jsx';

function Navbar() {
    const { isAuthenticate, logout } = useAuthContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <FaGraduationCap className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Excellence Institute</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-1">
                        <li>
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isLoggedIn && (
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/login'}
                                className="px-6"
                            >
                                Login
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none p-2"
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
                className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-1">
                    {/* Mobile Navigation Links */}
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${isActive('/')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        onClick={closeMobileMenu}
                        className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${isActive('/about')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        onClick={closeMobileMenu}
                        className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${isActive('/contact')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        Contact
                    </Link>

                    {/* Mobile Auth Button */}
                    {!isLoggedIn && (
                        <div className="pt-4">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    window.location.href = '/login';
                                    closeMobileMenu();
                                }}
                                className="w-full justify-center"
                            >
                                Login
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
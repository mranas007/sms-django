import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Auth Context
import { useAuthContext } from "../context/AuthContext.jsx";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { token} = useAuthContext();

    useEffect(() => {
        // Replace with your actual auth check logic
        // const token = localStorage.getItem('token');
        setIsLoggedIn(!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <nav className="max-w-[1280px] mx-auto bg-blue-600 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
                    Django-SMS
                </Link>
                
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-blue-200 transition-colors">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-blue-200 transition-colors">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-blue-200 transition-colors">
                            Contact
                        </Link>
                    </li>
                </ul>

                <ul className="flex space-x-4">
                    {isLoggedIn ?  (
                        <>
                            <li>
                                <Link to="/login" className="hover:text-blue-200 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-blue-200 transition-colors">
                                    Register
                                </Link>
                            </li>
                        </>
                    ): (
                        <>
                            <li>
                                <Link to="/profile" className="hover:text-blue-200 transition-colors">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}
export default Navbar

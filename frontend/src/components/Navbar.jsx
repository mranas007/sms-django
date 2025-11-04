import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constant/TokensConstant.js';
import { useAuthContext } from '../context/AuthContext.jsx';


function Navbar() {
    const {isAuthenticate, logout}= useAuthContext()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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


    return (
        <nav className="max-w-[1280px] mx-auto bg-indigo-600 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition-colors duration-300">
                    Django SMS
                </Link>

                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-indigo-200 transition-colors duration-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-indigo-200 transition-colors duration-300">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-indigo-200 transition-colors duration-300">
                            Contact
                        </Link>
                    </li>
                </ul>

                <ul className="flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/profile" className="hover:text-indigo-200 transition-colors duration-300">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="hover:text-indigo-200 transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="hover:text-indigo-200 transition-colors duration-300">
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}
export default Navbar

// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import Login from '../pages/account/Login.jsx';
import Home from '../pages/guest/Home.jsx';
import About from '../pages/guest/About.jsx';
import Contact from '../pages/guest/Contact.jsx';
import NotFound from '../pages/NotFound.jsx';

// COMPONENETS
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';


export default function GuestRoutes() {
  return (
    <>
    <Navbar />

        <main className="max-w-7xl mx-auto p-0 bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

    <Footer />
  </>
  );
}

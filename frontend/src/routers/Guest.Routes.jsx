// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import Login from '../pages/account/Login.jsx';
import Home from '../pages/guest/Home.jsx';
import About from '../pages/guest/About.jsx';
import Contact from '../pages/guest/Contact.jsx';



export default function GuestRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

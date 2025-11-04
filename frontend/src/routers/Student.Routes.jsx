// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

// COMPONENTS
import StudentNavbar from '../components/StudentNavbar.jsx';
import Footer from '../components/Footer.jsx';


export default function StudentRoutes() {
  return (
    <>
        <StudentNavbar />
        <main className="max-w-7xl mx-auto p-4 bg-gray-100">
          <Routes>
              <Route path="/student/dashboard" element={ <StudentDashboard /> }/>
              <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
    </>
  );
}


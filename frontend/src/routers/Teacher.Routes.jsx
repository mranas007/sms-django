// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';

// COMPONENTS
import TeacherNavbar from '../components/TeacherNavbar.jsx';
import Footer from '../components/Footer.jsx';


export default function TeacherRoutes() {
  return (
    <>
    <TeacherNavbar />

        <main className="max-w-7xl mx-auto p-4 bg-gray-100">
          <Routes>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

    <Footer />
    </>
  );
}


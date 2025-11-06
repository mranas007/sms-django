// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';


export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


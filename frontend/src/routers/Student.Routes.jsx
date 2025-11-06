// REACT HOOKS
import { Routes, Route } from 'react-router-dom';

// PAGES
import StudentDashboard from '../pages/student/StudentDashboard.jsx';


export default function StudentRoutes() {
  return (
   <Routes>
      <Route path="/dashboard" element={ <StudentDashboard /> }/>
      <Route path="*" element={<NotFound />} />
   </Routes>
        
  );
}


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/account/Login.jsx';
import Register from './pages/account/Register.jsx';
import Home from './pages/guest/Home.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';


function Routers() {
  return (
    
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* Teacher */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
  );
}

export default Routers;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/account/Login.jsx';
import Register from './pages/account/Register.jsx';
import Home from './pages/guest/Home.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import { ProtectedRouter } from './components/ProtectedRouter.jsx';



function Routers() {
  return (
    <main className="max-w-7xl mx-auto p-4 bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRouter allowedRoles={["Teacher"]}>
              <TeacherDashboard />
            </ProtectedRouter>
          }/>

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRouter allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRouter>
          }/>

      </Routes>
    </main>
  );
}

export default Routers;

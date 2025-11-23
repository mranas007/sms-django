// REACT HOOKS
import { React } from 'react';
import { Routes, Route } from 'react-router-dom';


// JWT DECODER
import { jwtDecode } from 'jwt-decode';


// CONTEXT
import { AuthProvider, useAuthContext } from './context/AuthContext.jsx';


// ROUTES
// import GuestRoutes from './routers/Guest.Routes.jsx';
// import AdminRoutes from './routers/Admin.Routes.jsx';
// import StudentRoutes from './routers/Student.Routes.jsx';
// import TeacherRoutes from './routers/Teacher.Routes.jsx';
import { ProtectedRouter } from './utils/ProtectedRouter.jsx';


// COMPONENTS
import AdminNavbar from './components/navbars/AdminNavbar.jsx';
import TeacherNavbar from './components/navbars/TeacherNavbar.jsx';
import StudentNavbar from './components/navbars/StudentNavbar.jsx';
import Navbar from './components/navbars/Navbar.jsx';
import Layout from './layouts/Layout.jsx';


// PAGES
import Home from './pages/guest/Home.jsx';
import About from './pages/guest/About.jsx';
import Contact from './pages/guest/Contact.jsx';
import Login from './pages/account/Login.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Users from './pages/admin/users/Users.jsx';
import UserDetails from './pages/admin/users/UserDetails.jsx';
import AddUser from './pages/admin/users/AddUser.jsx';
import UpdateUser from './pages/admin/users/UpdateUser.jsx';
import ClassDetail from './pages/admin/classes/ClassDetail.jsx';
import AddClass from './pages/admin/classes/AddClass.jsx';
import ClassList from './pages/admin/classes/ClassList.jsx';
import EditClass from './pages/admin/classes/EditClass.jsx';
import Subjects from './pages/admin/subjects/Subjects.jsx';
import AddSubject from './pages/admin/subjects/AddSubject.jsx';
import Actvivities from './pages/admin/UserActivities/Actvivities.jsx';
import EditSubject from './pages/admin/subjects/EditSubject.jsx';

import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import Students from './pages/teacher/Students/Students.jsx';
import Classes from './pages/teacher/Classes/Classes.jsx';
import Assignments from './pages/teacher/Assignments/Assignments.jsx';
import AssignmentCreate from './pages/teacher/Assignments/AssignmentCreate.jsx';
import AssignmentEdit from './pages/teacher/Assignments/AssignmentEdit.jsx';
import AssignmentDetail from './pages/teacher/Assignments/AssignmentDetail.jsx';
import StudentSubmittedAssignments from './pages/teacher/Assignment_Submission/StudentSubmitedAssignments.jsx';
import StudentSubmittedAssignmentDetail from './pages/teacher/Assignment_Submission/StudentSubmittedAssignmentDetail.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentAssignments from './pages/student/Assignments/Assignments.jsx';
import StudentAssignmentDetail from './pages/student/Assignments/AssignmentDetail.jsx';
import StudentAssignmentSubmission from './pages/student/Assignments/AssignmentSubmission.jsx';
import StudentClass from './pages/student/Classes/ClassDetail.jsx';





// RETURN NAVBAR COMPONENT BASED ON USER ROLE
const AppNavbar = () => {
  const { isAuthenticate, accessToken } = useAuthContext();

  if (!isAuthenticate || !accessToken) {
    return <Navbar />
  }

  try {
    const user = jwtDecode(accessToken);
    // Centralized role-to-route mapping for maintainability
    const roleNavbar = {
      Admin: <AdminNavbar />,
      Student: <StudentNavbar />,
      Teacher: <TeacherNavbar />
    };
    // Validate user object structure and valid role
    const isValidUser = user && user.role && Object.hasOwn(roleNavbar, user.role);
    const RouteComponent = isValidUser ? roleNavbar[user.role] : <Navbar />;
    return RouteComponent;
  } catch (error) {
    console.error("Failed to decode token or validate user role:", error);
    return <Navbar />;
  }
};


function App() {
  return (
    <AuthProvider>
      <Layout NavbarComponent={AppNavbar}>
        <Routes>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRouter allowedRoles={['Admin']} />}>

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/classes" element={<ClassList />} />
            <Route path="/admin/add/class" element={<AddClass />} />
            <Route path="/admin/class/edit/:id" element={<EditClass />} />
            <Route path="/admin/class/detail/:id" element={<ClassDetail />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/user/add" element={<AddUser />} />
            <Route path="/admin/user/:id" element={<UserDetails />} />
            <Route path="/admin/users/:id/update" element={<UpdateUser />} />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/add/subject" element={<AddSubject />} />
            <Route path="/admin/edit/subject/:id" element={<EditSubject />} />
            <Route path="/admin/activities" element={<Actvivities />} />

          </Route>



          {/* STUDENT ROUTES */}
          <Route element={<ProtectedRouter allowedRoles={['Student', 'Admin']} />}>

            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/class" element={<StudentClass />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/assignment/:id" element={<StudentAssignmentDetail />} />
            <Route path="/student/assignment/:id/submit" element={<StudentAssignmentSubmission />} />

          </Route>



          {/* TEACHER ROUTES */}
          <Route element={<ProtectedRouter allowedRoles={['Teacher', 'Admin']} />}>

            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/students" element={<Students />} />
            <Route path="/teacher/classes" element={<Classes />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route path="/teacher/assignments/create" element={<AssignmentCreate />} />
            <Route path="/teacher/assignment/detail/:id" element={<AssignmentDetail />} />
            <Route path="/teacher/assignment/edit/:id" element={<AssignmentEdit />} />
            <Route path="/teacher/assignment-submissions" element={<StudentSubmittedAssignments />} />
            <Route path="/teacher/assignment-submissions/:id" element={<StudentSubmittedAssignmentDetail />} />

          </Route>


          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;

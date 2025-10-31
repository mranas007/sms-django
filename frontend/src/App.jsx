import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Routers from './Routers.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import React from 'react';

function App() {
  return (
    <>
    <AuthProvider>
        <Navbar />
          <Routers />
        <Footer />
    </AuthProvider>
    </>
  );
}

export default App;

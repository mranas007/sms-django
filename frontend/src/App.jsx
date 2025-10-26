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
        <main className="max-w-[1280px] mx-auto p-4  bg-gray-100">
          <Routers />
        </main>
        <Footer />
    </AuthProvider>
    </>
  );
}

export default App;

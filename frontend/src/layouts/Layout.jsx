import React from 'react';
import Footer from '../components/Footer.jsx';

const Layout = ({ children, NavbarComponent }) => {
  return (
    <>
      {NavbarComponent && <NavbarComponent />}
      <main className="max-w-7xl mx-auto p-0  bg-gray-100">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
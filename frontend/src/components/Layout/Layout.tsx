// components/Layout.tsx
import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16"> {/* Tambahkan padding top di sini */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

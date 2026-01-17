import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ onScrollToSection }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] overflow-x-hidden flex flex-col">
      <Header onScrollToSection={onScrollToSection} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

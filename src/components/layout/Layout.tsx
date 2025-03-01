// src/components/layout/Layout.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-md">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">Assessment Portal</h1>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-slate-700 text-white">
        <div className="container mx-auto p-2 flex gap-2 overflow-x-auto">
          <Button 
            variant={location.pathname === '/' ? "default" : "ghost"} 
            className="text-white"
            asChild
          >
            <Link to="/">Dashboard</Link>
          </Button>
          <Button 
            variant={location.pathname === '/add-domain' ? "default" : "ghost"} 
            className="text-white"
            asChild
          >
            <Link to="/add-domain">Add Domain</Link>
          </Button>
          <Button 
            variant={location.pathname === '/add-category' ? "default" : "ghost"} 
            className="text-white"
            asChild
          >
            <Link to="/add-category">Add Category</Link>
          </Button>
          <Button 
            variant={location.pathname === '/add-question' ? "default" : "ghost"} 
            className="text-white"
            asChild
          >
            <Link to="/add-question">Add Question</Link>
          </Button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto p-4 flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Assessment Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link } from 'react-router-dom';
import AuthPage from '@/components/auth/AuthPage';
import { BookOpen, Trophy } from 'lucide-react';

const AuthPageWrapper = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                  <BookOpen className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Byteskill
                </span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                    Learning Platform
                  </span>
                </div>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dsa-sheets" className="text-gray-300 hover:text-white transition-colors">DSA Sheets</Link>
              <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</Link>
              <Link to="/core-cs" className="text-gray-300 hover:text-white transition-colors">Core CS</Link>
              <Link to="/interview-prep" className="text-gray-300 hover:text-white transition-colors">Interview Prep</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthPage />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Byteskill. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPageWrapper;

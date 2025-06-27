
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, FileText, GraduationCap, Target, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthPageWrapper = () => {
  // This component is deprecated - redirect users to /login
  React.useEffect(() => {
    window.location.href = '/login';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header - Same as other pages */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
            
            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[{
                name: 'DSA Sheets',
                href: '/dsa-sheets',
                icon: FileText,
                color: 'text-blue-400'
              }, {
                name: 'Courses',
                href: '/courses',
                icon: GraduationCap,
                color: 'text-green-400'
              }, {
                name: 'Core CS',
                href: '/core-cs',
                icon: Cpu,
                color: 'text-purple-400'
              }, {
                name: 'Interview Prep',
                href: '/interview-prep',
                icon: Target,
                color: 'text-orange-400'
              }].map(item => (
                <Link key={item.name} to={item.href} className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group">
                  <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-gray-600 hover:border-gray-500 text-orange-50 bg-orange-700 hover:bg-orange-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
          <p className="text-gray-400">You are being redirected to the login page.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPageWrapper;

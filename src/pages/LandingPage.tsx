
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Trophy, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">CodeMaster</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/courses" className="text-gray-300 hover:text-white">Courses</Link>
              <Link to="/dsa-sheets" className="text-gray-300 hover:text-white">DSA Sheets</Link>
              <Link to="/core-cs" className="text-gray-300 hover:text-white">Core CS</Link>
              <Link to="/interview-prep" className="text-gray-300 hover:text-white">Interview Prep</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master <span className="text-blue-500">Coding</span> Skills
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Practice coding problems, learn data structures & algorithms, and prepare for technical interviews with our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Learning Free
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
              <p className="text-gray-300">Follow curated learning paths designed by industry experts.</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-300">Monitor your learning journey with detailed progress tracking.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-300">Join thousands of learners on their coding journey.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

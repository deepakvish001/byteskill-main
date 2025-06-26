
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Trophy, Users, ArrowRight, Star, Target, Zap, Award, ChevronRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      const username = user.user_metadata?.username || user.email?.split('@')[0];
      navigate(`/u/${username}`, { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
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
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Join 10,000+ developers mastering coding skills</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Master <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Coding</span> Skills
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Practice coding problems, learn data structures & algorithms, and prepare for technical interviews with our comprehensive platform designed by industry experts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg rounded-xl">
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-400">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">Expert Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Byteskill?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to master coding and land your dream job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
              <BookOpen className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Structured Learning</h3>
              <p className="text-gray-400">Follow curated learning paths designed by industry experts and FAANG engineers.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
              <Target className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Track Progress</h3>
              <p className="text-gray-400">Monitor your learning journey with detailed progress tracking and analytics.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <Users className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
              <p className="text-gray-400">Join thousands of learners and get help from experienced developers.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors">
              <Zap className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Real Projects</h3>
              <p className="text-gray-400">Build real-world projects and create an impressive portfolio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-gray-400">Start your coding journey with our expertly crafted courses</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/dsa-sheets" className="group">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-8 rounded-xl border border-blue-800 hover:border-blue-600 transition-all duration-300 hover:transform hover:scale-105">
                <Code className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">DSA Sheets</h3>
                <p className="text-gray-400 mb-4">Master data structures and algorithms with our comprehensive problem sets.</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span>Start Learning</span>
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link to="/interview-prep" className="group">
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-8 rounded-xl border border-green-800 hover:border-green-600 transition-all duration-300 hover:transform hover:scale-105">
                <Award className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Interview Prep</h3>
                <p className="text-gray-400 mb-4">Get ready for technical interviews with real company questions.</p>
                <div className="flex items-center text-green-400 group-hover:text-green-300">
                  <span>Prepare Now</span>
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-900/20 to-red-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of developers who have transformed their careers with Byteskill</p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-sm opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Byteskill
                </span>
              </Link>
              <p className="text-gray-400 text-sm">
                Master coding skills with our comprehensive learning platform designed for developers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Learning</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dsa-sheets" className="hover:text-white transition-colors">DSA Sheets</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/core-cs" className="hover:text-white transition-colors">Core CS</Link></li>
                <li><Link to="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Byteskill. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

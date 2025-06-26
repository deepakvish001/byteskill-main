
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, Trophy, Users, ArrowRight, Star, Target, Zap, Award, ChevronRight, Cpu, FileText, GraduationCap, Brain, MessageCircle, TrendingUp, Calendar, Flame } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow curated learning paths designed by industry experts and FAANG engineers.",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-800"
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking and analytics.",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-800"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join thousands of learners and get help from experienced developers.",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20", 
      borderColor: "border-purple-800"
    },
    {
      icon: Zap,
      title: "Real Projects",
      description: "Build real-world projects and create an impressive portfolio.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-800"
    }
  ];

  const learningPaths = [
    {
      title: "DSA Sheets",
      description: "Master data structures and algorithms with comprehensive problem sets",
      icon: Code,
      link: "/dsa-sheets",
      stats: "500+ Problems",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700"
    },
    {
      title: "Courses",
      description: "Learn programming languages and frameworks with hands-on projects",
      icon: GraduationCap,
      link: "/courses",
      stats: "50+ Courses",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-700"
    },
    {
      title: "Interview Prep",
      description: "Get ready for technical interviews with real company questions",
      icon: Award,
      link: "/interview-prep",
      stats: "300+ Questions",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-700"
    },
    {
      title: "Core CS",
      description: "Master computer science fundamentals and system design",
      icon: Cpu,
      link: "/core-cs",
      stats: "25+ Topics",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-700"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "Byteskill helped me land my dream job at Google. The DSA practice was incredibly comprehensive.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Frontend Developer at Meta",
      content: "The interview prep section was a game-changer. I felt confident in every technical interview.",
      avatar: "MR"
    },
    {
      name: "Priya Patel",
      role: "Full Stack Developer at Amazon",
      content: "The structured learning path made complex topics easy to understand. Highly recommended!",
      avatar: "PP"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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
              {[
                { name: 'DSA Sheets', href: '/dsa-sheets', icon: FileText, color: 'text-blue-400' },
                { name: 'Courses', href: '/courses', icon: GraduationCap, color: 'text-green-400' },
                { name: 'Core CS', href: '/core-cs', icon: Cpu, color: 'text-purple-400' },
                { name: 'Interview Prep', href: '/interview-prep', icon: Target, color: 'text-orange-400' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500">
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

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-orange-900/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gray-900/80 backdrop-blur-sm rounded-full mb-8 border border-gray-700">
              <Star className="w-5 h-5 text-yellow-400 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm text-gray-300 font-medium">Join 50,000+ developers mastering coding skills</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Master <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">Coding</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Practice coding problems, learn data structures & algorithms, and prepare for technical interviews with our comprehensive platform designed by industry experts from top tech companies.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: "50,000+", label: "Active Learners", icon: Users },
              { number: "1,000+", label: "Coding Problems", icon: Code },
              { number: "100+", label: "Expert Courses", icon: BookOpen },
              { number: "95%", label: "Success Rate", icon: Trophy }
            ].map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Why Choose Byteskill?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to master coding and land your dream job at top tech companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.bgColor} border ${feature.borderColor} hover:border-opacity-80 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm`}>
                <CardHeader className="text-center pb-4">
                  <feature.icon className={`h-16 w-16 ${feature.color} mx-auto mb-4`} />
                  <CardTitle className="text-xl font-semibold text-white mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Choose Your Learning Path</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Start your coding journey with our expertly crafted courses and practice materials</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningPaths.map((path, index) => (
              <Link key={index} to={path.link} className="group block">
                <Card className={`${path.bgColor} border ${path.borderColor} hover:border-opacity-80 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm h-full`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${path.color}`}>
                        <path.icon className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                        {path.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 leading-relaxed">{path.description}</p>
                    <div className="flex items-center text-orange-400 group-hover:text-orange-300 font-medium">
                      <span>Start Learning</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">See how Byteskill has helped developers land their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who have transformed their careers with Byteskill. Start your coding journey today!
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6">
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
              <p className="text-gray-400 text-sm leading-relaxed">
                Master coding skills with our comprehensive learning platform designed for developers of all levels.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6">Learning</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/dsa-sheets" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>DSA Sheets</span>
                </Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Courses</span>
                </Link></li>
                <li><Link to="/core-cs" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>Core CS</span>
                </Link></li>
                <li><Link to="/interview-prep" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Interview Prep</span>
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
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

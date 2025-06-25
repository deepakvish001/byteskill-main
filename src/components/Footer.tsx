
import { BookOpen, Trophy, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Byteskill
                </span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                    Platform
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Master coding skills with our comprehensive learning platform.
            </p>
          </div>

          {/* Learn Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Learn</h3>
            <div className="space-y-2">
              <a href="/dsa-sheets" className="block text-sm text-gray-400 hover:text-white transition-colors">
                DSA Sheets
              </a>
              <a href="/courses" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Courses
              </a>
              <a href="/interview-prep" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Interview Prep
              </a>
              <a href="/core-cs" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Core CS
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <div className="space-y-2">
              <a href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">
                About Us
              </a>
              <a href="/careers" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Careers
              </a>
              <a href="/privacy" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p>support@byteskill.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Byteskill Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

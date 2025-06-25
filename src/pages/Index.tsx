
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to their dashboard
    if (user && !loading) {
      const username = user.user_metadata?.username || user.email?.split('@')[0];
      navigate(`/u/${username}`, { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    // This will be handled by the useEffect above, but show loading in the meantime
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl shadow-2xl">
              <span className="text-3xl font-bold text-white">B</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            ByteSkill
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
            Master coding challenges, track your progress, and boost your programming skills with our comprehensive platform.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            Join thousands of developers improving their skills
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-blue-400 text-xl">📚</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Structured Learning</h3>
            <p className="text-gray-400 text-sm">Follow curated DSA sheets and courses designed by experts</p>
          </div>
          
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-green-400 text-xl">📊</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">Monitor your learning journey with detailed analytics</p>
          </div>
          
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-purple-400 text-xl">🏆</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Earn Achievements</h3>
            <p className="text-gray-400 text-sm">Unlock badges and compete with fellow developers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

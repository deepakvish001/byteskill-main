
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const [forgotPassword, setForgotPassword] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to ByteSkill
        </h1>
        <p className="text-gray-300 text-lg">Master coding challenges and boost your skills</p>
      </div>

      {forgotPassword ? (
        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Enter your email to receive reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ForgotPasswordForm onBack={() => setForgotPassword(false)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700 h-12">
            <TabsTrigger 
              value="login" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-semibold"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-semibold"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Sign in to continue your coding journey
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <LoginForm onToggle={() => {}} />
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setForgotPassword(true)}
                    className="text-orange-400 hover:text-orange-300 underline text-sm font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white text-2xl">Create Account</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Join thousands of developers improving their skills
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <SignUpForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AuthPage;

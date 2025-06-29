import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Mail, Lock, User, Phone, Chrome, Menu, Search, Trophy, FileText, GraduationCap, Cpu, Target } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    signIn,
    signUp
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    mobileNumber: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        toast.error(error.message || 'Failed to sign in');
        return;
      }
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      const {
        error
      } = await signUp(signupForm.email, signupForm.password, {
        fullName: signupForm.fullName,
        username: signupForm.username,
        mobileNumber: signupForm.mobileNumber
      });
      if (error) {
        toast.error(error.message || 'Failed to sign up');
        return;
      }
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) {
        toast.error(error.message || 'Failed to send reset email');
        return;
      }
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header - Updated to match home page */}
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
              <Link to="/auth">
                <Button variant="outline" className="border-gray-600 hover:border-gray-500 text-orange-50 bg-orange-700 hover:bg-orange-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                  <BookOpen className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Byteskill
              </span>
            </div>
            <p className="text-gray-400">Welcome back! Please sign in to your account</p>
          </div>

          {showForgotPassword ? <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Reset Password</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your email address and we'll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="forgot-email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="Enter your email" required />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1 border-gray-600 text-white hover:bg-gray-800">
                      Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card> : <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="login" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                    <TabsTrigger value="login" className="text-zinc-50 bg-gray-900 hover:bg-gray-800">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="text-zinc-50 bg-gray-900 hover:bg-gray-800">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <Button onClick={handleGoogleSignIn} disabled={googleLoading} variant="outline" className="w-full text-gray-900 border border-gray-300 bg-orange-700 hover:bg-orange-600">
                      <Chrome className="w-4 h-4 mr-2" />
                      {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full bg-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="login-email" type="email" value={loginForm.email} onChange={e => setLoginForm({
                      ...loginForm,
                      email: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="Enter your email" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-white">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="login-password" type="password" value={loginForm.password} onChange={e => setLoginForm({
                      ...loginForm,
                      password: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="Enter your password" required />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-orange-400 hover:text-orange-300">
                          Forgot password?
                        </button>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <Button onClick={handleGoogleSignIn} disabled={googleLoading} variant="outline" className="w-full border border-gray-300 bg-orange-700 hover:bg-orange-600 text-zinc-950">
                      <Chrome className="w-4 h-4 mr-2" />
                      {googleLoading ? 'Signing up...' : 'Sign up with Google'}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full bg-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-fullname" className="text-white">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="signup-fullname" type="text" value={signupForm.fullName} onChange={e => setSignupForm({
                        ...signupForm,
                        fullName: e.target.value
                      })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="John Doe" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-username" className="text-white">Username</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input id="signup-username" type="text" value={signupForm.username} onChange={e => setSignupForm({
                        ...signupForm,
                        username: e.target.value
                      })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="johndoe" required />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="signup-email" type="email" value={signupForm.email} onChange={e => setSignupForm({
                      ...signupForm,
                      email: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="john@example.com" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-mobile" className="text-white">Mobile Number (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="signup-mobile" type="tel" value={signupForm.mobileNumber} onChange={e => setSignupForm({
                      ...signupForm,
                      mobileNumber: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="+1 234 567 8900" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="signup-password" type="password" value={signupForm.password} onChange={e => setSignupForm({
                      ...signupForm,
                      password: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="Enter your password" required minLength={6} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-white">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input id="signup-confirm-password" type="password" value={signupForm.confirmPassword} onChange={e => setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value
                    })} className="pl-10 bg-gray-800/50 border-gray-600 text-white" placeholder="Confirm your password" required minLength={6} />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>}

          <div className="text-center mt-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Same as other pages */}
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

export default LoginPage;

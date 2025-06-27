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
import { BookOpen, Mail, Lock, User, Phone, Chrome } from 'lucide-react';
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
  return <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-2xl">
                <BookOpen className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Byteskill
            </span>
          </Link>
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
                  <TabsTrigger value="signup" className="text-gray-400 data-[state=active]:text-white">
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
                  <Button onClick={handleGoogleSignIn} disabled={googleLoading} variant="outline" className="w-full border border-gray-300 bg-gray-900 hover:bg-gray-800 text-orange-600">
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
    </div>;
};
export default LoginPage;
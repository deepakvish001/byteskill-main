
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (data: ProfileUpdateData) => Promise<{ error: any }>;
}

interface SignUpData {
  fullName: string;
  username: string;
  mobileNumber?: string;
}

interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  mobile_number?: string;
  avatar_url?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Log activity
          setTimeout(() => {
            logActivity('login', 'User signed in successfully');
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logActivity = async (activityType: string, description: string, metadata?: any) => {
    if (!user) return;
    
    try {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        activity_type: activityType,
        description,
        metadata: metadata || {}
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const checkRateLimit = async (email: string, ipAddress: string) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .gte('attempted_at', oneHourAgo);

    if (error) return { allowed: true, attempts: 0 };

    const attempts = data?.length || 0;
    return { allowed: attempts < 5, attempts }; // Max 5 attempts per hour
  };

  const logLoginAttempt = async (email: string, success: boolean) => {
    const ipAddress = '127.0.0.1'; // In production, get real IP
    
    await supabase.from('login_attempts').insert({
      email,
      ip_address: ipAddress,
      success,
      attempted_at: new Date().toISOString()
    });
  };

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.fullName,
            username: userData.username,
            mobile_number: userData.mobileNumber || ''
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account."
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check rate limiting
      const rateLimit = await checkRateLimit(email, '127.0.0.1');
      if (!rateLimit.allowed) {
        const error = new Error(`Too many login attempts. Please try again later.`);
        toast({
          title: "Too Many Attempts",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Log the attempt
      await logLoginAttempt(email, !error);

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (error: any) {
      await logLoginAttempt(email, false);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await logActivity('logout', 'User signed out');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for reset instructions."
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        await logActivity('profile_update', 'Profile updated successfully');
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

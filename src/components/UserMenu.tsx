
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Shield } from 'lucide-react';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin']);

        if (!error && data && data.length > 0) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
    };

    const fetchUsername = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setUsername(data.username);
        } else {
          setUsername(user.email?.split('@')[0] || 'user');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(user.email?.split('@')[0] || 'user');
      }
    };

    checkAdminRole();
    fetchUsername();
  }, [user]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (username) {
      navigate(`/u/${username}`);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/login')} className="border-gray-600 hover:border-gray-500 text-orange-50 bg-orange-700 hover:bg-orange-600">
          Sign In
        </Button>
        <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all">
          Get Started
        </Button>
      </div>
    );
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.email || ''} />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-gray-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={() => navigate('/admin')}
              className="text-orange-400 hover:bg-gray-800 cursor-pointer"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={loading}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

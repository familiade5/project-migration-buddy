import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  temp_password: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchingRef = useRef(false);
  const initRef = useRef(false);

  const fetchUserData = useCallback(async (userId: string) => {
    // Prevent duplicate calls
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      // Fetch profile and admin role in parallel with retry
      const [profileResult, adminResult] = await Promise.allSettled([
        retryWithBackoff(async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          if (error) throw error;
          return data;
        }),
        retryWithBackoff(async () => {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          if (error) throw error;
          return data;
        })
      ]);

      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      } else {
        console.error('Error fetching profile:', profileResult.reason);
      }

      if (adminResult.status === 'fulfilled') {
        setIsAdmin(!!adminResult.value);
      } else {
        console.error('Error checking admin role:', adminResult.reason);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      fetchingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer data fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const refreshProfile = async () => {
    if (user) {
      fetchingRef.current = false; // Reset to allow refresh
      await fetchUserData(user.id);
    }
  };

  const logActivity = useCallback(async (
    userId: string,
    userEmail: string | undefined,
    userName: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ) => {
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_email: userEmail || null,
        user_name: userName,
        action,
        resource_type: resourceType || null,
        resource_id: resourceId || null,
        details: (details as Json) || null,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      // Log login activity
      if (data.user) {
        const userMetadata = data.user.user_metadata;
        await logActivity(
          data.user.id,
          data.user.email,
          userMetadata?.full_name || 'Usuário',
          'login',
          undefined,
          undefined,
          { email: data.user.email }
        );
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    // Log logout activity before signing out
    if (user && profile) {
      await logActivity(
        user.id,
        profile.email || user.email,
        profile.full_name || 'Usuário',
        'logout'
      );
    }
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    
    // Always clear local state, even if signOut fails (e.g., session already expired)
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) return { error };
      
      // Update temp_password flag
      if (user) {
        await supabase
          .from('profiles')
          .update({ temp_password: false })
          .eq('id', user.id);
        
        await refreshProfile();
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

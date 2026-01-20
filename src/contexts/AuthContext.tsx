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

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUserData = useCallback(
    async (userId: string, opts?: { setLoading?: boolean }) => {
      // Prevent duplicate calls
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      const setLoading = opts?.setLoading ?? false;
      if (setLoading && isMountedRef.current) setIsLoading(true);

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
          }),
        ]);

        if (profileResult.status === 'fulfilled') {
          if (isMountedRef.current) setProfile(profileResult.value);
        } else {
          console.error('Error fetching profile:', profileResult.reason);
        }

        if (adminResult.status === 'fulfilled') {
          if (isMountedRef.current) setIsAdmin(!!adminResult.value);
        } else {
          console.error('Error checking admin role:', adminResult.reason);
          if (isMountedRef.current) setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        fetchingRef.current = false;
        if (setLoading && isMountedRef.current) setIsLoading(false);
      }
    },
    []
  );

  // Initialize auth state (avoid setTimeout + avoid tying loading to onAuthStateChange)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      // Ongoing changes: update derived data, but don't block UI with isLoading.
      if (nextSession?.user) {
        fetchUserData(nextSession.user.id, { setLoading: false });
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await fetchUserData(initialSession.user.id, { setLoading: false });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const refreshProfile = async () => {
    if (user) {
      fetchingRef.current = false; // Reset to allow refresh
      await fetchUserData(user.id, { setLoading: true });
    }
  };

  const logActivity = useCallback(async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ) => {
    try {
      // Use the secure database function that validates user data server-side
      await supabase.rpc('log_user_activity', {
        p_action: action,
        p_resource_type: resourceType || null,
        p_resource_id: resourceId || null,
        p_details: (details as Json) || null,
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
      
      // Log login activity using secure RPC
      if (data.user) {
        await logActivity(
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
    // Log logout activity before signing out using secure RPC
    if (user) {
      await logActivity('logout');
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

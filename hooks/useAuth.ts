'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, AuthError, AuthSession } from '@/types';

export function useAuth() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: currentSession.user.user_metadata?.full_name || '',
            avatar_url: currentSession.user.user_metadata?.avatar_url,
            created_at: currentSession.user.created_at || '',
            updated_at: currentSession.user.updated_at || '',
          });

          setSession({
            user: {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              full_name: currentSession.user.user_metadata?.full_name || '',
              avatar_url: currentSession.user.user_metadata?.avatar_url,
              created_at: currentSession.user.created_at || '',
              updated_at: currentSession.user.updated_at || '',
            },
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token || '',
            expires_at: new Date(
              currentSession.expires_at! * 1000
            ).toISOString(),
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || '',
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at || '',
          updated_at: session.user.updated_at || '',
        });

        setSession({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at || '',
            updated_at: session.user.updated_at || '',
          },
          access_token: session.access_token,
          refresh_token: session.refresh_token || '',
          expires_at: new Date(session.expires_at! * 1000).toISOString(),
        });
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up
  const signup = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        setError({
          code: signupError.status?.toString() || 'unknown',
          message: signupError.message,
        });
        throw signupError;
      }

      return data;
    } catch (err) {
      const error = err as any;
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError({
          code: loginError.status?.toString() || 'unknown',
          message: loginError.message,
        });
        throw loginError;
      }

      if (data?.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          full_name: data.session.user.user_metadata?.full_name || '',
          avatar_url: data.session.user.user_metadata?.avatar_url,
          created_at: data.session.user.created_at || '',
          updated_at: data.session.user.updated_at || '',
        });
      }

      return data;
    } catch (err) {
      const error = err as any;
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setSession(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (err) {
      const error = err as any;
      setError({
        code: error.status?.toString() || 'unknown',
        message: error.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };
}

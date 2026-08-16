import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, hasSupabaseConfig } from '../../lib/supabase';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSupabaseConfig) {
      setError('Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-4 text-[#1A1A1A] font-sans">
      <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-white font-serif italic text-2xl mb-8 shadow-lg">
        V
      </div>
      
      <div className="w-full max-w-md bg-white border border-[#E5E4E2] p-8 shadow-xl">
        <h1 className="font-serif italic text-3xl text-center mb-2">Welcome Back</h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 text-center mb-8">Sign in to manage your flipbooks</p>

        {!hasSupabaseConfig && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center rounded-sm">
            <strong>Demo Mode:</strong> Supabase keys are missing.
            You must add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use real authentication.
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 pl-10 text-sm outline-none transition-colors" 
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 pl-10 text-sm outline-none transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !hasSupabaseConfig}
            className="w-full bg-[#1A1A1A] text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (!hasSupabaseConfig) return;
              await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/admin' } });
            }}
            disabled={isLoading || !hasSupabaseConfig}
            className="w-full bg-white border border-[#E5E4E2] text-[#1A1A1A] py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          
          <div className="text-center pt-4">
            <Link to="/register" className="text-xs text-gray-500 hover:text-[#C5A059] transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

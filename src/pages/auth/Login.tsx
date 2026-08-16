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

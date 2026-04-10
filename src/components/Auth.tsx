import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username }]);
          if (profileError) console.error('Error creating profile:', profileError);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <div className="brutal-card max-w-md w-full bg-white">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            <span className="font-extrabold">carbon</span>
            <span className="font-normal">scio</span>
          </h1>
          <p className="font-bold text-gray-600">
            {isLogin ? "Welcome back, carbon-breather." : "Join the literacy revolution."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block font-bold uppercase text-sm">Username (be creative, or don't)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="brutal-input w-full pl-12"
                  placeholder="earth_saver_69"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block font-bold uppercase text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brutal-input w-full pl-12"
                placeholder="you@planet.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold uppercase text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="brutal-input w-full pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-600 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="brutal-btn-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-4 border-black text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold hover:underline"
          >
            {isLogin ? "New here? Create an account." : "Already literate? Login."}
          </button>
        </div>
      </div>
    </div>
  );
}

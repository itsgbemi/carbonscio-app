import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, RefreshCw, Check, X, AlertCircle } from 'lucide-react';
import Loading from './Loading';

const FUN_ADJECTIVES = ['Green', 'Eco', 'Solar', 'Windy', 'Leafy', 'Carbon', 'Clean', 'Pure', 'Earth', 'Bio'];
const FUN_NOUNS = ['Warrior', 'Hero', 'Guardian', 'Saver', 'Lover', 'Friend', 'Knight', 'Wizard', 'Spirit', 'Soul'];

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (username.length >= 3) {
      const timer = setTimeout(() => {
        checkUsername(username);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus('idle');
    }
  }, [username]);

  const checkUsername = async (name: string) => {
    setUsernameStatus('checking');
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', name)
      .single();
    
    if (error && error.code === 'PGRST116') { // Not found
      setUsernameStatus('available');
    } else {
      setUsernameStatus('taken');
    }
  };

  const generateRandomUsername = () => {
    const adj = FUN_ADJECTIVES[Math.floor(Math.random() * FUN_ADJECTIVES.length)];
    const noun = FUN_NOUNS[Math.floor(Math.random() * FUN_NOUNS.length)];
    const num = Math.floor(Math.random() * 1000);
    const newName = `${adj}${noun}${num}`;
    setUsername(newName);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        let loginEmail = identifier;
        
        // If it doesn't look like an email, try to find the email by username
        if (!identifier.includes('@')) {
          const { data: userData, error: userLookupError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .single();
          
          if (userLookupError || !userData?.email) {
            throw new Error('Could not find email for this username. If you haven\'t logged in with email recently, please do so once to sync your account.');
          }
          loginEmail = userData.email;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        if (usernameStatus !== 'available') throw new Error('Please choose an available username.');
        
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username, email }]);
          if (profileError) console.error('Error creating profile:', profileError);
        }
        setMessage('Check your email for the confirmation link!');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
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
            {mode === 'login' ? "Welcome back, carbon-breather." : 
             mode === 'signup' ? "Join the literacy revolution." : 
             "Don't worry, we all forget things."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="block font-bold uppercase text-sm">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="brutal-input w-full pl-12 pr-24 bg-white"
                  placeholder="earth_saver_69"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {usernameStatus === 'checking' && <RefreshCw className="animate-spin text-gray-400" size={16} />}
                  {usernameStatus === 'available' && <Check className="text-green-500" size={16} />}
                  {usernameStatus === 'taken' && <X className="text-red-500" size={16} />}
                  <button 
                    type="button"
                    onClick={generateRandomUsername}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Generate random username"
                  >
                    <RefreshCw size={16} className="text-brutal-blue" />
                  </button>
                </div>
              </div>
              {usernameStatus === 'taken' && <p className="text-xs text-red-500 font-bold">That one's taken, be more original.</p>}
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-2">
              <label className="block font-bold uppercase text-sm">Email or Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="brutal-input w-full pl-12 bg-white"
                  placeholder="you@planet.com or username"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block font-bold uppercase text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="brutal-input w-full pl-12 bg-white"
                  placeholder="you@planet.com"
                  required
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-bold uppercase text-sm">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-bold hover:underline text-gray-500"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="brutal-input w-full pl-12 bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-600 font-bold text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-100 border-2 border-green-600 text-green-600 font-bold text-sm flex items-center gap-2">
              <Check size={16} />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="brutal-btn-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            {loading ? <Loading /> : 
             mode === 'login' ? "Login" : 
             mode === 'signup' ? "Sign Up" : "Reset Password"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-4 border-black text-center space-y-2">
          {mode === 'login' ? (
            <button
              onClick={() => setMode('signup')}
              className="font-bold hover:underline"
            >
              New here? Create an account.
            </button>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="font-bold hover:underline"
            >
              Back to login.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

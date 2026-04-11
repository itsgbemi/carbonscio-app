import React, { useState, useEffect } from 'react';
import { Shield, User, Check, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Loading from './Loading';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Settings() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (newUsername.length >= 3 && newUsername !== username) {
      const timer = setTimeout(() => {
        checkUsername(newUsername);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus('idle');
    }
  }, [newUsername, username]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      if (data) {
        setUsername(data.username || '');
        setNewUsername(data.username || '');
      }
    }
  };

  const checkUsername = async (name: string) => {
    setUsernameStatus('checking');
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', name)
      .single();
    
    if (error && error.code === 'PGRST116') {
      setUsernameStatus('available');
    } else {
      setUsernameStatus('taken');
    }
  };

  const updateUsername = async () => {
    if (usernameStatus !== 'available') return;
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUsername(newUsername);
      setMessage('Username updated successfully! Your new identity is ready.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-5xl font-black tracking-tighter mb-2">Settings</h2>
        <p className="text-xl font-bold text-gray-600 italic">"Customize your experience. Not that it'll change the outcome."</p>
      </header>

      <div className="space-y-6">
        <section className="brutal-card bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black flex items-center gap-2">
              <User /> Profile Settings
            </h3>
            <button 
              onClick={copyUsername}
              className="flex items-center gap-2 text-sm font-bold hover:underline"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Username"}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-bold uppercase text-sm">Update Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="brutal-input w-full pr-12 bg-white"
                  placeholder="new_username"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {usernameStatus === 'checking' && <RefreshCw className="animate-spin text-gray-400" size={16} />}
                  {usernameStatus === 'available' && <Check className="text-green-500" size={16} />}
                  {usernameStatus === 'taken' && <X className="text-red-500" size={16} />}
                </div>
              </div>
              {usernameStatus === 'taken' && <p className="text-xs text-red-500 font-bold">That one's taken. Try something more unique.</p>}
              {usernameStatus === 'available' && <p className="text-xs text-green-600 font-bold">Looking good! This one is free.</p>}
            </div>

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
              onClick={updateUsername}
              disabled={loading || usernameStatus !== 'available'}
              className="brutal-btn-primary w-full flex items-center justify-center"
            >
              {loading ? <Loading /> : "Save New Username"}
            </button>
          </div>
        </section>

        <section className="brutal-card bg-white">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Shield /> Privacy & Data
          </h3>
          <div className="space-y-4">
            <button className="brutal-btn w-full text-left bg-white">Export My Data (Keep a record of your climate journey)</button>
            <button className="brutal-btn w-full text-left bg-red-100 text-red-600">Delete Account (We'll be sad to see you go)</button>
          </div>
        </section>
      </div>
    </div>
  );
}

import { X } from 'lucide-react';

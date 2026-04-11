import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import Overview from './components/Overview';
import Quiz from './components/Quiz';
import Calendar from './components/Calendar';
import Database from './components/Database';
import Wiki from './components/Wiki';
import Settings from './components/Settings';
import Loading from './components/Loading';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Auth session error:', error.message);
        // Clear stale session if there's an error (e.g., invalid refresh token)
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
        if (session?.user) syncProfileEmail(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        setSession(session);
        if (session?.user) syncProfileEmail(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncProfileEmail = async (user: any) => {
    // Ensure the profiles table has the user's email for username login functionality
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();
    
    if (!data?.email && user.email) {
      await supabase
        .from('profiles')
        .update({ email: user.email })
        .eq('id', user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50 flex-col lg:flex-row">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/database" element={<Database />} />
              <Route path="/wiki" element={<Wiki />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

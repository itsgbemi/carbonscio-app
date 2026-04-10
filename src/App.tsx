import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import Overview from './components/Overview';
import Quiz from './components/Quiz';
import Calendar from './components/Calendar';
import Database from './components/Database';
import AskAI from './components/AskAI';
import Wiki from './components/Wiki';
import Settings from './components/Settings';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-4xl font-black animate-bounce">LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/leaderboard" element={<Overview />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/database" element={<Database />} />
              <Route path="/ask-ai" element={<AskAI />} />
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

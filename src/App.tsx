import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import Home from './pages/Home';
import Edit from './pages/Edit';
import History from './pages/History';


export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

    if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


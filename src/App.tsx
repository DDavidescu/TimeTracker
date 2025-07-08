import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import Categories from './components/Categories';
import Occupations from './components/Occupations';

type Category = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
};

type Occupation = {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
  categories?: {
    name: string;
  };
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);

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

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) console.error(error);
    else setCategories(data);
  };

  const fetchOccupations = async () => {
    const { data } = await supabase
      .from('occupations')
      .select(`
        *,
        categories ( name )
      `);
    setOccupations(data || []);
  };

  useEffect(() => {
    if (session) {
      fetchCategories();
      fetchOccupations();
    }
  }, [session]);

  useEffect(() => {
   if (!session) {
    fetchCategories();
    fetchOccupations();
    } 
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50"> 
      <button
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button> 

      <Categories categories={categories} 
                  fetchCategories={fetchCategories} 
                  fetchOccupations={fetchOccupations}
      />
      <Occupations 
                  categories={categories} 
                  fetchCategories={fetchCategories} 
                  occupations={occupations}
                  fetchOccupations={fetchOccupations}/>
    </div>
  );
}

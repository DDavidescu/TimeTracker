import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Categories from '../components/Categories';
import Occupations from '../components/Occupations';
import BackButton from '../components/Shared/BackButton';

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
};

export default function Edit() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchOccupations();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) console.error(error);
    else setCategories(data || []);
  };

  const fetchOccupations = async () => {
    const { data, error } = await supabase
      .from('occupations')
      .select('*, categories ( name )');
    if (error) console.error(error);
    else setOccupations(data || []);
  };

return (
  <div className="min-h-screen bg-blue-50">
    {/* Header */}
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 transition duration-300 hover:text-blue-600 hover:scale-105">
          Edit Time Tracker
        </h1>
        <BackButton onClick={() => navigate('/home')}>
          Back
        </BackButton>
      </div>
    </header>

    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
        <Categories
          categories={categories}
          fetchCategories={fetchCategories}
          fetchOccupations={fetchOccupations}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-green-100">
        <Occupations
          categories={categories}
          occupations={occupations}
          fetchOccupations={fetchOccupations}
        />
      </div>
    </main>
  </div>
);

}

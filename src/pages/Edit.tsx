import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Categories from '../components/Categories';
import Occupations from '../components/Occupations';

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Edit Time Tracker</h1>
        <button
          onClick={() => navigate('/home')}
          className="text-lg bg-gray-300 px-3 py-1 rounded"
        >
          Back
        </button>
      </div>

      <Categories
        categories={categories}
        fetchCategories={fetchCategories}
        fetchOccupations={fetchOccupations}
      />

      <Occupations
        categories={categories}
        occupations={occupations}
        fetchOccupations={fetchOccupations}
      />
    </div>
  );
}

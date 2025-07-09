import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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

type Props = {
  categories: Category[];
  occupations: Occupation[];
  fetchOccupations: () => void;
};

export default function Occupations({ categories, occupations, fetchOccupations }: Props) {
  const [newOccupationName, setNewOccupationName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleAddOccupation = async () => {
    if (!newOccupationName.trim() || !selectedCategoryId) {
      alert('Name and Category are required');
      return;
    }
    const { error } = await supabase
      .from('occupations')
      .insert([{ name: newOccupationName, category_id: selectedCategoryId }]);
    if (error) {
      console.error(error);
      alert('Failed to add occupation');
    } else {
      setNewOccupationName('');
      setSelectedCategoryId('');
      fetchOccupations();
    }
  };

  const handleDeleteOccupation = async (id: string) => {
    const { error } = await supabase
      .from('occupations')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(error);
      alert('Failed to delete');
    } else {
      fetchOccupations();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Occupations</h1>

      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Occupation</h2>
        <input
          type="text"
          placeholder="Occupation name"
          value={newOccupationName}
          onChange={(e) => setNewOccupationName(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <select
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddOccupation}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Occupation
        </button>
      </div>

      <ul className="space-y-2 mt-4">
        {occupations.map(occ => (
          <li
            key={occ.id}
            className="p-2 rounded bg-gray-100 text-black flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{occ.name}</div>
              <div className="text-sm text-gray-700">
                Category: {occ.categories?.name}
              </div>
            </div>
            <button
              onClick={() => handleDeleteOccupation(occ.id)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

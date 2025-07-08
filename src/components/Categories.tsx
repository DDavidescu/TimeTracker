import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Category = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
};

type Props = {
  categories: Category[];
  fetchCategories: () => void;
  fetchOccupations: () => void;
};

export default function Categories({ categories, fetchCategories, fetchOccupations }: Props) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      alert('Name is required');
      return;
    }
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newName, color: newColor || null }]);
    if (error) {
      console.error(error);
      alert('Failed to add category');
    } else {
      setNewName('');
      setNewColor('');
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(error);
      alert('Failed to delete');
    } else {
      fetchCategories();
      fetchOccupations();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">TimeTracker - Categories</h1>
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
        <input
          type="text"
          placeholder="Category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Color (optional)"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Category
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="p-2 rounded flex justify-between items-center"
            style={{
              backgroundColor: cat.color || '#f3f4f6',
              color: '#000',
            }}
          >
            <div>
              <div className="font-bold">{cat.name}</div>
              <div className="text-sm text-gray-700">{cat.color}</div>
            </div>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
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

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import DeleteButton from './Shared/DeleteButton';

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type Props = {
  categories: Category[];
  fetchCategories: () => void;
  fetchOccupations: () => void;
};

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Yellow', value: '#FACC15' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Gray', value: '#6B7280' },
];

export default function Categories({ categories, fetchCategories, fetchOccupations }: Props) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [colorMode, setColorMode] = useState<'suggested' | 'custom'>('suggested');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [customColor, setCustomColor] = useState('#000000');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const colorToSave = colorMode === 'custom' ? customColor : selectedColor;

    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName, color: colorToSave }]);

    if (error) {
      console.error(error);
      alert('Failed to add category.');
    } else {
      setNewCategoryName('');
      setSelectedColor(COLOR_OPTIONS[0].value);
      setCustomColor('#000000');
      setColorMode('suggested');
      fetchCategories();
      fetchOccupations();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="border border-blue-100 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
        <div className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter category name"
            />
          </div>

          {/* Color Mode Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Color Selection Type</label>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as 'suggested' | 'custom')}
              className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="suggested">Suggested Color</option>
              <option value="custom">Pick Custom Color</option>
            </select>
          </div>

          {/* Conditional Color Input */}
          {colorMode === 'suggested' ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Choose Suggested Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {COLOR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pick Custom Color</label>
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-10 border-gray-300 rounded-md cursor-pointer"
              />
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={handleAddCategory}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:text-base transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Existing Categories */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories available.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map(cat => (
              <li
                key={cat.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2"
              >
                <span className="flex items-center space-x-2">
                  {cat.color && (
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                  )}
                  <span className="text-gray-800">{cat.name}</span>
                </span>
                  <DeleteButton
                    id={cat.id}
                    table="categories"
                    onDeleted={() => {
                      fetchCategories();
                      fetchOccupations();
                    }}
                  />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

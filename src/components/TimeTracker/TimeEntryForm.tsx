import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
};

type Occupation = {
  id: string;
  name: string;
  category_id: string;
};

type Props = {
  categories: Category[];
  occupations: Occupation[];
  onSubmit: (data: {
    occupationId: string;
    categoryId: string;
    hours: number;
    minutes: number;
  }) => void;
};

export default function TimeEntryForm({ categories, occupations, onSubmit }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredOccupations, setFilteredOccupations] = useState<Occupation[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    setFilteredOccupations(
      occupations.filter(occ => occ.category_id === selectedCategory)
    );
    setSelectedOccupation('');
  }, [selectedCategory, occupations]);

  const handleSubmit = () => {
    if (!selectedOccupation) {
      alert('Please select an occupation');
      return;
    }

    const hoursInt = parseInt(hours, 10) || 0;
    const minutesInt = parseInt(minutes, 10) || 0;

    if (hoursInt === 0 && minutesInt === 0) {
      alert('Please enter at least Hours or Minutes');
      return;
    }

    onSubmit({
      categoryId: selectedCategory,
      occupationId: selectedOccupation,
      hours: hoursInt,
      minutes: minutesInt,
    });

    setSelectedCategory('');
    setSelectedOccupation('');
    setHours('');
    setMinutes('');
  };

  const occupationDisabled = selectedCategory === '';
  const timeInputsDisabled = selectedOccupation === '';
  const addEntryDisabled = hours === '' && minutes === '';

  return (
    <div className="bg-white bg-gradient-to-r from-slate-100 to-blue-100 rounded-xl shadow-lg p-6 w-full border border-slate-500">
      <h2 className="text-2xl font-semibold mb-4">Log Time Entry</h2>

      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className="border border-slate-400 rounded-md px-2 py-1 md:py-3 mb-3 md:mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={selectedOccupation}
        onChange={e => setSelectedOccupation(e.target.value)}
        className="border border-slate-400 rounded-md px-2 py-1 md:py-3 mb-3 md:mb-6 w-full disabled:bg-gray-300 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        disabled={occupationDisabled}
      >
        <option value="">Select Occupation</option>
        {filteredOccupations.map(occ => (
          <option key={occ.id} value={occ.id}>
            {occ.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2 mb-3 md:mb-6">
        <input
          type="number"
          placeholder="Hours"
          value={hours}
          onChange={e => setHours(e.target.value)}
          disabled={timeInputsDisabled}
          className="no-spinner border border-slate-400 rounded px-2 py-1 md:py-2 w-1/2 disabled:bg-gray-300 disabled:text-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
          disabled={timeInputsDisabled}
          className="no-spinner border border-slate-400 rounded px-2 py-1 md:py-2 w-1/2 disabled:bg-gray-300 disabled:text-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={addEntryDisabled}
        className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-300 disabled:text-gray-500"
      >
        Add Entry
      </button>
    </div>
  );
}


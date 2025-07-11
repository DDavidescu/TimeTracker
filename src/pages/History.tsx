import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { filterLogs } from '../components/Filtering/FilterHistoryLogs';
import BackButton from '../components/Shared/BackButton';
import DeleteButton from '../components/Shared/DeleteButton';


export type TimeLog = {
  id: string;
  occupation_id: string;
  date: string;
  hours: number;
  minutes: number;
  occupations?: {
    id: string;
    name: string;
    category_id: string;
    categories?: {
      id: string;
      name: string;
    }
  };
};

export default function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('time_logs')
      .select(`
        *,
        occupations ( name )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setLogs(data || []);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('ro-RO');
  };

  // Apply filtering
  const displayedLogs = selectedFilter ? filterLogs(logs, selectedFilter) : logs;

return (
<div className="min-h-screen bg-blue-50">
{/* Header */}
<header className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
      Time Entry History
    </h1>
    <BackButton onClick={() => navigate('/home')}>
      Back
    </BackButton>
  </div>
</header>    
<div className="max-w-3xl mx-auto p-4 space-y-6">
      


      {/* Filter */}
      <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">Filter:</label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last two days">Last two days</option>
          <option value="Last week">Last week</option>
          <option value="Last two weeks">Last two weeks</option>
          <option value="Last two months">Last two months</option>
        </select>
      </div>

      {/* No entries message */}
      {displayedLogs.length === 0 && (
        <p className="text-center text-gray-500 italic">
          No entries logged yet.
        </p>
      )}

      {/* Log list */}
      <ul className="space-y-4">
        {displayedLogs.map(log => (
          <li
            key={log.id}
            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-lg text-gray-800">
                {log.occupations?.name || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600">
                Date: {formatDate(log.date)}
              </div>
              <div className="text-sm text-gray-600">
                {log.hours}h {log.minutes}m
              </div>
            </div>
              <DeleteButton
                id={log.id}
                table="time_logs"
                onDeleted={fetchLogs}
              />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

}

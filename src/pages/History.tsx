import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type TimeLog = {
  id: string;
  occupation_id: string;
  date: string;
  hours: number;
  minutes: number;
  occupations?: {
    name: string;
  };
};

export default function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<TimeLog[]>([]);

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('time_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Failed to delete');
    } else {
      fetchLogs();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Time Entry History</h1>
        <button
          onClick={() => navigate('/home')}
          className="text-lg bg-gray-300 px-3 py-1 rounded"
        >
          Back
        </button>
      </div>

      {logs.length === 0 && (
        <p className="text-gray-600">No entries logged yet.</p>
      )}

      <ul className="space-y-2">
        {logs.map(log => (
          <li
            key={log.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{log.occupations?.name || 'Unknown'}</div>
              <div className="text-sm text-gray-700">Date: {log.date}</div>
              <div className="text-sm text-gray-700">
                {log.hours}h {log.minutes}m
              </div>
            </div>
            <button
              onClick={() => handleDelete(log.id)}
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

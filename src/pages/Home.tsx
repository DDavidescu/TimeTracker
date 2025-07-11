import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/TimeTracker/Header';
import TimeEntryForm from '../components/TimeTracker/TimeEntryForm';
import DailySummary from '../components/TimeTracker/DailySummary';

type Category = {
  id: string;
  name: string;
};

type Occupation = {
  id: string;
  name: string;
  category_id: string;
};

type TimeLog = {
  id: string;
  category_id: string;
  occupation_id: string;
  date: string;
  hours: number;
  minutes: number;
};

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [todayLogs, setTodayLogs] = useState<TimeLog[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchOccupations();
    fetchTodayLogs();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchOccupations = async () => {
    const { data } = await supabase.from('occupations').select('*');
    if (data) setOccupations(data);
  };

  const getTodayISODate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const fetchTodayLogs = async () => {
    const today = getTodayISODate();
    const { data } = await supabase
      .from('time_logs')
      .select('*')
      .eq('date', today);
    if (data) setTodayLogs(data);
  };

  const handleAddTimeLog = async ({
    categoryId,
    occupationId,
    hours,
    minutes
  }: {
    categoryId: string;
    occupationId: string;
    hours: number;
    minutes: number;
  }) => {
    const today = getTodayISODate();
    const { error } = await supabase
      .from('time_logs')
      .insert([{
        category_id: categoryId,
        occupation_id: occupationId,
        date: today,
        hours,
        minutes
      }]);

    if (error) {
      console.error(error);
      alert('Failed to add time log');
    } else {
      fetchTodayLogs();
    }
  };

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.hours * 60 + log.minutes, 0);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header
        onEditClick={() => navigate('/edit')}
        onSignOut={() => supabase.auth.signOut()}
        onHistoryClick={() => navigate('/history')}
        onDetailedViewClick={() => navigate('/detailed-view')}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <DailySummary totalMinutes={totalMinutes} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <TimeEntryForm
            categories={categories}
            occupations={occupations}
            onSubmit={handleAddTimeLog}
          />
        </div>
      </main>
    </div>
  );
}

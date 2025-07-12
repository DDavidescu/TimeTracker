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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-teal-400 flex flex-col">
      <Header
        onEditClick={() => navigate('/edit')}
        onSignOut={() => supabase.auth.signOut()}
        onHistoryClick={() => navigate('/history')}
        onDetailedViewClick={() => navigate('/detailed-view')}
      />

      <main className="flex-1 flex flex-col items-center max-w-3xl md:max-w-4xl w-full mx-auto p-6 pt-15 space-y-1 md:space-y-10 gap-10 md:gap-0">
        <div>
          <h1 className="
            block md:hidden
            text-5xl 
            font-extrabold
            transition
            duration-300
            hover:scale-105
          ">
            Time Tracker
          </h1>
        </div>

          <DailySummary totalMinutes={totalMinutes} />

          <TimeEntryForm
            categories={categories}
            occupations={occupations}
            onSubmit={handleAddTimeLog}
          />
      </main>
    </div>
  );
}

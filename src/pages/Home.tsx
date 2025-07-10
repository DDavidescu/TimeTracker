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

  const fetchTodayLogs = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('time_logs')
      .select('*')
      .eq('date', today);
    if (data) setTodayLogs(data);
  };

  const handleAddTimeLog = async ({ categoryId, occupationId, hours, minutes }: { categoryId: string; occupationId: string; hours: number; minutes: number }) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('time_logs')
      .insert([{ category_id: categoryId, occupation_id: occupationId, date: today, hours, minutes }]);

    if (error) {
      console.error(error);
      alert('Failed to add time log');
    } else {
      fetchTodayLogs();
    }
  };

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.hours * 60 + log.minutes, 0);

  return (
    <div className="p-4">
      <Header 
      onEditClick = {() => navigate('/edit')}
      onSignOut = {() => supabase.auth.signOut()}
      onHistoryClick = {() => navigate('/history')}
      onDetailedViewClick = {() => navigate('/detailed-view')}
      />

      <DailySummary totalMinutes={totalMinutes} />

      <TimeEntryForm
        categories={categories}
        occupations={occupations}
        onSubmit={handleAddTimeLog}
      />
    </div>
  );
}

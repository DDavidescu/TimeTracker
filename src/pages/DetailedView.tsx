import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { TimeLog } from './History';
import { filterDetailedAnalysisLogs, type AnalysisFilters as AnalysisFiltersType } from '../components/Filtering/filterDetailedAnalysisLogs';
import AnalysisTotal from '../components/Filtering/AnalysisTotal';
import PieChart from '../components/Charts/PieChart';
import StackedBarChart from '../components/Charts/StackedBarChart';
import AnalysisFilters from '../components/Filtering/AnalysisFilter';
import BackButton from '../components/Shared/BackButton';

export default function DetailedView() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [availableCategories, setAvailableCategories] = useState<{ id: string, name: string }[]>([]);
  const [availableOccupations, setAvailableOccupations] = useState<{ id: string, name: string }[]>([]);
  const [filters, setFilters] = useState<AnalysisFiltersType>({
    timeRange: '',
    selectedCategoryIds: [],
    selectedOccupationIds: [],
    minimumDuration: 0,
  });
  const [grouping, setGrouping] = useState<'Category' | 'Occupation'>('Category');

  // Load logs on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Automatically re-apply filtering when logs or filters change
  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [logs, filters, loading]);

  const fetchLogs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('time_logs')
      .select(`
        *,
        occupations (
          id,
          name,
          category_id,
          categories (
            id,
            name
          )
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
      return;
    }

    setLogs(data || []);

    // Build available filter lists from joined data
    const categories = new Map<string, string>();
    const occupations = new Map<string, string>();

    (data || []).forEach(log => {
      if (log.occupations?.categories) {
        categories.set(log.occupations.categories.id, log.occupations.categories.name);
      }
      if (log.occupations) {
        occupations.set(log.occupations.id, log.occupations.name);
      }
    });

    setAvailableCategories(Array.from(categories.entries()).map(([id, name]) => ({ id, name })));
    setAvailableOccupations(Array.from(occupations.entries()).map(([id, name]) => ({ id, name })));

    setLoading(false);
  };

  const applyFilters = () => {
    const result = filterDetailedAnalysisLogs(logs, filters);
    setFilteredLogs(result);
  };

return (
  <div className="min-h-screen bg-blue-50">
    {/* Header */}
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 transition duration-300 hover:text-blue-600 hover:scale-105">
          Detailed Analysis
        </h1>
        <BackButton onClick={() => navigate('/home')}>
          Back
        </BackButton>
      </div>
    </header>

    <main className="max-w-5xl mx-auto my-7 px-4 py-6 space-y-6">
      {loading ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
          Loading...
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow p-6">
            <AnalysisFilters
              timeRange={filters.timeRange}
              setTimeRange={(val) => setFilters(prev => ({ ...prev, timeRange: val }))}
              availableCategories={availableCategories}
              selectedCategoryIds={filters.selectedCategoryIds}
              setSelectedCategoryIds={(val) => setFilters(prev => ({ ...prev, selectedCategoryIds: val }))}
              availableOccupations={availableOccupations}
              selectedOccupationIds={filters.selectedOccupationIds}
              setSelectedOccupationIds={(val) => setFilters(prev => ({ ...prev, selectedOccupationIds: val }))}
              grouping={grouping}
              setGrouping={setGrouping}
              minimumDuration={filters.minimumDuration}
              setMinimumDuration={(val) => setFilters(prev => ({ ...prev, minimumDuration: val }))}
            />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <AnalysisTotal logs={filteredLogs} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pie Chart</h2>
              <PieChart logs={filteredLogs} grouping={grouping} />
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Stacked Bar Chart</h2>
              <StackedBarChart logs={filteredLogs} grouping={grouping} />
            </div>
          </div>
        </>
      )}
    </main>
  </div>
);

}

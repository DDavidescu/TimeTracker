import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { TimeLog } from './History';
import { filterDetailedAnalysisLogs, type AnalysisFilters as AnalysisFiltersType } from '../components/Filtering/filterDetailedAnalysisLogs';
import PieChart from '../components/Charts/PieChart';
import StackedBarChart from '../components/Charts/StackedBarChart';
import AnalysisFilters from '../components/Filtering/AnalysisFilter';

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Detailed Analysis</h1>
        <button
          onClick={() => navigate('/home')}
          className="text-lg bg-gray-300 px-3 py-1 rounded"
        >
          Back to Home
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Pie Chart</h2>
              <PieChart logs={filteredLogs} grouping={grouping} />
            </div>
            <div className="border p-4 rounded">
              <h2 className="text-xl font-bold mb-2">Stacked Bar Chart</h2>
              <StackedBarChart logs={filteredLogs} grouping={grouping} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

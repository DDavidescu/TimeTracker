// filterDetailedAnalysisLogs.ts
import { filterLogs as filterByTimeRange } from './FilterHistoryLogs';
import type { TimeLog } from '../../pages/History';

export interface AnalysisFilters {
  timeRange: string;
  selectedCategoryIds: string[];
  selectedOccupationIds: string[];
  minimumDuration: number;
}

export function filterDetailedAnalysisLogs(
  logs: TimeLog[],
  filters: AnalysisFilters
): TimeLog[] {
  // 1. Time range
  let result = filterByTimeRange(logs, filters.timeRange);

  // 2. Minimum duration
  result = result.filter(log => {
    const totalMinutes = log.hours * 60 + log.minutes;
    return totalMinutes >= filters.minimumDuration;
  });

  // 3. Category filtering
  if (filters.selectedCategoryIds.length > 0) {
    result = result.filter(log =>
      log.occupations?.category_id !== undefined &&
      filters.selectedCategoryIds.includes(log.occupations.category_id)
    );
  }

  // 4. Occupation filtering
  if (filters.selectedOccupationIds.length > 0) {
    result = result.filter(log =>
      filters.selectedOccupationIds.includes(log.occupation_id)
    );
  }

  return result;
}

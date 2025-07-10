// FilterLogs.ts
import { isSameDay, subDays, subWeeks, subMonths, parseISO, isAfter } from 'date-fns';

import type { TimeLog } from '../../pages/History';

export function filterLogs(logs: TimeLog[], filter: string): TimeLog[] {
  const now = new Date();

  return logs.filter(log => {
    const logDate = parseISO(log.date);

    switch (filter) {
      case 'Today':
        return isSameDay(logDate, now);

      case 'Yesterday':
        return isSameDay(logDate, subDays(now, 1));

      case 'Last two days':
        return isAfter(logDate, subDays(now, 2));

      case 'Last week':
        return isAfter(logDate, subWeeks(now, 1));

      case 'Last two weeks':
        return isAfter(logDate, subWeeks(now, 2));

      case 'Last two months':
        return isAfter(logDate, subMonths(now, 2));

      default:
        return true;
    }
  });
}

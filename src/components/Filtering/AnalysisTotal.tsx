import type { TimeLog } from '../../pages/History';

interface Props {
  logs: TimeLog[];
}

export default function AnalysisSummary({ logs }: Props) {
  const getCategoryTotals = () => {
    const totals = new Map<string, number>();
    logs.forEach(log => {
      const name = log.occupations?.categories?.name || 'Unknown Category';
      const minutes = log.hours * 60 + log.minutes;
      totals.set(name, (totals.get(name) || 0) + minutes);
    });
    return Array.from(totals.entries()).map(([name, minutes]) => ({
      name,
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    }));
  };

  const getOccupationTotals = () => {
    const totals = new Map<string, number>();
    logs.forEach(log => {
      const name = log.occupations?.name || 'Unknown Occupation';
      const minutes = log.hours * 60 + log.minutes;
      totals.set(name, (totals.get(name) || 0) + minutes);
    });
    return Array.from(totals.entries()).map(([name, minutes]) => ({
      name,
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    }));
  };

  const categoryTotals = getCategoryTotals();
  const occupationTotals = getOccupationTotals();

  return (
    <div className="border p-4 rounded mt-4 bg-white">
      <h2 className="text-xl font-bold mb-2">Analysis Summary</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Category Totals:</h3>
        {categoryTotals.length === 0 ? (
          <p className="text-gray-500">No data for categories.</p>
        ) : (
          <ul className="list-disc ml-5">
            {categoryTotals.map((item, idx) => (
              <li key={idx}>
                {item.name}: {item.hours}h {item.minutes}m
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold">Occupation Totals:</h3>
        {occupationTotals.length === 0 ? (
          <p className="text-gray-500">No data for occupations.</p>
        ) : (
          <ul className="list-disc ml-5">
            {occupationTotals.map((item, idx) => (
              <li key={idx}>
                {item.name}: {item.hours}h {item.minutes}m
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

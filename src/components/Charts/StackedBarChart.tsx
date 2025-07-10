import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeLog } from '../../pages/History';

interface Props {
  logs: TimeLog[];
  grouping: 'Category' | 'Occupation';
}

export default function StackedBarChart({ logs, grouping }: Props) {
  // Aggregate data by date and group
  const summary = new Map<string, Map<string, number>>();

  logs.forEach(log => {
    const date = log.date;
    const key = grouping === 'Category'
      ? log.occupations?.categories?.name || 'Unknown Category'
      : log.occupations?.name || 'Unknown Occupation';

    if (!summary.has(date)) {
      summary.set(date, new Map());
    }

    const groupMap = summary.get(date)!;
    const minutes = log.hours * 60 + log.minutes;
    groupMap.set(key, (groupMap.get(key) || 0) + minutes);
  });

  // Convert to array for Recharts
  const allGroups = new Set<string>();
  summary.forEach(map => map.forEach((_, group) => allGroups.add(group)));

  const data = Array.from(summary.entries()).map(([date, groups]) => {
    const entry: any = { date };
    groups.forEach((minutes, group) => {
      entry[group] = minutes;
    });
    return entry;
  });

  if (data.length === 0) {
    return <p className="text-gray-500">No data to display.</p>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF007F'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Array.from(allGroups).map((group, idx) => (
            <Bar key={group} dataKey={group} stackId="a" fill={COLORS[idx % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

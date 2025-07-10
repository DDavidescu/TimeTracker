import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeLog } from '../../pages/History';

interface Props {
  logs: TimeLog[];
  grouping: 'Category' | 'Occupation';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF007F'];

export default function PieChart({ logs, grouping }: Props) {
  const summary = new Map<string, number>();

  logs.forEach(log => {
    const key = grouping === 'Category'
      ? log.occupations?.categories?.name || 'Unknown Category'
      : log.occupations?.name || 'Unknown Occupation';

    const minutes = log.hours * 60 + log.minutes;
    summary.set(key, (summary.get(key) || 0) + minutes);
  });

  const data = Array.from(summary.entries()).map(([label, minutes]) => ({
    name: label,
    value: minutes
  }));

  if (data.length === 0) {
    return <p className="text-gray-500">No data to display.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

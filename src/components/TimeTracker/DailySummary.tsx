type Props = {
  totalMinutes: number;
};

export default function DailySummary({ totalMinutes }: Props) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const goalReached = totalMinutes >= 480;

  return (
    <div className="mb-4 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Today's Total</h2>
      <p className={`text-lg ${goalReached ? 'text-green-600 font-bold' : 'text-gray-800'}`}>
        {hours}h {minutes}m / 8h target
      </p>
      {goalReached && (
        <div className="mt-2 p-2 rounded bg-green-100 text-green-700">
          🎉 Great job! You've hit your 8h goal today!
        </div>
      )}
    </div>
  );
}

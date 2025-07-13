type Props = {
  totalMinutes: number;
};

export default function DailySummary({ totalMinutes }: Props) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const goalReached = totalMinutes >= 480;

  return (
    <div className="flex flex-col justify-center items-center mb-6 p-6 rounded-xl shadow-md bg-gradient-to-r from-slate-100 to-blue-100 w-full md:w-150 border border-slate-500">
      <h2 className="text-2xl md:text-4xl font-semibold mb-3">Today's Total</h2>
      <p
        className={`text-xl md:text-2xl ${
          goalReached ? 'text-green-600 font-bold' : 'text-gray-800'
        }`}
      >
        {hours}h {minutes}m / 8h target
      </p>
      {goalReached && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-600 text-green-700">
          🎉 Great job! You've hit your 8h goal today!
        </div>
      )}
    </div>
  );
}

type Props = {
  onEditClick: () => void;
  onHistoryClick: () => void;
  onSignOut: () => void;
  onDetailedViewClick: () => void; 
};

export default function Header({
  onEditClick,
  onHistoryClick,
  onSignOut,
  onDetailedViewClick
}: Props) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Time Tracker</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Add Entry
          </button>

          <button
            onClick={onHistoryClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            History
          </button>

          <button
            onClick={onDetailedViewClick}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Detailed
          </button>

          <button
            onClick={onSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

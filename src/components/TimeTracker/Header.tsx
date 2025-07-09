
type Props = {
  onEditClick: () => void;
  onHistoryClick: () => void;
  onSignOut: () => void;
};

export default function Header({ onEditClick, onHistoryClick, onSignOut }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold">Time Tracker</h1>
      <div className="flex gap-2">
        <button
          onClick={onEditClick}
          className="text-2xl bg-blue-500 text-white px-4 py-2 rounded"
        >
          +
        </button>
        <button
          onClick={onHistoryClick}
          className="text-lg bg-purple-500 text-white px-4 py-2 rounded"
        >
          View History
        </button>
        <button
          onClick={onSignOut}
          className="text-lg bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}


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
      <div className="h-20 md:h-23 mx-auto px-4 py-4 flex justify-center md:justify-between items-center">
        <h1 className="
          hidden md:block
          text-2xl md:text-4xl
          font-bold
          text-gray-800
          transition
          duration-300
          hover:text-blue-600
          hover:scale-105
        ">
          Time Tracker
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 md:px-7 md:py-3.5 cursor-pointer rounded-md text-md "
          >
            Add Entry
          </button>

          <button
            onClick={onHistoryClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-3 md:px-7 md:py-3.5 cursor-pointer rounded-md text-md"
          >
            History
          </button>

          <button
            onClick={onDetailedViewClick}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-3 md:px-7 md:py-3.5 cursor-pointer rounded-md text-md"
          >
            Detailed
          </button>

          <button
            onClick={onSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-3 md:px-7 md:py-3.5 cursor-pointer rounded-md text-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

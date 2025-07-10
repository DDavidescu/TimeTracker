interface Props {
  timeRange: string;
  setTimeRange: (val: string) => void;

  availableCategories: { id: string; name: string }[];
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (val: string[]) => void;

  availableOccupations: { id: string; name: string }[];
  selectedOccupationIds: string[];
  setSelectedOccupationIds: (val: string[]) => void;

  grouping: 'Category' | 'Occupation';
  setGrouping: (val: 'Category' | 'Occupation') => void;

  minimumDuration: number;
  setMinimumDuration: (val: number) => void;
}

export default function AnalysisFilters(props: Props) {
  // Helper for toggling
  const toggleCategory = (id: string) => {
    if (props.selectedCategoryIds.includes(id)) {
      props.setSelectedCategoryIds(props.selectedCategoryIds.filter(cid => cid !== id));
    } else {
      props.setSelectedCategoryIds([...props.selectedCategoryIds, id]);
    }
  };

  const toggleOccupation = (id: string) => {
    if (props.selectedOccupationIds.includes(id)) {
      props.setSelectedOccupationIds(props.selectedOccupationIds.filter(oid => oid !== id));
    } else {
      props.setSelectedOccupationIds([...props.selectedOccupationIds, id]);
    }
  };

  return (
    <div className="p-4 border rounded mb-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Time Range */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Time Range:</label>
        <select
          value={props.timeRange}
          onChange={(e) => props.setTimeRange(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">All</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last two days">Last two days</option>
          <option value="Last week">Last week</option>
          <option value="Last two weeks">Last two weeks</option>
          <option value="Last two months">Last two months</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Categories:</label>
        {props.availableCategories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories available.</p>
        ) : (
          <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto border rounded p-2">
            {props.availableCategories.map(cat => (
              <label key={cat.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={props.selectedCategoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="accent-blue-500"
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Occupations */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Occupations:</label>
        {props.availableOccupations.length === 0 ? (
          <p className="text-gray-500 text-sm">No occupations available.</p>
        ) : (
          <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto border rounded p-2">
            {props.availableOccupations.map(occ => (
              <label key={occ.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={props.selectedOccupationIds.includes(occ.id)}
                  onChange={() => toggleOccupation(occ.id)}
                  className="accent-green-500"
                />
                <span>{occ.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Grouping */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Grouping:</label>
        <select
          value={props.grouping}
          onChange={(e) => props.setGrouping(e.target.value as 'Category' | 'Occupation')}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="Category">By Category</option>
          <option value="Occupation">By Occupation</option>
        </select>
      </div>

      {/* Minimum Duration */}
      <div className="mb-2">
        <label className="block font-medium mb-1">Min Duration (mins):</label>
        <input
          type="number"
          value={props.minimumDuration}
          onChange={(e) => props.setMinimumDuration(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full"
          min={0}
        />
      </div>
    </div>
  );
}

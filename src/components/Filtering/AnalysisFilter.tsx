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
  <div className="p-6 space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Filters</h2>

    {/* Time Range */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Time Range</label>
      <select
        value={props.timeRange}
        onChange={(e) => props.setTimeRange(e.target.value)}
        className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Categories</label>
      {props.availableCategories.length === 0 ? (
        <p className="text-gray-400 italic text-sm">No categories available.</p>
      ) : (
        <div className="border border-blue-100 bg-white rounded-md max-h-48 overflow-y-auto p-3 space-y-2">
          {props.availableCategories.map(cat => (
            <label key={cat.id} className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={props.selectedCategoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="accent-blue-600"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Occupations */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Occupations</label>
      {props.availableOccupations.length === 0 ? (
        <p className="text-gray-400 italic text-sm">No occupations available.</p>
      ) : (
        <div className="border border-blue-100 bg-white rounded-md max-h-48 overflow-y-auto p-3 space-y-2">
          {props.availableOccupations.map(occ => (
            <label key={occ.id} className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={props.selectedOccupationIds.includes(occ.id)}
                onChange={() => toggleOccupation(occ.id)}
                className="accent-green-600"
              />
              <span>{occ.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Grouping */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Grouping</label>
      <select
        value={props.grouping}
        onChange={(e) => props.setGrouping(e.target.value as 'Category' | 'Occupation')}
        className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="Category">By Category</option>
        <option value="Occupation">By Occupation</option>
      </select>
    </div>

    {/* Minimum Duration */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Min Duration (mins)</label>
      <input
        type="number"
        value={props.minimumDuration}
        onChange={(e) => props.setMinimumDuration(Number(e.target.value))}
        className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        min={0}
      />
    </div>
  </div>
);

}

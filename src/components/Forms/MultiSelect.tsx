interface Option {
  value: string;
  text: string;
}

const MultiSelect: React.FC<{
  label: string;
  options: Option[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}> = ({ label, options, selectedOptions, onChange }) => {
  return (
      <div className="relative">
          {/* Label */}
          <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-700">
              {label}
          </label>

          {/* Multi-Select Dropdown */}
          <select
              id="roleSelect" // You can still keep this id here for proper form functionality.
              value={selectedOptions}
              onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))}
              multiple
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
              {options.map((option) => (
                  <option key={option.value} value={option.value}>
                      {option.text}
                  </option>
              ))}
          </select>
      </div>
  );
};

export default MultiSelect;

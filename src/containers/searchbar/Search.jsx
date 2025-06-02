import React from 'react';
import { Search as SearchIcon, Filter, Settings2 } from 'lucide-react';

const Search = () => {
  return (
    <div className="flex items-center justify-center p-4  z-50 bg-gray-50">
        {/* sticky top-14 */}
      <div className="relative w-full max-w-md flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <SearchIcon className="mx-3 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 focus:outline-none"
        />
        <button className="p-2 bg-gray-100 hover:bg-gray-200">
          <Settings2 className="text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Search;
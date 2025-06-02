import React, { useState } from 'react';
import Popular from '../popular/Popular.jsx';
import FoodList from '../food/FoodList.jsx'; 

const Categories = () => {
  const categories = ['New', 'Snacks', 'Salads', 'Main dishes'];
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  console.log(selectedCategory);
  return (
    <div className="p-4 rounded-2xl shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Categories</h2>
      <div className="flex space-x-3 p-2">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(category)}
            className={`px-5 py-2 text-sm font-medium rounded-full border shadow-sm transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-[#0EADBF] text-white border-[#0EADBF]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-[#0EADBF] hover:text-white hover:border-[#0EADBF]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Conditional rendering */}
      {selectedCategory ? (
        <FoodList category={selectedCategory} />
      ) : (
        <Popular />
      )}
    </div>
  );
};

export default Categories;

import React, { useState, useEffect, useRef  } from 'react';
import PopularGroc from '../popular/PopularGroc.jsx';
import GrocList from '../grocery/GrocList.jsx'; 
import axios from "axios";

const GrocCategories = () => {

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
      try {
        const response = await axios.get(`${getBaseUrl()}/groceries`);
        const data = response.data.data;
        const uniqueCategories = [
          ...new Set(data.map(item => item.category).filter(Boolean))
        ];
        // console.log(uniqueCategories);
        setCategories(uniqueCategories);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (category) => {
    // Avoid toggling back to null if the same category is clicked
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  };

      const SkeletonCategories = () => (
        <div className="relative flex flex-col items-center">
          <div className="px-5 w-20 h-10 py-2 text-sm font-medium rounded-full border shadow-sm transition-all duration-200"/> 
        </div>
      );
  


  return (
    <div className=''>
    {loading ? (
      <div className='flex flex-col p-4 rounded-2xl shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide'>
        <h2 className="text-lg font-medium text-gray-800 mb-2">Categories</h2>
        <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCategories key={i} />
          ))}
        </div>
      </div>
      
    ) : (
    <div className="mb-2 px-4 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-hide ">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Categories</h2>
      <div className="flex space-x-3 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(category)}
            className={`px-5 py-2 text-sm font-medium rounded-full border shadow-sm transition-all duration-200  ${
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
        <GrocList
          category={selectedCategory}
          cart
        />

      ) : (
        <PopularGroc 
          cart
        />
      )}
    </div>
    )}
    </div>
  );
};

export default GrocCategories;

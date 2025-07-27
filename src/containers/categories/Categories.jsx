import React, { useState, useEffect, useRef  } from 'react';
import Popular from '../popular/Popular.jsx';
import FoodList from '../food/FoodList.jsx'; 
import axios from "axios";

const Categories = ({user, showCart, setShowCart ,showCheckout, setShowCheckout, selectedItem, setSelectedItem, userCoords, setUserCoords}) => {

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // const [userCoords, setUserCoords] = useState(null);
  const hasInitialized = useRef(false);

useEffect(() => {
  const fetchCategories = async () => {
    // if (hasInitialized.current || !userCoords) return;
    // hasInitialized.current = true;

    try {
      const response = await axios.get(`${getBaseUrl()}/foods`, {
        params: {
          lat: userCoords.lat,
          lng: userCoords.lng,
        },
      });
      const data = response.data.data;
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      // console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, [userCoords]); // ✅ Trigger only when coordinates change


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
        {/* <h2 className="text-lg font-medium text-gray-800 mb-2">Categories</h2> */}
        <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCategories key={i} />
          ))}
        </div>
      </div>
      
    ) : (
    <div className="mb-2 px-4 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-hide">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Categories</h2>
      
      <div className="flex space-x-3 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map((category, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <button
              onClick={() => handleSelect(category)}
              className={`px-5 py-2 text-sm font-medium rounded-full border shadow-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-[#0EADBF] text-white border-[#0EADBF]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-[#0EADBF] hover:text-white hover:border-[#0EADBF]'
              }`}
            >
              {category}
            </button>
          </div>
        ))}
      </div>


      {/* Conditional rendering */}
      {selectedCategory ? (
        <FoodList
          user={user}
          category={selectedCategory}
          cart
          showCart={showCart}
          setShowCart={setShowCart} 
          showCheckout={showCheckout} 
          setShowCheckout={setShowCheckout} 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          userCoords={userCoords}
          setUserCoords={setUserCoords}
        />

      ) : (
        <Popular 
          cart
          user={user}
          showCart={showCart}
          setShowCart={setShowCart} 
          showCheckout={showCheckout} 
          setShowCheckout={setShowCheckout} 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          userCoords={userCoords}
          setUserCoords={setUserCoords}
        />
      )}
    </div>
    )}
    </div>
  );
};

export default Categories;

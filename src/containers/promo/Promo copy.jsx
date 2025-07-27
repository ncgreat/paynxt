import React from 'react';

const Promo = () => {
  return (
    <div className='p-4'>
      <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold">Limited Time Offer!</h2>
      <p className="mt-2 text-lg">Get 20% off on your first purchase. Don't miss out!</p>
      <button className="mt-4 px-6 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-200 transition">
        Claim Offer
      </button>
    </div>
    </div>
    
  );
};

export default Promo;

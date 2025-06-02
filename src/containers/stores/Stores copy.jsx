import React, { useState, useEffect, useContext } from 'react';
import { Heart, X, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from "axios";
import { DealContext } from "../../DealContext";
import fallbackImage from '../../assets/placeholder.webp'; // ✅ Fallback image

const Stores = () => {
  const [liked, setLiked] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [total, setTotal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Wallet Balance');
  const [stores, setStores] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [formError, setFormError] = useState(false);
  const { loggedUser, setLoggedUser } = useContext(DealContext);

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const handleSelectItem = async (item) => {
    try {
        console.log(item.id);
        const response = await axios.get(`${getBaseUrl()}/vendor/food-vendor/${item.id}`);
      console.log(response);
       setSelectedItem({ ...item, menu: response.data.menu });
    } catch (err) {
      console.error("Failed to fetch store details", err);
    }
  };
  

  // Restore loggedUser from cookie
  useEffect(() => {
    const encodedUser = getCookie('lastUser');
    if (loggedUser && !Array.isArray(loggedUser)) {
      if (encodedUser) {
        try {
          const user1 = JSON.parse(atob(encodedUser));
          setLoggedUser(user1.logged);
        } catch (err) {
          console.error("Error decoding user cookie:", err);
        }
      }
    }
  }, []);

  // Fetch popular items
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/vendor/food`);
        setStores(Array.isArray(response.data.data) ? response.data.data : []);
        // console.log(response);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setFetchError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const toggleLike = (itemName) => {
    setLiked((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };


  const StorePage = ({ store, onBack, liked, toggleLike }) => {
    const categories = store.menu ? Object.keys(store.menu) : [];
  
    return (
      <div className="p-4">
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto">
          <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-10 right-4">
            <button className="text-gray-200 hover:text-gray-800" onClick={() => setSelectedItem(null)}>
              <X size={30} />
            </button>
          </div>
  
          <div className="flex flex-col mt-2 mb-4 px-6">
            <h2 className="text-2xl font-bold mt-2">{store.vendor_name}</h2>
            {/* <Heart
              className={`cursor-pointer ${liked[store.vendor_name] ? 'fill-red-500' : 'stroke-gray-200'}`}
              onClick={() => toggleLike(store.vendor_name)}
            /> */}
          </div>
  
          <div className='px-6'>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 mb-4 border rounded-lg"
            />
          </div>
  
          {/* Loop through dynamic categories */}
          <div className="space-y-6 px-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {store.menu[category].map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center"
                    >
                      <img
                        src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`}
                        onError={(e) => (e.target.src = fallbackImage)}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <h4 className="text-sm font-semibold text-gray-700">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.description || 'No description'}</p>
                      <p className="text-sm font-bold text-green-700 mt-1">₦{Number(item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  

    const SkeletonFoodCard = () => (
      <div className="relative flex flex-col items-center">
        <div className="h-[120px] w-[170px] rounded-2xl bg-gray-200 animate-pulse shadow-lg scrollbar-hide">
          <img 
            src={fallbackImage}
            className="w-full h-full object-cover rounded-2xl"
            />
          </div> 
      </div>
    );

  // UI rendering comes here...
  return (
    <div className='px-4 '>
    {loading ? (
      <div className='flex flex-col'>
        <h2 className="text-lg font-medium text-gray-800 mb-2">Stores</h2>
        <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonFoodCard key={i} />
          ))}
        </div>
      </div>
      
    ) : (
    <div className="p-4 rounded-2xl bg-gray-100 overflow-x-auto whitespace-nowrap z-auto">
      <Toaster position="top-right" reverseOrder={true} />
      {Array.isArray(stores) && stores.length > 0 ? (
      <div className="-z-10">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Stores</h2>
      <div className="flex space-x-4 pb-4 items-center overflow-x-auto scrollbar-hide">
        {stores.map((item) => (
          <div key={item.vendor_name} className="flex items-center">
            <div
              className="h-[120px] w-[170px] bg-white rounded-2xl shadow-lg flex flex-col justify-end p-3 text-white cursor-pointer relative"
              onClick={() => handleSelectItem(item)}
            >
              <img
                src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.logo_url}`}
                alt={item.vendor_name}
                onError={(e) => (e.target.src = fallbackImage)}
                className="w-full h-full object-contain rounded-2xl"
              />
    
              <div className="absolute top-3 right-3  h-8 w-8 flex justify-center items-center rounded-full">
                <Heart
                  className={`cursor-pointer ${liked[item.vendor_name] ? 'fill-red-500' : 'stroke-gray-200'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.vendor_name);
                  }}
                />
              </div>
    
              <div className="text-xs bg-[#00000075] p-2 rounded-lg absolute bottom-2 left-2">
                <span>{item.vendor_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    ) : (
      <div className="text-gray-500">No store found.</div>
    )}

    {selectedItem ? (
        <StorePage
            store={selectedItem}
            onBack={() => setSelectedItem(null)}
            liked={liked}
            toggleLike={toggleLike}
        />
        ) : loading ? (
        // Show loading skeletons
        <div>Loading...</div>
        ) : (
        // Show store list (what you already have)
        // <div>...store map UI...</div>
        <div></div>
        )}

        </div>
    )}

  </div>
  );
};

export default Stores;

import React, { useState, useEffect, useContext } from 'react';
import { Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from "axios";
import fallbackImage from '../../assets/placeholder.webp';
import { DealContext } from "../../DealContext";

const FoodList = ({ category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '' });
  const [formError, setFormError] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const {
    cart,
    addToCart,
    clearCart,
    setCart,
  } = useContext(DealContext);

  // Flatten the cart for UI purposes
  const flatCart = Object.values(cart).flat();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price);

  const toggleLike = (item) => {
    setLiked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;

  useEffect(() => {
    const fetchItems = async () => {
      if (category) {
        setLoading(true);
        try {
          const response = await axios.get(`${getBaseUrl()}/foods?category=${category}`);
          const data = response.data;
          setItems(data.data);
        } catch (error) {
          console.log('Failed to fetch items:', error);
          setItems([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [category]);

  const handleSelectItem = (item) => {
    const existingItem = flatCart.find((cartItem) => cartItem.name === item.name);

    if (existingItem) {
      setQuantity(existingItem.quantity);
      setIsUpdating(true);
    } else {
      setQuantity(1);
      setIsUpdating(false);
    }

    setSelectedItem(item);
  };

  const SkeletonFoodCard = () => (
    <div className="relative flex items-center">
      <div className="h-[200px] w-[170px] rounded-2xl bg-gray-200 animate-pulse shadow-lg scrollbar-hide">
        <img src={fallbackImage} />
      </div>
    </div>
  );

  return (
    <div className="px-4 h-[50%] bg-gray-100 rounded-2xl">
      <h2 className="text-lg font-medium text-gray-800 capitalize py-4 pt-4">{category || 'All'}</h2>

      {loading ? (
        <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonFoodCard key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 scrollbar-hide">
          {items.map((item) => (
            <div key={item.name} className="relative flex items-center">
              <div
                className="h-[200px] w-[170px] bg-cover bg-center rounded-2xl shadow-lg relative flex flex-col justify-end p-3 text-white cursor-pointer"
                style={{ backgroundImage: `url(${`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`})` }}
                onClick={() => handleSelectItem(item)}
              >
                <div className="absolute top-3 right-3 bg-black/6 h-8 w-8 flex justify-center items-center rounded-full">
                  <Heart
                    className={`cursor-pointer ${liked[item.name] ? 'fill-red-500' : 'stroke-gray-200'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.name);
                    }}
                  />
                </div>
                <div className="text-xs bg-[#00000075] p-2 rounded-lg">
                  <span>{item.name}</span>
                  <span className="block font-bold">₦{formatPrice(item.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto">
          <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-10 right-4">
            <button className="text-gray-200 hover:text-gray-800" onClick={() => setSelectedItem(null)}>
              <X size={30} />
            </button>
          </div>
          <img
            src={`https://paynxtapi.cyrusnet4d.com/public/storage/${selectedItem.image_url}`}
            alt={selectedItem.name}
            className="w-full h-64 object-cover"
            onError={(e) => (e.target.src = fallbackImage)}
          />
          <div className="relative -top-6 bg-white rounded-t-3xl p-4 shadow-xl">
            <h3 className="text-2xl font-bold mt-4">{selectedItem.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{selectedItem.description}</p>

            <div className="flex flex-col my-4">
              <input placeholder="Order note" className="w-full p-2 rounded-lg border text-sm border-gray-300" />
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="px-4 text-lg">{quantity}</span>
                  <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <span className="block font-medium text-lg">₦<span className="font-medium text-xl">{formatPrice(selectedItem.price * quantity)}</span></span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCart(true);
                addToCart({ ...selectedItem, quantity });
              }}
              className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600"
            >
              {isUpdating ? "Update Cart" : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto mb-16">
          <div className="relative top-3 left-7 mb-6 font-bold text-xl">
            <h3>My order</h3>
          </div>
          <div className="bg-[#0000001f] p-1 flex items-center justify-center rounded-3xl absolute top-8 right-4">
            <button className="text-gray-600 hover:text-gray-800" onClick={() => setShowCart(false)}>
              <X size={24} />
            </button>
          </div>

          {flatCart.map((item) => (
            <div key={item.name} className="px-7 py-3 flex">
              <img
                src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`}
                className="h-36 w-32 rounded-xl object-cover"
                onError={(e) => (e.target.src = fallbackImage)}
              />
              <div className="ml-4">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-sm">₦{formatPrice(item.price)} x {item.quantity}</p>
                <p className="font-bold mt-1">₦{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          {/* Add cart total or checkout here if needed */}
        </div>
      )}
    </div>
  );
};

export default FoodList;

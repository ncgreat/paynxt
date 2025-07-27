import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { Heart, X, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import fallbackImage from '../../assets/placeholder.webp';
import { DealContext } from '../../DealContext';

const FoodList = ({ category, showCart, setShowCart ,showCheckout, setShowCheckout, selectedItem, setSelectedItem, userCoords, setUserCoords}) => {
  const [items, setItems] = useState([]);
  const [liked, setLiked] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  // const [showCart, setShowCart] = useState(false);
  // const [showCheckout, setShowCheckout] = useState(false);
  const [total, setTotal] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '' });
  const [formError, setFormError] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Wallet Balance');
    // const [userCoords, setUserCoords] = useState(null);

  const { cart, addToCart, removeFromCart, clearCart, updateCartItemQuantity, getCartTotal } = useContext(DealContext);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price);

  const toggleLike = (itemName) => {
    setLiked((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;

  useEffect(() => {
    const fetchItems = async () => {
      if (category) {
        setLoading(true);
        try {
          const response = await axios.get(`${getBaseUrl()}/foods?category=${category}`,
          {
          params: {
            lat: userCoords.lat,
            lng: userCoords.lng,
          },
        });
          // console.log(response);
          setItems(response.data.data);
        } catch (error) {
          console.error('Failed to fetch items:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if(userCoords){
        fetchItems();
    }

  }, [category, userCoords]);

    // useEffect(() => {
    //   const getBrowserLocation = () => {
    //     if (!navigator.geolocation) {
    //       setLocationError("Geolocation is not supported by this browser.");
    //       getIPFallback();
    //       return;
    //     }
    
    //     navigator.geolocation.getCurrentPosition(
    //       (position) => {
    //         const { latitude, longitude } = position.coords;
    //         setUserCoords({ lat: latitude, lng: longitude });
    //       },
    //       (error) => {
    //         console.warn("Browser GPS failed:", error.message);
    //         setLocationError("Using fallback location via IP.");
    //         getIPFallback();
    //       },
    //       {
    //         enableHighAccuracy: true,
    //         timeout: 10000,
    //         maximumAge: 0,
    //       }
    //     );
    //   };
    
    //   const getIPFallback = async () => {
    //     try {
    //       const res = await fetch('https://ipapi.co/json/');
    //       const data = await res.json();
    //       if (data && data.latitude && data.longitude) {
    //         setUserCoords({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
    //       } else {
    //         setLocationError("IP location service failed.");
    //       }
    //     } catch (err) {
    //       console.error("IP fallback error:", err.message);
    //       setLocationError("Failed to retrieve location by all means.");
    //     }
    //   };
    
    //   getBrowserLocation();
    // }, []);

  const handleSelectItem = (item) => {
    const existingItem = cart[item.vendor_id]?.find((i) => i.name === item.name);
    setQuantity(existingItem ? existingItem.quantity : 1);
    setIsUpdating(!!existingItem);
    setSelectedItem(item);
  };

  const handleAddToCart = (item) => {
    addToCart(item, quantity);
    toast.success(`${item.name} ${isUpdating ? 'updated' : 'added'} to cart!`);
    setSelectedItem(null);
    setQuantity(1);
    setIsUpdating(false);
    setShowCart(true);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmOrder = () => {
    const { name, phone, address } = formData;
    if (!name || !phone || !address) {
      setFormError(true);
      setTimeout(() => setFormError(false), 3000);
      return;
    }
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowCheckout(false);
      clearCart(); // ✅ clears global cart
    }, 3000);
  };

  const getTotalWithFees = () => {
    const subtotal = getCartTotal();
    const taxes = subtotal * 0.075;
    const delivery = 750;
    return subtotal + taxes + delivery;
  };


    const SkeletonFoodCard = () => (
      <div className="relative flex flex-col items-center">
        <div className="h-[200px] w-[170px] rounded-2xl bg-gray-200 animate-pulse shadow-lg scrollbar-hide">
          <img
            src={fallbackImage}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    );
  

  return (
    <div className="px-2 bg-gray-100 rounded-2xl">
      <h2 className="text-lg font-medium text-gray-800 capitalize pt-2 pl-2">{category || 'All'}</h2>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonFoodCard key={i} />)}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
          {items.map((item) => (
            <div key={item.name} className="relative">
              <div
                className="h-[200px] w-[170px] bg-cover bg-center rounded-2xl shadow-lg flex flex-col justify-end p-3 text-white cursor-pointer"
                style={{ backgroundImage: `url(https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url})` }}
                onClick={() => handleSelectItem(item)}
              >
                <div className="absolute top-3 right-3 bg-black/30 h-8 w-8 flex justify-center items-center rounded-full">
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

       {!showCart  && (
                  <button
                  className="fixed bottom-24 right-6 bg-gray-800 text-white p-4 rounded-full"
                  onClick={() => {
                    setShowCart(true); console.log('list');
                  }}
                  >
                  <ShoppingCart size={24} />
                  </button>
                )}

                {selectedItem && (
                  <div className="fixed inset-0 bg-white flex flex-col mt-12 py-6 overflow-auto">
                    <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-10 right-4">
                      <button
                        className=" text-gray-200  hover:text-gray-800"
                        onClick={() => setSelectedItem(null)}
                      >
                        <X size={30} />
                      </button>
                    </div>
                    <img
                      src={`https://paynxtapi.cyrusnet4d.com/public/storage/${selectedItem.image_url}`}
                      alt={selectedItem.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="relative -top-6 bg-white rounded-t-3xl p-4 shadow-xl h-[55%] z-auto">
                      <h3 className="text-2xl font-bold mt-4">{selectedItem.name}</h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {selectedItem.description}
                      </p>
      
                      <div className="flex flex-col my-4">
                        <input
                          placeholder="Order note"
                          className="w-full p-2 rounded-lg border text-sm border-gray-300"
                        />
                        <div className="flex justify-between mt-4">
                          <div className="flex items-center">
                            <button
                              className="px-3 py-1 bg-gray-200 rounded-lg"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              -
                            </button>
                            <span className="px-4 text-lg">{quantity}</span>
                            <button
                              className="px-3 py-1 bg-gray-200 rounded-lg"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="block font-medium text-lg">
                            ₦
                            <span className="font-medium text-xl">
                              {formatPrice(selectedItem.price * quantity)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // setShowCart(true);
                          toast.success(`${selectedItem.name} ${isUpdating ? 'updated' : 'added'} to cart!`);
                          addToCart(selectedItem, quantity);
                          setSelectedItem(null);
                        }}
                        className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600"
                      >
                        {isUpdating ? "Update Cart" : "Add to Cart"}
                      </motion.button>
                    </div>
                  </div>
                )}

                {showCart && (
                  <div className="fixed inset-0 bg-white flex flex-col mt-12 py-6 overflow-auto mb-16">
                    <div className="relative top-3 left-7 mb-6 font-bold text-xl">
                      <h3>My order</h3>
                    </div>
                    <div className="bg-[#0000001f] p-1 flex items-center justify-center rounded-3xl absolute top-8 right-4">
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setShowCart(false)}
                      >
                        <X size={24} />
                      </button>
                    </div>
      
                    {Object.keys(cart).length === 0 ? (
                      <div className="flex px-7 ">
                        <ShoppingCart size={24} />
                        <h2 className="ml-2">No item yet</h2>
                      </div>
                    ) : (
                      Object.entries(cart).map(([vendorId, items]) => (
                        <div key={vendorId} className="px-7 pb-6">
                          {/* <h3 className="font-bold text-lg mb-2">Vendor: {vendorId}</h3> */}
                          {items.map((item) => (
                            <div key={item.name} className="py-3 flex">
                              <img
                                src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`}
                                alt={item.name}
                                className="h-36 w-32 rounded-xl object-cover"
                              />
                              <div className="ml-4">
                                <h3 className="font-semibold">{item.name}</h3>
                                <span className="font-medium text-lg">
                                  ₦{formatPrice(item.price * item.quantity)}
                                </span>
                                <div className="flex items-center my-2">
                                  <button
                                    className="px-3 py-1 bg-gray-200 rounded-lg"
                                    onClick={() => {
                                      setCart((prevCart) => {
                                        const updatedItems = prevCart[vendorId].map(
                                          (cartItem) =>
                                            cartItem.name === item.name
                                              ? {
                                                  ...cartItem,
                                                  quantity: Math.max(
                                                    1,
                                                    cartItem.quantity - 1
                                                  ),
                                                }
                                              : cartItem
                                        );
                                        return {
                                          ...prevCart,
                                          [vendorId]: updatedItems,
                                        };
                                      });
                                    }}
                                  >
                                    -
                                  </button>
                                  <span className="px-4">{item.quantity}</span>
                                  <button
                                    className="px-3 py-1 bg-gray-200 rounded-lg"
                                    onClick={() => {
                                      setCart((prevCart) => {
                                        const updatedItems = prevCart[vendorId].map(
                                          (cartItem) =>
                                            cartItem.name === item.name
                                              ? {
                                                  ...cartItem,
                                                  quantity: cartItem.quantity + 1,
                                                }
                                              : cartItem
                                        );
                                        return {
                                          ...prevCart,
                                          [vendorId]: updatedItems,
                                        };
                                      });
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  className="bg-gray-300 text-gray-600 px-2 py-2 w-[105px] rounded-md"
                                  onClick={() => {
                                    setCart((prevCart) => {
                                      const filteredItems = prevCart[vendorId].filter(
                                        (cartItem) => cartItem.name !== item.name
                                      );
                                      const updatedCart = { ...prevCart };
                                      if (filteredItems.length === 0) {
                                        delete updatedCart[vendorId];
                                      } else {
                                        updatedCart[vendorId] = filteredItems;
                                      }
                                      return updatedCart;
                                    });
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
      
                    {/* Summary Section */}
                    {Object.keys(cart).length > 0 && (
                      <div className="px-7 py-3">
                        <button
                          onClick={() => setCart({})}
                          className="bg-gray-800 text-white px-4 py-2 rounded-md mt-2"
                        >
                          Clear Cart
                        </button>
      
                        {/* Global Summary */}
                        <div className="flex flex-col justify-end mt-4">
                          <h3 className="font-semibold text-xl my-2">
                            Order Summary
                          </h3>
                          <div className="flex flex-col">
                            {(() => {
                              const subtotal = Object.values(cart)
                                .flat()
                                .reduce(
                                  (total, item) => total + item.price * item.quantity,
                                  0
                                );
                              const tax = subtotal * 0.075;
                              const deliveryFee = 750;
                              const total = subtotal + tax + deliveryFee;
                              return (
                                <>
                                  <span className="block text-md text-gray-400 flex justify-between">
                                    Subtotal:{" "}
                                    <span className="font-medium text-xl text-gray-800">
                                      ₦{formatPrice(subtotal)}
                                    </span>
                                  </span>
                                  <span className="block text-md text-gray-400 flex justify-between">
                                    Taxes & Fees:{" "}
                                    <span className="font-medium text-xl text-gray-800">
                                      ₦{formatPrice(tax)}
                                    </span>
                                  </span>
                                  <span className="block text-md text-gray-400 flex justify-between">
                                    Delivery Fee:{" "}
                                    <span className="font-medium text-xl text-gray-800">
                                      ₦{formatPrice(deliveryFee)}
                                    </span>
                                  </span>
                                  <div className="border border-dashed my-3"></div>
                                  <span className="block text-lg text-gray-700 bg-gray-300 p-2 px-4 my-2 rounded-lg flex justify-between">
                                    Voucher{" "}
                                    <span className="font-medium text-xl text-gray-800">
                                      -20%
                                    </span>
                                  </span>
                                  <span className="block text-lg text-gray-400 flex justify-between">
                                    Total:{" "}
                                    <span className="font-medium text-xl text-gray-800">
                                      ₦{formatPrice(total)}
                                    </span>
                                  </span>
                                </>
                              );
                            })()}
                          </div>
      
                          <div className="flex justify-between mt-4">
                            <button
                              onClick={() => setShowCart(false)}
                              className="bg-gray-800 text-white px-2 py-2 rounded-md hover:text-gray-200"
                            >
                              Continue Shopping
                            </button>
                            <button
                              onClick={() => {
                                const subtotal = Object.values(cart)
                                  .flat()
                                  .reduce(
                                    (total, item) =>
                                      total + item.price * item.quantity,
                                    0
                                  );
                                const tax = subtotal * 0.075;
                                const total = subtotal + tax + 750;
                                setTotal(formatPrice(total));
                                setShowCheckout(true);
                              }}
                              className="bg-green-400 text-gray-200 px-2 py-2  rounded-md hover:text-gray-800"
                            >
                              Proceed to Checkout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

               {showCheckout && (
                    <div className="fixed inset-0 bg-white flex flex-col mt-12 pb-28 overflow-auto">
                      <div className="px-6 pt-9 pb-3 flex justify-between items-center border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                        <button onClick={() => setShowCheckout(false)} className="text-gray-600 hover:text-red-500 transition">
                          <X size={28} />
                        </button>
                      </div>
            
                      <div className="px-6 py-2 space-y-6">
                        <div>
                          <div className="flex justify-between mt-0 pt-1 font-semibold text-lg">
                            <span>Total</span>
                            <span>₦{total}</span>
                          </div>
                          <div className="mt-4 text-sm text-gray-500">Estimated Delivery: <strong className="text-gray-800">20-30 minutes</strong></div>
                        </div>
            
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                          <div className="flex gap-4">
                            {['Wallet Balance', 'Paystack'].map((method) => (
                              <button
                                key={method}
                                className={`px-4 py-2 border rounded-lg capitalize ${paymentMethod === method ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setPaymentMethod(method)}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
            
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                          <form className="space-y-6">
                            <div className="relative">
                              <input name="name" value={formData.name} onChange={handleFormChange} type="text" placeholder=" " className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent" />
                              <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Full Name</label>
                            </div>
                            <div className="relative">
                              <input name="phone" value={formData.phone} onChange={handleFormChange} type="tel" placeholder=" " className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent" />
                              <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Phone Number</label>
                            </div>
                            <div className="relative">
                              <textarea name="address" value={formData.address} onChange={handleFormChange} rows="2" placeholder=" " className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"></textarea>
                              <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Delivery Address</label>
                            </div>
                            <div className="relative">
                              <textarea name="note" value={formData.note} onChange={handleFormChange} rows="2" placeholder=" " className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"></textarea>
                              <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Additional Note (Optional)</label>
                            </div>
                          </form>
                        </div>
                      </div>
            
                      <div className="fixed bottom-16 left-0 right-0 bg-white shadow-md px-6 py-4">
                        <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 transition" onClick={handleConfirmOrder}>
                          Confirm Order
                        </button>
                      </div>
            
            
                      {formError && (
                        <div className="absolute inset-x-0 top-80 flex justify-center z-50">
                          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-md flex items-center space-x-3 animate-bounce">
                            <AlertCircle size={24} />
                            <span className="text-sm font-medium">Please fill in all required fields.</span>
                          </div>
                        </div>
                      )}
            
            
                      {orderSuccess && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl text-center shadow-xl animate-bounce">
                            <CheckCircle className="mx-auto mb-2" size={36} />
                            <p className="font-bold text-lg">Order Placed Successfully!</p>
                            <p className="text-sm">We’re preparing your meal. 🍽️</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
  
    </div>
  );
};

export default FoodList;

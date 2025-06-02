import React, { useState, useEffect, useContext } from 'react';
import { Heart, X, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from "axios";
import { DealContext } from "../../DealContext";

const Popular = () => {
  const [liked, setLiked] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [total, setTotal] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [popularItems, setPopularItems] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [formError, setFormError] = useState(false);
  const { loggedUser, setLoggedUser } = useContext(DealContext);


  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
   };

   const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

    useEffect(() => {

    const encodedUser = getCookie('lastUser');

      if(loggedUser && !Array.isArray(loggedUser)){
        if (encodedUser) {

          try {
          const user1 = JSON.parse(atob(encodedUser));
          setLoggedUser(user1.logged);
          } catch (err) {
          console.log("Error decoding user cookie:", err);
          }
        }
      }
    
    }, []);

  const toggleLike = (item) => {
    setLiked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  useEffect(()=>{
    if(loggedUser && !Array.isArray(loggedUser)){
      // console.log(loggedUser);
    }
  },[])

  const checkoutPayload1 = {
    user_id: loggedUser.user.id || null, // assuming context/session
    vendor_id: selectedVendor || null,
    items: cart.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    total_price: total.replace(/[^\d.]/g, ""), // your helper function
    // order_note: noteText, // optional
    // delivery_address: deliveryAddress, // optional
  };

  const checkoutPayloads = Object.entries(cart).map(([vendorId, items]) => ({
    user_id: loggedUser?.user?.id || null,
    vendor_id: vendorId,
    items: items.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    total_price: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  }));
  
  
  const makeOrder1 = async () => {
    try {
      
      const response = await axios.post(`${getBaseUrl()}/vendor/make_order`, checkoutPayload);
      console.log('Order successful:', response.data);
      // setOrderSuccess(true);
    } catch (error) {
      console.error('Order failed:', error.response?.data || error.message);
    }
  };

  const makeOrder = async () => {
    for (const payload of checkoutPayloads) {
      try {
        const response = await axios.post(`${getBaseUrl()}/vendor/make_order`, payload);
        console.log(`Order for vendor ${payload.vendor_id} successful:`, response.data);
      } catch (error) {
        console.error(`Order for vendor ${payload.vendor_id} failed:`, error.response?.data || error.message);
      }
    }
  };
  

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/menu/popular`);
        setPopularItems(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setFetchError('Failed to load menu');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price);

  const checkout = () => {
    setShowCheckout(true);
  }

  const addToCart1 = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
  
    if (existingItem) {
      toast.success(`${item.name} updated in cart!`);
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity } : cartItem
        )
      );
    } else {
      toast.success(`${item.name} added to cart!`);
      setCart((prevCart) => [...prevCart, { ...item, quantity }]);
    }
  
    setQuantity(1);
    setSelectedItem(null);
    setIsUpdating(false);
  };

  const addToCart = (item) => {
    const vendorId = item.vendor_id;
  
    setCart((prevCart) => {
      const vendorItems = prevCart[vendorId] || [];
  
      const existingItemIndex = vendorItems.findIndex(i => i.id === item.id);
  
      let updatedVendorItems;
      if (existingItemIndex > -1) {
        // Update existing item
        updatedVendorItems = vendorItems.map(i =>
          i.id === item.id ? { ...i, quantity } : i
        );
      } else {
        // Add new item
        toast.success(`${item.name} added to cart!`);
        updatedVendorItems = [...vendorItems, { ...item, quantity }];
      }
  
      return {
        ...prevCart,
        [vendorId]: updatedVendorItems,
      };
    });
  
    setQuantity(1);
    setSelectedItem(null);
    setIsUpdating(false);
  };
  
  

  const removeFromCart1 = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  const removeFromCart = (vendorId, itemId) => {
    setCart((prevCart) => {
      const updatedItems = prevCart[vendorId].filter(item => item.id !== itemId);
      const updatedCart = { ...prevCart };
  
      if (updatedItems.length === 0) {
        delete updatedCart[vendorId];
      } else {
        updatedCart[vendorId] = updatedItems;
      }
  
      return updatedCart;
    });
  };
  

  const handleSelectItem = (item) => {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
  
    if (existingItem) {
      setQuantity(existingItem.quantity); // Set the quantity to the existing quantity in the cart
      setIsUpdating(true); // Indicate that we're updating an existing cart item
    } else {
      setQuantity(1); // Reset to 1 for a new item
      setIsUpdating(false); // Indicate that this is a new addition to the cart
    }
    setSelectedVendor
    setSelectedItem(item);
  };

 
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleConfirmOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      setFormError(true);
      setTimeout(() => setFormError(false), 3000);
      return;
    }
    // setOrderSuccess(true);
    makeOrder();
    setTimeout(() => {
      setOrderSuccess(false);
      setShowCheckout(false);
      setShowCart(false);
      setCart([]);
      setFormData({ name: '', phone: '', address: '', note: '' });
    }, 3000);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md overflow-x-auto whitespace-nowrap">
      <Toaster position="top-right" reverseOrder={true} />
      {Array.isArray(popularItems) && popularItems.length > 0 ? (
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-2">Popular this week</h2>
        <div className="mb-12 flex space-x-4 pb-4 items-center overflow-x-auto scrollbar-hide">
          {popularItems.map((item) => (
            <div key={item.name} className="relative flex items-center">
              <div
                style={{ backgroundImage: `url(${item.image_url || '/placeholder.jpg'})` }}
                className="h-[200px] w-[170px] bg-cover bg-center rounded-2xl shadow-lg relative flex flex-col justify-end p-3 text-white cursor-pointer"
                onClick={() => handleSelectItem(item)}
              >
                <div className="absolute top-3 right-3 bg-black/6 h-8 w-8 flex justify-center items-center rounded-full">
                  <Heart
                    className={`cursor-pointer ${liked[item.name] ? 'fill-red-500' : 'stroke-gray-200'}`}
                    onClick={(e) => { e.stopPropagation(); toggleLike(item.name); }}
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
      </div>
    ) : (
      <div className="text-gray-500">No popular items found.</div>
    )}

     

      {selectedItem && (
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto">
           <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-10 right-4">
            <button
              className=" text-gray-200  hover:text-gray-800"
              onClick={() => setSelectedItem(null)}
            >
              <X size={30} />
            </button>
          </div>
          <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-64 object-cover" />
          <div className='relative -top-6 bg-white rounded-t-3xl p-4 shadow-xl'>
              <h3 className="text-2xl font-bold mt-4">{selectedItem.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{selectedItem.description}</p>

              <div className="flex flex-col my-4">
                <input placeholder='Order note' className='w-full p-2 rounded-lg border text-sm border-gray-300' />
                <div className='flex justify-between mt-4'>
                  <div className='flex items-center'>
                    <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span className="px-4 text-lg">{quantity}</span>
                    <button className="px-3 py-1 bg-gray-200 rounded-lg" onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <span className="block font-medium text-lg">₦<span className='font-medium text-xl'>{formatPrice(selectedItem.price * quantity)}</span></span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowCart(true); addToCart(selectedItem); }} 
                className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600"
              >
                {isUpdating ? "Update Cart" : "Add to Cart"}
              </motion.button>
             
          </div>

        </div>
      )}
	  
	   <button className="fixed bottom-24 right-6 bg-gray-800 text-white p-4 rounded-full" onClick={() => setShowCart(true)}>
        <ShoppingCart size={24} />
      </button>

	  {showCart && (
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto mb-16">
          <div className='relative top-3 left-7 mb-6 font-bold text-xl'>
            <h3>My order</h3>
          </div>
           <div className="bg-[#0000001f] p-1 flex items-center justify-center rounded-3xl absolute top-8 right-4">

            <button
              className=" text-gray-600  hover:text-gray-800"
              onClick={() => setShowCart(false)}
            >
              <X size={24} />
            </button>
          </div>
        
          {cart.map((item) => (
            <div key={item.name} className='px-7 py-3 flex'>
              <img src={item.img} alt={item.name} className="h-36 w-32 rounded-xl object-cover" />
              <div className="ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <span className="font-medium text-lg">₦{formatPrice(item.price * item.quantity)}</span>
                <div className='flex items-center my-2'>
                <button
                    className="px-3 py-1 bg-gray-200 rounded-lg"
                    onClick={() => {
                      setCart(prevCart =>
                        prevCart.map(cartItem =>
                          cartItem.name === item.name
                            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
                            : cartItem
                        )
                      );
                    }}
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-lg"
                    onClick={() => {
                      setCart(prevCart =>
                        prevCart.map(cartItem =>
                          cartItem.name === item.name
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                        )
                      );
                    }}
                  >
                    +
                  </button>
                </div>
                <button className="bg-gray-300 text-gray-600 px-2 py-2 w-[105px] rounded-md" onClick={() => removeFromCart(item.name)}>Remove</button>
              </div>
            </div>
          ))}
          {cart.length > 0 ? (
              <div className='px-7 py-3'>
                <div className=''>
                  <button onClick={() => setCart([])} className="bg-gray-800 text-white px-4 py-2 rounded-md mt-2">Clear Cart</button>
                </div>
                <div className='flex flex-col justify-end mt-4'>
                  <h3 className='font-semibold text-xl my-2'>Order Summary</h3>
                  <div className='flex flex-col'>
                    <span className="block text-md text-gray-400 flex justify-between">Subtotal: <span className='font-medium text-xl text-gray-800'>₦{formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0))}</span></span>
                    <span className="block text-md text-gray-400 flex justify-between">Taxes & Fees: <span className='font-medium text-xl text-gray-800'>₦{formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0)*0.075)}</span></span>
                    <span className="block text-md text-gray-400 flex justify-between">Delivery Fee: <span className='font-medium text-xl text-gray-800'>₦750</span></span>
                    <div className='border border-dashed my-3'></div>
                    <span className="block text-lg text-gray-700 bg-gray-300 p-2 px-4 my-2 rounded-lg flex justify-between">Voucher <span className='font-medium text-xl text-gray-800'></span>-20%</span>
                    <span className="block text-lg text-gray-400 flex justify-between">Total: <span className='font-medium text-xl text-gray-800'>₦{formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0) + (cart.reduce((total, item) => total + item.price * item.quantity, 0)*0.075) + 750)}</span></span>
                  </div>
                  <div className='flex justify-between mt-4'>
                    <button  onClick={() => {setShowCart(false);}} className="bg-gray-800 text-white px-2 py-2 rounded-md hover:text-gray-200">Continue Shopping</button>
                    <button onClick={()=>{setShowCheckout(true); setTotal(formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0) + (cart.reduce((total, item) => total + item.price * item.quantity, 0)*0.075) + 750));}} className="bg-gray-200 text-gray-600 px-2 py-2  rounded-md hover:text-gray-800">Proceed to Checkout</button>
                  </div>
                </div>
              </div> 
            ):(
              <div className='flex px-7 '>
               <ShoppingCart size={24} />
                <h2 className='ml-2'>No item yet</h2>
              </div>
            )
          }
          
        </div>
      )}

{showCheckout && (
        <div className="fixed inset-0 bg-white flex flex-col mt-10 pb-28 overflow-auto">
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
                {['transfer', 'card'].map((method) => (
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

export default Popular;
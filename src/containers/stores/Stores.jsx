import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Heart, X, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";
import { DealContext } from "../../DealContext";
import fallbackImage from "../../assets/placeholder.webp"; // ✅ Fallback image
import burger from "../../assets/burger.webp"; 
import echo from '../../echo'; 
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Base styling
import { FiMapPin } from "react-icons/fi";
import { MdGpsFixed } from "react-icons/md";


const Stores = ({user, showCart, setShowCart ,showCheckout, setShowCheckout, selectedProduct, setSelectedProduct, selectedStore, setSelectedStore, isChosen, setIsChosen, userCoords, setUserCoords}) => {
  const hasInitialized = useRef(false);
  const [liked, setLiked] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  // const [cart, setCart] = useState({});
  const [quantity, setQuantity] = useState(1);
  // const [showCart, setShowCart] = useState(false);
  // const [showCheckout, setShowCheckout] = useState(false);
  const [total, setTotal] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Wallet Balance");
  const [stores, setStores] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
   const [manualAddress, setManualAddress] = useState('');


      // const [userCoords, setUserCoords] = useState(null);
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
const [justSelected, setJustSelected] = useState(false);
 const controllerRef = useRef(null);

const [locationError, setLocationError] = useState('');
const [manualLat, setManualLat] = useState('');
const [manualLng, setManualLng] = useState('');
const [userAddress, setUserAddress] = useState(false);

  // const [selectedStore, setSelectedStore] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [formError, setFormError] = useState(false);
  const { loggedUser, setLoggedUser } = useContext(DealContext);

    const {
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      setCart,
      updateCartItemQuantity,
      getCartTotal,
    } = useContext(DealContext);

  const MIN_QUERY_LENGTH = 2;
  const DEBOUNCE_DELAY = 600;


  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;

  const HERE_API_KEY = 'vw6zAJtDTO0khU0BsU8Rt1o1uymtNkXOyC6HvHMmn7U'; // Replace with your HERE key
 const OPENCAGE_API_KEY = 'b6bd4c5a6b844f788d2ddf25faba1e9a';

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price);

useEffect(() => {
  try {
    const saved = localStorage.getItem("userCoords");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        !isNaN(parsed.lat) &&
        !isNaN(parsed.lng) &&
        parsed.verified
      ) {
        setUserCoords({ lat: parsed.lat, lng: parsed.lng });
      }
    }
  } catch (err) {
    console.error("Error reading saved coords:", err);
  }
}, []);



// console.log(userCoords);

const handleAddressSubmit = async () => {
  const address = formData.address || manualAddress;
  if (!address) return null;

  try {
    const res = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
      params: {
        q: address.toLowerCase().includes('kaduna') ? address : `${address}, Kaduna, Nigeria`,
        apiKey: HERE_API_KEY,
        in: 'countryCode:NGA',
      },
    });

    const kadunaMatch = res.data.items.find(
      item => item.address.state?.toUpperCase() === 'KADUNA'
    );

   if (kadunaMatch) {
      const { lat, lng } = kadunaMatch.position;
      setUserCoords({ lat, lng });

      localStorage.setItem(
        "userCoords",
        JSON.stringify({ lat, lng, verified: true }) // ✅ Store immediately as verified
      );

      setUserAddress(true);
      return { lat, lng };
    } else {
      return await fallbackGeocodeWithOpenCage(address);
    }
  } catch (err) {
    console.error('HERE Geocode error:', err?.response?.data || err.message);
    return await fallbackGeocodeWithOpenCage(address);
  }
};



  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}  

    useEffect(() => {

    const encodedUser = getCookie('lastUser');
    // console.log(encodedUser);
  
    if (encodedUser) {

      try {
      const user = JSON.parse(atob(encodedUser));
      setLoggedUser(user.logged);
      } catch (err) {
      console.log("Error decoding user cookie:", err);
      }
    }
    }, []);

	if(user.user == ''){
		user = loggedUser.user
	}
	user=user? user.user : loggedUser.user;
  let old_balance = 0;
  let new_balance = 0;
  const isAdmin = loggedUser?.user?.role === '1'; // assumes `role` is on user object


const inputRef = useRef();

useEffect(() => {
  const el = inputRef.current;
  if (el) {
    const handleFocus = () => {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    };
    el.addEventListener('focus', handleFocus);
    return () => el.removeEventListener('focus', handleFocus);
  }
}, []);

  // Fetch popular items
useEffect(() => {
  const fetchStores = async () => {
    if (!userCoords?.lat || !userCoords?.lng) return;

    try {
      const response = await axios.get(`${getBaseUrl()}/vendor/food`, {
        params: {
          lat: userCoords.lat,
          lng: userCoords.lng,
        },
      });

      const data = response.data.data;
      console.log(response);
      setStores(Array.isArray(data) ? data : []);
      console.log("Fetched stores:", data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setFetchError("Failed to load store list.");
    } finally {
      setLoading(false);
    }
  };

  fetchStores();
}, [userCoords]);

const checkDeliveryDistances = (userCoords) => {
  let outOfRangeItems = [];

  Object.entries(cart).forEach(([vendorId, items]) => {
    items.forEach((item) => {
      // console.log('vendor_location raw:', item.vendor_location);
      // console.log('userCoords:', userCoords);

      let vLat, vLng;

      if (typeof item.vendor_location === 'string') {
        [vLat, vLng] = item.vendor_location
          .split(',')
          .map(coord => parseFloat(coord.trim()));
      } else if (typeof item.vendor_location === 'object') {
        vLat = parseFloat(item.vendor_location.latitude);
        vLng = parseFloat(item.vendor_location.longitude);
      }

      const dist = haversineDistance(
        userCoords.lat,
        userCoords.lng,
        vLat,
        vLng
      );

      if (dist > 12) {
        outOfRangeItems.push({ vendorId, item });
      }
    });
  });

  return outOfRangeItems;
};

    // Build payloads for each vendor
  const checkoutPayloads = Object.entries(cart).map(([vendorId, items]) => ({
    user_id: loggedUser?.user?.id || null,
    vendor_id: vendorId,
    phone: formData?.phone,
    delivery_address: formData?.address,
    items: items.map((item) => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    total_price: items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ),
  }));

const handleConfirmOrder = async () => {
  if (!formData.name || !formData.phone || !formData.address) {
    setFormError(true);
    setTimeout(() => setFormError(false), 3000);
    return;
  }

  const coords = await handleAddressSubmit();
  if (coords) {
    const outOfRangeItems = checkDeliveryDistances(coords);

    if (outOfRangeItems.length > 0) {
      const result = await Swal.fire({
        title: 'Some items can’t be delivered',
        text: `${outOfRangeItems.length} item${outOfRangeItems.length === 1 ? '' : 's'} ${outOfRangeItems.length === 1 ? 'is' : 'are'} beyond 7km. Remove ${outOfRangeItems.length === 1 ? 'it' : 'them'} automatically?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove them',
        cancelButtonText: 'Cancel'
      });

      // if (!result.isConfirmed) return;
        if (!result.isConfirmed) {
        toast.error('Please update your delivery address to proceed with this order.', {
          position: 'bottom-center',
          autoClose: 10000,
        });
        return;
      }


      const updatedCart = { ...cart };
      outOfRangeItems.forEach(({ vendorId, item }) => {
        updatedCart[vendorId] = updatedCart[vendorId].filter(i => i.name !== item.name);
        if (updatedCart[vendorId].length === 0) delete updatedCart[vendorId];
      });

      setCart(updatedCart);
      setShowCheckout(false);
    }

    if(paymentMethod == 'Wallet Balance'){
          try {
              // Get Wallet Balance
              if (!isAdmin) {
                const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wallet_id: user.id }),
                });
        
                const walletData = await walletResponse.json();
                let old_balance = parseFloat(walletData?.available_balance || 0);
        
                // Check if balance is sufficient
                if (old_balance < total) {
                    Swal.fire({
                        title: 'Insufficient Balance',
                        text: `You need at least NGN ${total} to proceed.`,
                        icon: 'error',
                        customClass: { container: 'borderless' },
                    });
                    setIsDisabled(false);
                    return;
                }
                // console.log(user)
                // Deduct balance & Log transaction as "Pending"
                new_balance = old_balance - total;
            }else{
              	// 🛡️ Admin bypass: simulate 0 deduction
                old_balance = 0;
                new_balance = 0;
                // console.log(new_balance);
            }
              const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      category: 'Food',
                      service: 'Food',
                      amount: total,
                      phone_num: formData.phone,
                      transaction_id: `TXN-${Date.now()}`, // Generate a unique transaction ID
                      prev_balance: old_balance,
                      new_balance: new_balance,
                      status: 'Pending',
                      user_id: user.id,
                  }),
              });
      
              const transactionData = await transactionResponse.json();
      
              if (!transactionData.success) {
                  Swal.fire({
                      title: 'Transaction Failed',
                      text: 'Unable to debit your wallet. Please try again later.',
                      icon: 'error',
                      customClass: { container: 'borderless' },
                  });
                  return;
              }
                     // Proceed with the actual purchase request
              let allOrdersSuccessful = true;
              let failedOrders = [];

              for (const payload of checkoutPayloads) {
                try {
                  const response = await axios.post(`${getBaseUrl()}/vendor/make_order`, payload);

                  if (response.data.success !== true) {
                    allOrdersSuccessful = false;
                    failedOrders.push({ vendor: payload.vendor_id, error: response.data });
                  }

                  // console.log(`Order for vendor ${payload.vendor_id} successful:`, response.data);
                } catch (err) {
                  allOrdersSuccessful = false;
                  failedOrders.push({ vendor: payload.vendor_id, error: err.message });
                  // console.error(`Order failed for vendor ${payload.vendor_id}`, err);
                }
              }
          if (allOrdersSuccessful) {
            // Update the transaction status to "Successful"
            await fetch(`${getBaseUrl()}/update_transaction`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transaction_id: transactionData.transaction_id,
                status: 'Successful',
              }),
            });

            setLoggedUser(prev => ({
              ...prev,
              wallet: {
                ...prev.wallet,
                available_balance: new_balance,
              }
            }));

            Swal.fire({
              title: 'Order Placed',
              text: 'Your order was placed successfully',
              icon: 'success',
              customClass: { container: 'borderless' },
            });
          } else {
            // Reverse the wallet deduction
            await fetch(`${getBaseUrl()}/add_transaction`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                category: 'Food',
                service: 'Order Reversal',
                amount: total,
                phone_num: formData.phone,
                transaction_id: `REV-${Date.now()}`,
                prev_balance: new_balance,
                new_balance: old_balance,
                status: 'Reversed',
                user_id: user.id,
              }),
            });

            Swal.fire({
              title: 'Order Failed',
              text: `Some orders failed and your wallet has been refunded.`,
              icon: 'error',
              customClass: { container: 'borderless' },
            });

            console.log('Failed Orders:', failedOrders);
          }
   
             
          } catch (error) {
              console.log('Error:', error);
          }
    }else{
      console.log('paystack');
      return
    }

    // Proceed with order
    setPickupCoords(coords);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowCheckout(false);
      setShowCart(false);
      clearCart();
      setFormData({ name: '', phone: '', address: '', note: '' });
      setPickupQuery('');
    }, 3000);
  }
};




  const handleClose = () => {
    setSelectedItem(null);
    setSelectedStore(null)
    setIsChosen(false);
  };

  const handleSelectItem = async (item) => {
    try {
      // console.log(item.id);
      const response = await axios.get(
        `${getBaseUrl()}/vendor/food-vendor/${item.id}`
      );
        // console.log(response);
      setSelectedItem({ ...item, menu: response.data.menu, vendor:response.data.vendor });
    } catch (err) {
      console.error("Failed to fetch store details", err);
    }
  };

  const handleSelectItem1 = (item) => {
    const existingItem = Object.values(cart)
      .flat()
      .find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      setQuantity(existingItem.quantity);
      setIsUpdating(true);
    } else {
      setQuantity(1);
      setIsUpdating(false);
    }
    setSelectedProduct(item);
  };

  const retryGetLocation = () => {
  getBrowserLocation();
};


const handleAddressSubmit1 = async () => {
  const address = formData.address? formData.address:manualAddress ;
  if (!address) return null;

  try {
    const res = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
      params: {
        q: address.toLowerCase().includes('kaduna') ? address : `${address}, Kaduna, Nigeria`,
        apiKey: HERE_API_KEY,
        in: 'countryCode:NGA',
      },
    });

    const kadunaMatch = res.data.items.find(
      item => item.address.state?.toUpperCase() === 'KADUNA'
    );

    if (kadunaMatch) {
      const { lat, lng } = kadunaMatch.position;
      setUserCoords({ lat: lat, lng: lng });
      setUserAddress(true);
      return { lat, lng };
    } else {
      // Try OpenCage fallback
      return await fallbackGeocodeWithOpenCage(address);
    }
  } catch (err) {
    console.error('HERE Geocode error:', err?.response?.data || err.message);
    // Try OpenCage fallback on failure
    return await fallbackGeocodeWithOpenCage(address);
  }
};



const fallbackGeocodeWithOpenCage = async (address) => {
  try {
    const res = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: address.toLowerCase().includes('kaduna') ? address : `${address}, Kaduna, Nigeria`,
        key: OPENCAGE_API_KEY,
        countrycode: 'ng',
        limit: 3,
      },
    });

    const result = res.data.results[0];
    if (result && result.components.state?.toUpperCase() === 'KADUNA') {
      const { lat, lng } = result.geometry;
      return { lat, lng };
    } else {
      alert("We couldn't verify the address is in Kaduna.");
      return null;
    }
  } catch (err) {
    console.error('OpenCage fallback error:', err?.response?.data || err.message);
    alert("Failed to locate the address. Try being more specific.");
    return null;
  }
};


  const fetchSuggestions = async (query, setSuggestions, controllerRef) => {
  if (!query || query.length < MIN_QUERY_LENGTH) return;
  // Abort previous request if it exists
  if (controllerRef?.current) {
    controllerRef.current.abort();
  }

    // Create a new AbortController for the new request
    const controller = new AbortController();
    if(controllerRef){
      controllerRef.current = controller;
    }else{
      return;
    }


  try {
    const res = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
      params: {
        q: query,
        apiKey: HERE_API_KEY,
        in: 'countryCode:NGA', // Limit to Nigeria
      },
      signal: controller.signal,
    });

    const filtered = res.data.items.filter(
      item => item.address.state?.toUpperCase() === 'KADUNA'
    );

    setSuggestions(filtered);
  } catch (err) {
    if (err.name === 'CanceledError' || axios.isCancel(err)) {
    } else {
      console.error('Suggestion error:', err?.response?.data || err.message);
    }
  }
};

// const handleSelect = (item, setCoords, setQuery, isPickup) => {
//   const { lat, lng } = item.position;
//   setCoords({ lat, lng });
//   setQuery(item.title);
//   if (isPickup) {
//     setPickupSuggestions([]);
//     setJustSelected(true);
//   }
// };


  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    // Only fetch if the user is still typing (i.e. not just selected)
    if (pickupQuery.trim() && pickupSuggestions.length === 0) {
      fetchSuggestions(pickupQuery, setPickupSuggestions);
    }
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [pickupQuery]);


  const handleAddToCart = (item) => {
    addToCart(item, quantity);
    toast.success(`${item.name} ${isUpdating ? 'updated' : 'added'} to cart!`);
    setSelectedProduct(null);
    // setSelectedItem(null);
    setQuantity(1);
    setIsUpdating(false);
    // setShowCart(true);
  };

  // Restore loggedUser from cookie
  useEffect(() => {
    const encodedUser = getCookie("lastUser");
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

  useEffect(() => {
    echo.channel('vendors')
      .listen('StatusUpdated', (e) => {
        // Update the status of the specific vendor in state
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === e.vendor_id
              ? { ...store, is_active: e.status }
              : store
          )
        );
      });
  
    return () => {
      echo.leave('vendors');
    };
  }, []);

  //   useEffect(() => {
  //   echo.channel('vendors')
  //     .listen('StatusUpdated', (e) => {
  //       // Update the status of the specific vendor in state
  //       setStores((prevStores) =>
  //         prevStores.map((store) =>
  //           store.id === e.vendor_id
  //             ? { ...store, is_active: e.status }
  //             : store
  //         )
  //       );
  //     });
  
  //   return () => {
  //     echo.leave('vendors');
  //   };
  // }, []);


    // Handle store selection
    const handleStoreSelection = (store) => {
      setSelectedStore(store);
    };

  const toggleLike = (itemName) => {
    setLiked((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const StorePage = ({ store, onBack, liked, toggleLike, isChosen  }) => {
    const categories = store.menu ? Object.keys(store.menu) : [];
    // console.log(store);
    return (
      <div className="p-4 mt-12">
        <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto">
          <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-12 right-4">
            <button className="text-gray-200 hover:text-gray-800" onClick={handleClose}>
              <X size={30} />
            </button>
          </div>
  
          <div className="flex flex-col mt-8 mb-6 px-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{store.vendor_name}</h2>
              <Heart
                className={`cursor-pointer transition-colors duration-200 ${
                  liked[store.vendor_name] ? "fill-red-500" : "stroke-gray-400 hover:stroke-red-500"
                }`}
                onClick={() => toggleLike(store.vendor_name)}
                aria-label="Like this store"
              />
            </div>
  
            {/* Show status of the current selected store */}
            {store.vendor.is_active === 1 ? (
              <div className="mt-2 flex items-center gap-2 text-green-600 font-medium text-sm">
                <span className="h-2 w-2 rounded-full bg-green-600 inline-block"></span>
                <span>Online</span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-red-500 border border-red-600 bg-red-50 rounded-md px-4 py-2 max-w-full break-words">
                <p>
                  This store is <strong>closed</strong> at the moment.
                  <br /> Looking for something similar?
                  <br />
                  <span className="text-blue-600 underline cursor-pointer">
                    Explore stores near you
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
  
          <div className="px-6">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 mb-4 border rounded-lg"
            />
          </div>
  
          {/* Loop through dynamic categories */}
          <div className="space-y-6 px-6 mb-16">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {store.menu[category].map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md flex flex-col relative overflow-hidden cursor-pointer"
                      onClick={() => {
                        handleSelectItem1(item); handleStoreSelection(store);
                      }}
                    >
                      <img
                        src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`}
                        onError={(e) => (e.target.src = fallbackImage)} // define fallbackImage elsewhere
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 text-white p-2 my-1 rounded-lg">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-sm font-bold text-gray-50 mt-1">
                          ₦{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
  
          {/* Cart button */}
          {!showCart && (
            <button
              className="fixed bottom-24 right-6 bg-gray-800 text-white p-4 rounded-full"
              onClick={() => {
                setShowCart(true);
                setIsChosen(false);
                // console.log("store");
              }}
            >
              <ShoppingCart size={24} />
            </button>
          )}
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
    <div className="px-4 ">
{stores.length < 1 && !loading && !userAddress && (
 <div className="fixed top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center bg-green-50 text-center px-6 py-8 overflow-auto">
      <img
        src={burger} // replace with actual illustration
        alt="Delivery illustration"
        className="w-60 h-60 mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Food, groceries and more
      </h2>
      <p className="text-gray-600 text-center mt-2 mb-4">
        Groceries, pharmacies - anything! We need your location to serve you better.
      </p>
      <div className="w-full relative max-w-sm flex items-center border rounded-md overflow-hidden bg-white shadow-sm mb-4">
        <FiMapPin className="mx-3 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={manualAddress}
          // onBlur={handleAddressSubmit}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="Enter your address"
          className="min-h-8 py-2 px-2 outline-none"
        />
        <button
          className="absolute right-0 top-0 h-full bg-green-700 px-4 py-2 text-green-100 rounded-r-md"
          onClick={handleAddressSubmit}
        >
          Submit
        </button>
      </div>

      <button
        onClick={retryGetLocation}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md mb-4"
      >
        <MdGpsFixed size={18} /> Try to detect my location
      </button>

      <button className="text-green-700 underline mb-10">
        Explore stores around you
      </button>


      <div className="text-center text-sm text-gray-500">
        <p>We deliver in</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {[
            "Kaduna", "Abuja", "Jos"
          ].map((country, i) => (
            <span
              key={i}
              className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {country}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-10 text-xs text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} PayNxt. All rights reserved.</p>
      </div>
    </div>
)}


      {loading ? (
        <div className="flex flex-col">
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
                      className="h-[140px] w-[170px] bg-white rounded-2xl shadow-lg flex flex-col justify-end p-3 text-white cursor-pointer"
                      onClick={() => {handleSelectItem(item); setIsChosen(true)}}
                    >
                      <img
                        src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.logo_url}`}
                        alt={item.vendor_name}
                        onError={(e) => (e.target.src = fallbackImage)}
                        className="w-full h-full object-contain mt-4 rounded-2xl pt-8"
                      />

                      <div className="top-3 right-3 absolute  h-8 w-8 flex justify-center items-center rounded-full">
                        <Heart
                          className={`cursor-pointer ${
                            liked[item.vendor_name]
                              ? "fill-red-500"
                              : "stroke-gray-200"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.vendor_name);
                          }}
                        />
                      </div>

                      <div className="text-xs bg-[#00000075] p-2 rounded-lg bottom-2 left-2">
                        <span>{item.vendor_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // <div className="text-gray-500">No store found.</div>
            <div className="">
                   
            </div>
          )}


          {selectedItem ? (
            <StorePage
              store={selectedItem}
              isChosen={isChosen}
              setIsChosen={setIsChosen}
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

      {showCart && (
        <div className="fixed inset-0 bg-white flex flex-col mt-14 py-6 overflow-auto mb-16">
          <div className="relative top-3 left-7 mb-6 font-bold text-xl">
            <h3>My order</h3>
            {/* {console.log(cart)} */}
          </div>
          <div className="bg-[#0000001f] p-2 flex items-center justify-center rounded-3xl absolute top-8 right-4">
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
                {items.map((item) => (
                  <div key={item.name} className="py-3 flex">
                    {/* {console.log(item.vendor_location)} */}
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
                              return { ...prevCart, [vendorId]: updatedItems };
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
                              return { ...prevCart, [vendorId]: updatedItems };
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
              <div className="flex flex-col justify-end mt-4">
                <h3 className="font-semibold text-xl my-2">Order Summary</h3>
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
                          (total, item) => total + item.price * item.quantity,
                          0
                        );
                      const tax = subtotal * 0.075;
                      const total = subtotal + tax + 750;
                      setTotal(formatPrice(total));
                      setShowCheckout(true);
                    }}
                    className="bg-green-400 text-gray-50 px-2 py-2  rounded-md hover:text-gray-800"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-white flex flex-col mt-14 py-6 overflow-auto">
          <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-10 right-4">
            <button
              className=" text-gray-200  hover:text-gray-800"
              onClick={() => {setSelectedProduct(null);  setSelectedStore(null);}}
            >
              <X size={30} />
            </button>
          </div>
          <img
            src={`https://paynxtapi.cyrusnet4d.com/public/storage/${selectedProduct.image_url}`}
            alt={selectedProduct.name}
            className="w-full h-64 object-cover"
          />
          <div className="relative -top-6 bg-white rounded-t-3xl p-4 shadow-xl h-[55%] z-auto">
            <h3 className="text-2xl font-bold mt-4">{selectedProduct.name}</h3>
            <p className="text-gray-600 text-sm mt-2">
              {selectedProduct.description}
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
                    {formatPrice(selectedProduct.price * quantity)}
                  </span>
                </span>
              </div>
            </div>
            {selectedStore.is_active === 1 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // setShowCart(true);
                  setSelectedProduct(null);
                  handleAddToCart(selectedProduct);
                }}
                className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600"
              >
                {isUpdating ? "Update Cart" : "Add to Cart"}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600 disabled"
                disabled
              >
                Vendor is offline!
              </motion.button>
            )}
           
          </div>
        </div>
      )}

                           {showCheckout && (
                                   <div className="fixed inset-0 bg-white flex flex-col mt-12 pb-28 overflow-auto">
                                     <div className="px-6 pt-10 pb-3 flex justify-between items-center border-b border-gray-200">
                                       <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                                       <button onClick={() => {setShowCheckout(false); }} className="text-gray-600 hover:text-red-500 transition">
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
                                              <textarea
                                                  name="address"
                                                  value={pickupQuery}
                                                  // onChange={(e) => setPickupQuery(e.target.value)}
                                                  onChange={(e) => {
                                                      const newValue = e.target.value;
                                                      setPickupQuery(newValue);
                                                      setFormData((prev) => ({ ...prev, address: newValue }));
                                                    }}
                                                  onBlur={handleAddressSubmit}
                                                  rows="2"
                                                  placeholder=" "
                                                  className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"
                                                />
                                             <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Delivery Address</label>
                                           </div>
                                           <div className="relative">
                                             <input name="phone" value={formData.phone} onChange={handleFormChange} type="tel" placeholder=" " className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent" />
                                             <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">Phone Number</label>
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

export default Stores;

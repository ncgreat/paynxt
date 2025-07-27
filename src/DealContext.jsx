import React, { createContext, useState } from 'react';
// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

export const DealContext = createContext();

export function DealProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState('');
  const [loggedVendor, setLoggedVendor] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [parentMenu, setParentMenu] = useState(null); // NEW

  const [settings, setSettings] = useState({
    darkMode: false,
    theme: 'light',
    currency: 'NGN',
    locale: 'en-US',
    language: 'English',
    currencySymbol: '₦',
  });

  const [balance, setBalance] = useState(0);

  const topBalance = (amount) => {
    setBalance((prev) => prev - amount);
  };

  const updateBalance = (amount) => {
    setBalance((prev) => prev + amount);
  };

  const resetBalance = () => {
    setBalance(0);
  };

  const resetUser = () => {
    setLoggedUser('');
  };

  // Cart management
  const [cart, setCart] = useState({});

  const clearCart = () => setCart({});

  const addToCart = (item, quantity = 1) => {
    const vendorId = item.vendor_id;
  
    setCart((prevCart) => {
      const currentItems = prevCart[vendorId] || [];
      const existingItemIndex = currentItems.findIndex((i) => i.name === item.name);
  
      const updatedItems =
        existingItemIndex > -1
          ? currentItems.map((i) =>
              i.name === item.name ? { ...i, quantity } : i
            )
          : [...currentItems, { ...item, quantity }];
  
      return {
        ...prevCart,
        [vendorId]: updatedItems,
      };
    });
  };
  

  const addToCart1 = (item, quantity = 1) => {
    const vendorId = item.vendor_id;

    setCart((prevCart) => {
      const currentItems = prevCart[vendorId] || [];
      const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

      const updatedItems =
        existingItemIndex > -1
          ? currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity } : i
            )
          : [...currentItems, { ...item, quantity }];

      return {
        ...prevCart,
        [vendorId]: updatedItems,
      };
    });

    // toast.success(`${item.name} added to cart!`);
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = {};
      for (const vendorId in prevCart) {
        updatedCart[vendorId] = prevCart[vendorId].map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      return updatedCart;
    });
  };

  const removeFromCart = (vendorId, itemId) => {
    setCart((prevCart) => {
      const updatedItems = (prevCart[vendorId] || []).filter(
        (item) => item.id !== itemId
      );
      return {
        ...prevCart,
        [vendorId]: updatedItems,
      };
    });
  };

  const getCartTotal = () =>
    Object.values(cart)
      .flat()
      .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <DealContext.Provider
      value={{
        // User & Vendor
        loggedUser,
        setLoggedUser,
        loggedVendor,
        setLoggedVendor,
        resetUser,

        // UI States
        isMenuOpen,
        setIsMenuOpen,
        isSettings,
        setIsSettings,
        viewMore,
        setViewMore,

        parentMenu,
        setParentMenu, // ✅ Add this

        isModalOpen: false,
        setIsModalOpen: () => {},


        showCart: false,
        setShowCart: () => {},
        showCheckout: false,
        setShowCheckout: () => {},
        selectedItem: false,
        setSelectedItem: () => {},
        selectedStore: false,
        setSelectedStore: () => {},
        isChosen: false,
        setIsChosen: () => {},

        // Settings
        settings,
        setSettings,

        // Balance
        balance,
        updateBalance,
        topBalance,
        resetBalance,

        // Cart
        cart,
        setCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}
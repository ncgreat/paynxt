import React, { useState, useEffect, useContext, useRef } from "react";
import { DealContext } from "../../DealContext";
import { Heart, X, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SearchResults = ({ results, onClose, showCart, setShowCart ,showCheckout, setShowCheckout, selectedItem, setSelectedItem, clearedSearch }) => {
    const [quantity, setQuantity] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [total, setTotal] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Wallet Balance");
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        note: "",
      });

      const {
          loggedUser, 
          setLoggedUser,
          cart,
          addToCart,
          removeFromCart,
          clearCart,
          setCart,
          updateCartItemQuantity,
          getCartTotal,
        } = useContext(DealContext);

    const handleSelectItem = (item) => {
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
        setSelectedItem(item);
    };

      const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 0 }).format(price);

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
        makeOrder();
        setTimeout(() => {
        setOrderSuccess(false);
        setShowCheckout(false);
        setShowCart(false);
        setCart([]);
        setFormData({ name: "", phone: "", address: "", note: "" });
        }, 3000);
    };


  return (
    <div className="inset-0 bg-white overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Search Results</h2>
        <button onClick={onClose} className="text-gray-500 text-sm">Close</button>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-gray-500">No matching foods found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {results.map((item) => (
            <div 
                key={item.id} 
                className="rounded-xl p-2 bg-white shadow"
                onClick={() => handleSelectItem(item)}
            >
              <img src={`https://paynxtapi.cyrusnet4d.com/public/storage/${item.image_url}`} alt={item.name} className="rounded-lg h-24 w-full object-cover" />
              <div className="text-sm mt-2 font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">₦{item.price}</div>
            </div>
          ))}
        </div>
      )}

       {selectedItem && (
            <div className="fixed inset-0 bg-white flex flex-col mt-10 py-6 overflow-auto">
              <div className="bg-[#0000004b] p-1 flex items-center justify-center rounded-3xl absolute top-12 right-4">
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
                    setSelectedItem(null);
                    toast.success(`${selectedItem.name} ${isUpdating ? 'updated' : 'added'} to cart!`);
                    addToCart(selectedItem, quantity);
                  }}
                  className="w-full mt-4 bg-gray-800 text-white py-4 rounded-full hover:bg-gray-600"
                >
                  {isUpdating ? "Update Cart" : "Add to Cart"}
                </motion.button>
              </div>
            </div>
          )}

        {!showCart && (
          <button
            className="fixed bottom-24 right-6 bg-gray-800 text-white p-4 rounded-full"
            onClick={() => {setShowCart(true);}}
          >
            <ShoppingCart size={24} />
          </button>
        )}
          {showCart && (
            <div className="fixed inset-0 bg-white flex flex-col mt-14 py-6 overflow-auto mb-16">
              <div className="relative top-3 left-7 mb-6 font-bold text-xl">
                <h3>My order</h3>
              </div>
              <div className="bg-[#0000001f] p-1 flex items-center justify-center rounded-3xl absolute top-12 right-4">
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
                        className="bg-gray-200 text-gray-600 px-2 py-2  rounded-md hover:text-gray-800"
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
            <div className="fixed inset-0 bg-white flex flex-col mt-14 pb-28 overflow-auto">
              <div className="px-6 pt-9 pb-3 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="px-6 py-2 space-y-6">
                <div>
                  <div className="flex justify-between mt-0 pt-1 font-semibold text-lg">
                    <span>Total</span>
                    <span>₦{total}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Estimated Delivery:{" "}
                    <strong className="text-gray-800">20-30 minutes</strong>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <div className="flex gap-4">
                    {["Wallet Balance", "Paystack"].map((method) => (
                      <button
                        key={method}
                        className={`px-4 py-2 border rounded-lg capitalize ${
                          paymentMethod === method
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-700"
                        }`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Delivery Information
                  </h3>
                  <form className="space-y-6">
                    <div className="relative">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        type="text"
                        placeholder=" "
                        className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"
                      />
                      <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">
                        Full Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        type="tel"
                        placeholder=" "
                        className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"
                      />
                      <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">
                        Phone Number
                      </label>
                    </div>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        rows="2"
                        placeholder=" "
                        className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"
                      ></textarea>
                      <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">
                        Delivery Address
                      </label>
                    </div>
                    <div className="relative">
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleFormChange}
                        rows="2"
                        placeholder=" "
                        className="peer w-full border-b border-gray-300 focus:outline-none focus:border-gray-800 py-2 placeholder-transparent"
                      ></textarea>
                      <label className="absolute left-0 -top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm">
                        Additional Note (Optional)
                      </label>
                    </div>
                  </form>
                </div>
              </div>

              <div className="fixed bottom-16 left-0 right-0 bg-white shadow-md px-6 py-4">
                <button
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 transition"
                  onClick={handleConfirmOrder}
                >
                  Confirm Order
                </button>
              </div>

              {formError && (
                <div className="absolute inset-x-0 top-80 flex justify-center z-50">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-md flex items-center space-x-3 animate-bounce">
                    <AlertCircle size={24} />
                    <span className="text-sm font-medium">
                      Please fill in all required fields.
                    </span>
                  </div>
                </div>
              )}

              {orderSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                  <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl text-center shadow-xl animate-bounce">
                    <CheckCircle className="mx-auto mb-2" size={36} />
                    <p className="font-bold text-lg">
                      Order Placed Successfully!
                    </p>
                    <p className="text-sm">We’re preparing your meal. 🍽️</p>
                  </div>
                </div>
              )}
            </div>
          )}
    </div>
  );
};

export default SearchResults;

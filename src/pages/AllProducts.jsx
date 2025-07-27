import React, { useState, useContext, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DealContext } from "../DealContext";
import { motion, AnimatePresence } from 'framer-motion';
import wait from '../assets/loading.gif';
import Swal from 'sweetalert2';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);

  const toggleProductDetails = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
   };

  const newProduct = () =>{
    setIsModalOpen(true);
    setIsNewProduct(true);
  }

  const handleToggle = async (productId, field, currentValue) => {
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("field", field);
      formData.append("value", currentValue);

      // console.log(currentValue);
      // return;
      const response = await fetch(`${getBaseUrl()}/vendor/update_product_toggle`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.success) {
        setProducts(prev =>
          prev.map(product =>
            product.id === productId ? { ...product, is_available: data.product.is_available } : product
          )
        );
      } else {
        alert('Update failed.');
      }
    } catch (error) {
      console.error('Error updating product field:', error);
      alert('Something went wrong.');
    }
  };
  

  const addNewProduct = async () => {
    setIsLoading(true);
    let final_price = productPrice + (productPrice * 0.075);
    try {
      const formData = new FormData();
      formData.append("vendor_id", loggedVendor?.user?.id);
      formData.append("name", productName);
      formData.append("category", productCategory);
      formData.append("price", final_price);
      formData.append("description", productDescription);
      formData.append("business_category", loggedVendor?.user?.business_category);
      if (productImage) {
        formData.append("image", productImage);
      }
  
      const response = await fetch(`${getBaseUrl()}/vendor/store_product`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Append new product to state
        setProducts((prev) => [...prev, data.data]);
         Swal.fire({
              title: 'New Item Added',
              text: `The item price has been adjusted to include 7.5% VAT`,
              icon: 'success',
              customClass: { container: 'borderless' },
        });
        setIsModalOpen(false); // Close modal
        setProductName("");
        setProductCategory("");
        setProductPrice("");
        setProductDescription("");
        setProductImage(null);
      } else {
        console.error("Failed to add product:", data.message || data);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/vendor/products?vendor_id=${loggedVendor?.user?.id}`);
        const data = await res.json();
        setProducts(data.data);
      } catch (err) {
        console.log("Error fetching products", err);
      }
    };
  
    fetchProducts();
  }, [loggedVendor]);

  return (
    <div className="p-2 md:p-6 relative bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-gray-800 mb-6">All Products</h2>
      <p className="text-gray-600 mb-4">
        Browse and manage restaurant food items efficiently.
      </p>

      <button
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 transition"
        onClick={newProduct}
      >
        Add New Product
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="p-3 text-left hidden md:flex">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left hidden md:flex">Category</th>
              <th className="p-3 text-left">Price</th>
              {/* <th className="p-3 text-left hidden md:flex">Stock</th> */}
              {/* <th className="p-3 text-left">Status</th> */}
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr
                  className="text-gray-700 hover:bg-gray-100 border-b transition-all duration-[1s,15s] cursor-pointer "
                  onClick={() => toggleProductDetails(product.id)}
                >
                  <td className="p-3 hidden md:table-cell">
                    <img
                      src={`https://paynxtapi.cyrusnet4d.com/public/storage/${product.image_url}`}
                      width={50}
                      className="rounded-lg h-[50px]"
                    />
                  </td>
                  <td className="p-3 align-middle">{product.name}</td>
                  <td className="p-3 hidden md:table-cell align-middle">
                    {product.category}
                  </td>
                  <td className="p-3 font-semibold align-middle">
                    {product.price}
                  </td>
                  <td className="p-3 align-middle">
                    <button
                      className="text-gray-600 hover:text-gray-900 transition"
                      onClick={() => toggleProductDetails(product.id)}
                    >
                      {expandedProduct === product.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedProduct === product.id && (
                  <tr className="h-[80px]">
                    <td colSpan="3" className="p-4 bg-gray-50 text-gray-600">
                      <div className="space-y-3">
                        <p>
                          <strong>Description:</strong> {product.description}
                        </p>

                        <div className="flex items-center space-x-2">
                          <label htmlFor={`available-${product.id}`} className="flex items-center space-x-1">
                            <span>Available</span>
                            <input
                              type="checkbox"
                              id={`available-${product.id}`}
                              checked={product.is_available === 1}
                              onChange={() => handleToggle(product.id, 'is_available', product.is_available === 1 ? 0 : 1)}  // Toggle the value between 0 and 1
                              className="relative inline-block w-10 h-6 bg-gray-300 rounded-full transition duration-300 ease-in-out"
                            />
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                                product.is_available === 1 ? 'transform translate-x-4' : ''
                              }`}
                            />
                          </label>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.2,
            },
          }}
        >
          <motion.div
            initial={{
              scale: 0.5,
            }}
            animate={{ scale: 1, transition: { duration: 0.2 } }}
            className="fixed inset-0 flex items-center justify-center px-4 z-50"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
            <div className="bg-white rounded-lg overflow-hidden mx-2 shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="flex bg-[#fafafa] px-4 py-3 sm:px-2 justify-between">
                <div className="flex items-center">
                  {/* <img src={logo} alt="logo" className="w-12" /> */}
                  <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                    className=" w-full text-[#206666]"
                  >
                    <span className="font-bold drop-shadow">PayNxt</span>{" "}
                  </motion.div>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setProductCategory("");
                  }}
                  className="text-[#042326] hover:text-[#160819] transition ease-in-out duration-150 "
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 md:px-4 py-2">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex flex-col items-center">
                      <img
                        src={wait}
                        alt="Loading..."
                        className="h-16 w-16 mb-2 rounded-lg"
                      />
                      {/* <span className="text-white text-lg font-medium">Processing your request...</span> */}
                    </div>
                  </div>
                )}
                {isNewProduct && (
                  <div>
                    <motion.div
                      initial={{ x: -200, opacity: 0 }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.2 },
                      }}
                      className="w-full text-[#042326] font-bold text-lg mb-4"
                    >
                      Add New Product
                    </motion.div>

                    <div className="flex flex-col gap-4">
                      {/* Product Name */}
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="block py-2.5 px-3 w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />

                      {/* Category */}
                      {/* <input
                          type="text"
                          placeholder="Category"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                          className="block py-2.5 px-3 w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        /> */}
                      {/* Category Selection */}
                      <div className="border border-gray-300 p-3 rounded-lg">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Select Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Soups",
                            "Rice",
                            "Swallows",
                            "Beans",
                            "Grills",
                            "Pasta",
                            "Snacks",
                            "Burgers",
                            "Breakfast",
                            "Drinks",
                            "Salads",
                            "Seafood",
                            "Pepper Soup",
                            "Noodles",
                            "Egg",
                            "Yam & Potatoes",
                            "Desserts",
                            "Local Delicacies",
                            "Shawarma",
                          ].map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => setProductCategory(category)}
                              className={`px-4 py-2 text-sm rounded-md border 
                                    ${
                                      productCategory === category
                                        ? "bg-[#206666] text-white border-[#206666]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <input
                        type="number"
                        placeholder="Price (e.g. 1500)"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="block py-2.5 px-3 w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                        <span className="text-xs -mt-4 text-gray-400">The final price will be adjusted to include 7.5% VAT</span>
                      {/* Description */}
                      <textarea
                        placeholder="Product Description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="block py-2.5 px-3 w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        rows={3}
                      />

                      {/* Image Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProductImage(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />

                      {/* Action Buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={addNewProduct}
                          type="button"
                          className="text-white bg-[#206666] hover:bg-[#124949] font-medium rounded-md text-sm px-5 py-2.5"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setProductCategory("");
                          }}
                          type="button"
                          className="text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-md text-sm px-5 py-2.5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AllProducts;

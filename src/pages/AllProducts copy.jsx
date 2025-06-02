import { useState } from "react";

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [products, setProducts] = useState([
    { id: 1, name: "Apple", price: 1.2, stock: "In Stock", category: "Fruits", dateAdded: "2024-03-20", image: "https://via.placeholder.com/50" },
    { id: 2, name: "Banana", price: 0.5, stock: "Out of Stock", category: "Fruits", dateAdded: "2024-03-21", image: "https://via.placeholder.com/50" },
    { id: 3, name: "Carrot", price: 0.8, stock: "In Stock", category: "Vegetables", dateAdded: "2024-03-22", image: "https://via.placeholder.com/50" }
  ]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Products</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Add New Product</button>
      </div>

      {/* Search & Sorting */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Product List */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Date Added</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border p-2">
                <img src={product.image} alt={product.name} className="h-10 w-10" />
              </td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">${product.price.toFixed(2)}</td>
              <td className={`border p-2 ${product.stock === "In Stock" ? "text-green-500" : "text-red-500"}`}>{product.stock}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.dateAdded}</td>
              <td className="border p-2">
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Placeholder */}
      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded mr-2">Prev</button>
        <button className="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
};

export default AllProducts;
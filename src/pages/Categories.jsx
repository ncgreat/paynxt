import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Burgers", description: "Delicious grilled and fried burgers." },
    { id: 2, name: "Pizzas", description: "Stone-baked and cheesy pizzas." },
    { id: 3, name: "Pasta", description: "Classic Italian pasta dishes." },
    { id: 4, name: "Sushi", description: "Fresh sushi rolls and sashimi." },
    { id: 5, name: "Healthy Bowls", description: "Nutritious and delicious bowls." }
  ]);

  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategoryDetails = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const addNewCategory = () => {
    const newCategory = { id: categories.length + 1, name: "New Category", description: "Category description here." };
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl  text-gray-800">Categories</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          onClick={addNewCategory}
        >
          Add New Category
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Category Name</th>
            <th className="border p-3 text-left">Description</th>
            <th className="border p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <tr 
                className="text-gray-700 hover:bg-gray-100 transition border-b cursor-pointer"
                onClick={() => toggleCategoryDetails(category.id)}
              >
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category.description}</td>
                <td className="p-3">
                  <button 
                    className="text-gray-600 hover:text-gray-900 transition"
                    onClick={() => toggleCategoryDetails(category.id)}
                  >
                    {expandedCategory === category.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </td>
              </tr>
              {expandedCategory === category.id && (
                <tr>
                  <td colSpan="3" className="p-4 bg-gray-50 text-gray-600">
                    More details about {category.name}.
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;

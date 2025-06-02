import { useState } from "react";
import { 
  ChevronDown, ChevronRight, Menu, Package, Layers, Plus, ShoppingBag, CheckCircle, 
  History, BarChart2, Users, CreditCard, Truck, Building
} from "lucide-react"; // Import icons
import logo from "../../assets/logo.png";

// Import all submenu components
import AllProducts from "../../pages/AllProducts";
import Categories from "../../pages/Categories";
import AddProduct from "../../pages/AddProduct";
import ActiveOrders from "../../pages/ActiveOrders";
import CompletedOrders from "../../pages/CompletedOrders";
import OrderHistory from "../../pages/OrderHistory";
import SalesReports from "../../pages/SalesReports";
import CustomerInsights from "../../pages/CustomerInsights";
import CompanySettings from "../../pages/CompanySettings";
import DeliveryOptions from "../../pages/DeliveryOptions";

const FoodVendor = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  // const [displayedComponent, setDisplayedComponent] = useState(null);
  const [displayedComponent, setDisplayedComponent] = useState(() => ActiveOrders);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const menuItems = [
    {
      title: "Order Management",
      icon: <ShoppingBag size={18} />, 
      submenu: [
        { name: "Active Orders", icon: <ShoppingBag size={16} />, component: () => <ActiveOrders /> },
        { name: "Completed Orders", icon: <CheckCircle size={16} />, component: () => <CompletedOrders /> },
        // { name: "Order History", icon: <History size={16} />, component: () => <OrderHistory /> },
      ],
    },
    {
      title: "Menu & Products",
      icon: <Package size={18} />, 
      submenu: [
        { name: "All Products", icon: <Package size={16} />, component: () => <AllProducts /> },
        { name: "Categories", icon: <Layers size={16} />, component: () => <Categories /> },
        // { name: "Add New Product", icon: <Plus size={16} />, component: () => <AddProduct /> },
      ],
    },
    {
      title: "Analytics & Reports",
      icon: <BarChart2 size={18} />, 
      submenu: [
        { name: "Sales Reports", icon: <BarChart2 size={16} />, component: () => <SalesReports /> },
        { name: "Customer Insights", icon: <Users size={16} />, component: () => <CustomerInsights /> },
      ],
    },
    // {
    //   title: "Configuration",
    //   icon: <CreditCard size={18} />, 
    //   submenu: [
    //     { name: "Payment Settings", icon: <CreditCard size={16} />, component: () => <PaymentSettings /> },
    //     { name: "Delivery Options", icon: <Truck size={16} />, component: () => <DeliveryOptions /> },
    //   ],
    // },
    {
      title: "Vendor",
      icon: <Building size={18} />, 
      submenu: [{ name: "Settings", icon: <Building size={16} />, component: () => <CompanySettings /> },],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 bg-[#1c1c1c] w-64 p-6 text-[#23b02c] z-40 transform rounded-r-3xl shadow-xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:w-1/5 transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          className="md:hidden absolute top-4 right-4 text-white text-2xl"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✖
        </button>

        {/* Logo & Title */}
        <div className="flex items-center lg:justify-center mb-5 mt-12">
          <img className="h-[50px]" src={logo} alt="Logo" />
          <h1 className="text-green-600 text-2xl font-semibold ml-2 mt-5">NxtFood</h1>
        </div>
        <div className="flex flex-row justify-center">
						<div className="or-spacer">
						<div className="mask"></div>
						</div>
					</div>
        {/* Sidebar Menu */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* Parent Menu */}
              <div
                className={`flex items-center justify-between cursor-pointer p-3 transition rounded-md
                  ${openMenu === index ? "bg-[#23b02c] text-white" : "hover:text-green-400"}
                `}
                onClick={() => toggleMenu(index)}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.submenu.length > 0 &&
                  (openMenu === index ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
              </div>

              {/* Submenu */}
              {openMenu === index && item.submenu.length > 0 && (
                <ul className="pl-6 space-y-1 mt-2 my-3">
                  {item.submenu.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className={`flex items-center space-x-2 cursor-pointer p-3 transition rounded-md
                        ${
                          activeComponent === subItem.name
                            ? "bg-[#93a294] text-white"
                            : "text-[#23b02c] hover:bg-[#93a294] hover:text-white"
                        }
                      `}
                      onClick={() => {
                        alert(subItem.name);
                        setActiveComponent(subItem.name);
                        setDisplayedComponent(() => subItem.component);
                        setIsSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                    >
                      {subItem.icon}
                      <span>{subItem.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content (Dynamically Rendered) */}
      <main className="bg-gray-100 flex-1 p-6 mt-8 text-gray-600 md:ml-0">
        {displayedComponent()}
      </main>
    </div>
  );
};

export default FoodVendor;

import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Package,
  Layers,
  Plus,
  ShoppingBag,
  CheckCircle,
  History,
  BarChart2,
  Users,
  CreditCard,
  Truck,
  Building,
  Pizza,
  Drumstick,
  LogOut,
  Volume2,
  VolumeX,
} from "lucide-react"; // Import icons
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import { DealContext } from "../../DealContext";
import notificationSound from "../../assets/notification.mp3"; // Adjust path if needed
import axios from "axios";

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
import wait from "../../assets/loading.gif";
import "./dashboard.css";
// import DeliveryOptions from "../../pages/DeliveryOptions";

const FoodVendor = () => {
  const [openMenu, setOpenMenu] = useState(0);
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);
  const [activeComponent, setActiveComponent] = useState("Active Orders");
  const [displayedComponent, setDisplayedComponent] = useState(
    <ActiveOrders />
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newOrder, setNewOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
   };

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const handleLogout = () => {
    document.cookie = `lastVendor=; path=/; max-age=0`;
    localStorage.clear();
    // navigate.push('/');
    window.location.href = "/vendor-login"; // Or use a router redirect
  };

  useEffect(() => {
    const encodedVendor = getCookie("lastVendor");
    if (!encodedVendor) {
      history.push("/"); // Redirect to login
    } else {
      setIsLoading(false);
    }
  }, []);

  // useEffect(()=>{
  //   const setStatus = async () => {
  //     const vendorId = loggedVendor?.user?.id;
  //     if (!vendorId) return;
  
  //     try {
  //       const response = await axios.post(`${getBaseUrl()}/vendor/status`, {
  //         vendor_id: vendorId,
  //         status:isOnline,
  //       });
  //       // console.log(isOnline);
  //       const data = response;
  //       // setLoggedVendor(prev => ({ ...prev, user: { ...prev.user, logo: response.data.data.logo_url }}));
  //     } catch (error) {
  //       console.log('Error fetching logo:', error);
  //     }
  //   };
  
  //   setStatus();
  // },[isOnline])

    const handleSetStatus = async () => {
      const vendorId = loggedVendor?.user?.id;
      if (!vendorId) return;
  
      try {
        const response = await axios.post(`${getBaseUrl()}/vendor/status`, {
          vendor_id: vendorId,
          status:!isOnline,
        });
        // console.log(isOnline);
        const data = response;
        // setLoggedVendor(prev => ({ ...prev, user: { ...prev.user, logo: response.data.data.logo_url }}));
      } catch (error) {
        console.log('Error fetching logo:', error);
      }
    };

  useEffect(()=>{
    const getActive = async () => {
      const vendorId = loggedVendor?.user?.id;
      if (!vendorId) return;
  
      try {
        const response = await axios.post(`${getBaseUrl()}/vendor/get_active`, {
          vendor_id: vendorId,
        });
        const data = response;
        console.log(data);
        if(data.data.data.active === 1){
          setIsOnline(true);
        }else{
          setIsOnline(false);
        }
      } catch (error) {
        console.log('Error fetching logo:', error);
      }
    };
  
    getActive();
  },[])


  useEffect(() => {
    const encodedVendor = getCookie("lastVendor");
  
    if (!loggedVendor?.user && encodedVendor) {
      try {
        const vendor = JSON.parse(atob(encodedVendor));
        setLoggedVendor(vendor.vendorLogged);
      } catch (err) {
        console.log("Error decoding user cookie:", err);
      }
    }
  }, []);
  


  useEffect(() => {
    const fetchLogo = async () => {
      const vendorId = loggedVendor?.user?.id;
      if (!vendorId) return;
  
      try {
        const response = await axios.post(`${getBaseUrl()}/vendor/logo`, {
          vendor_id: vendorId,
        });
        // console.log(response.data.data);
        // You can now update logo in state or context
        setLoggedVendor(prev => ({ ...prev, user: { ...prev.user, logo: response.data.data.logo_url }}));
      } catch (error) {
        console.log('Error fetching logo:', error);
      }
    };
  
    fetchLogo();
  }, [loggedVendor?.user?.id]);
  

  useEffect(() => {
    if (newOrder) {
      if (!isMuted) {
        const audio = new Audio(notificationSound);
        audio.play();
      }
      setTimeout(() => setNewOrder(false), 1000); // Reset after 1 sec
    }
  }, [newOrder]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const menuItems = [
    {
      title: "Order Management",
      icon: <ShoppingBag size={18} />,
      submenu: [
        {
          name: "Active Orders",
          icon: <ShoppingBag size={16} />,
          component: () => <ActiveOrders />,
        },
        // { name: "Completed Orders", icon: <CheckCircle size={16} />, component: () => <CompletedOrders /> },
        {
          name: "Order History",
          icon: <History size={16} />,
          component: () => <OrderHistory />,
        },
      ],
    },
    {
      title: "Menu & Products",
      icon: <Package size={18} />,
      submenu: [
        {
          name: "All Products",
          icon: <Package size={16} />,
          component: () => <AllProducts />,
        },
        // {
        //   name: "Categories",
        //   icon: <Layers size={16} />,
        //   component: () => <Categories />,
        // },
        // { name: "Add New Product", icon: <Plus size={16} />, component: () => <AddProduct /> },
      ],
    },
    {
      title: "Analytics & Reports",
      icon: <BarChart2 size={18} />,
      submenu: [
        {
          name: "Sales Reports",
          icon: <BarChart2 size={16} />,
          component: () => <SalesReports />,
        },
        {
          name: "Customer Insights",
          icon: <Users size={16} />,
          component: () => <CustomerInsights />,
        },
      ],
    },

    {
      title: "Vendor",
      icon: <Building size={18} />,
      submenu: [
        {
          name: "Settings",
          icon: <Building size={16} />,
          component: () => <CompanySettings />,
        },
      ],
    },
    // {
    //   title: "Logout",
    //   icon: <LogOut size={18} />,
    //   submenu: [],
    // },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={wait} width={100} alt="Loading..." />
      </div>
    );
  }
  // console.log(loggedVendor.user.id);

  return (
    <div className="flex min-h-screen h-auto overflow-y-auto">
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
          {/* <img className="h-[30px] mt-4" src={logo} alt="Logo" /> */}
          <h1 className="text-green-600 text-2xl ml-2 mt-5 font-foody">
            NxtFood
          </h1>
          <Drumstick className="ml-2 mt-3 text-green-600" size={24} />
        </div>
        <div className="flex flex-row justify-center mb-4">
          <div className="or-spacer">
            <div className="mask "></div>
          </div>
        </div>
        {/* Sidebar Menu */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* Parent Menu */}
              <div
                className={`flex items-center justify-between cursor-pointer p-3 transition rounded-md
                  ${
                    item.title === "Logout"
                      ? "hover:bg-[#23b02c] text-green-600 hover:text-green-200"
                      : openMenu === index
                      ? "bg-[#23b02c] text-white"
                      : "hover:text-green-400"
                  }
                `}
                onClick={() => {
                  if (item.title === "Logout") {
                    handleLogout();
                  } else {
                    toggleMenu(index);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.submenu.length > 0 &&
                  (openMenu === index ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  ))}
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
                        setActiveComponent(subItem.name);
                        setDisplayedComponent(subItem.component);
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
       {/* Logout Button at Bottom with Vendor Name & Confirmation */}
        <div className="absolute bottom-6 w-full px-6 left-0">
          {/* <div
            className="flex items-center justify-between text-sm text-gray-400 mb-2"
          >
            <span className="truncate w-full ml-3">
              {loggedVendor?.user.business_name || "Vendor"}
            </span>
          </div> */}
           <div className="flex items-baseline mb-3">
            <div className="w-10 h-10 border border-gray-500 rounded-xl flex items-center justify-center text-white font-semibold mr-3 ml-2">
              {/* {loggedVendor?.user.business_name?.charAt(0).toUpperCase() || "V"} */}
              <img src={`https://paynxtapi.cyrusnet4d.com/public/storage/${loggedVendor.user.logo}`} className="rounded-md" width={20}/>
            </div>
            <div className="flex-1 text-sm text-gray-200 truncate">
            {loggedVendor?.user.business_name || "Vendor"}
            </div>
          </div>
          <div
            className="flex items-center p-3 text-red-500 hover:text-white hover:bg-red-500 transition rounded-md cursor-pointer"
            onClick={() => {
              Swal.fire({
                title: 'Are you sure?',
                text: "You will be logged out of your vendor account.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c1c1c',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, log me out',
                // background: '#ccc',
                color: '#fff',
              }).then((result) => {
                if (result.isConfirmed) {
                  handleLogout();
                }
              });
            }}
          >
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </div>
        </div>

      </nav>

      {/* Main Content (Dynamically Rendered) */}
      <main className="bg-gray-100 flex-1 p-6 mt-12 text-gray-600 md:ml-0">
        <div className=" rounded-md border border-gray-300 mb-4">
          <ul className="flex w-[300px] justify-between p-2 text-gray-700 mx-5 ">
            <li
              className="cursor-pointer flex"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? "Muted" : "Unmuted"}
              {isMuted ? (
                <VolumeX size={18} className="ml-2 mt-1" />
              ) : (
                <Volume2 size={18} className="ml-2 mt-1" />
              )}
            </li>
            <li className="flex ">
              Online
              <label className="toggle ml-1 cursor-pointer">
              <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={() => {setIsOnline(!isOnline); handleSetStatus()}}
                />
                <span className="slider"></span>
                <span className="labels"></span>
              </label>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setNewOrder(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Simulate New Order
        </button>
        {displayedComponent}
      </main>
    </div>
  );
};

export default FoodVendor;

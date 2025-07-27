import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DealContext } from '../../DealContext';
import { Link } from 'react-router-dom';
import { QuickActions } from "../actions/QuickActions";

import { 
  ReceiptText, 
  ShoppingCart, 
  UtensilsCrossed, 
  Gift, 
  CreditCard, 
  MapPin,
  Shield,
  Ticket,
  ChevronRight 
} from "lucide-react";
import { Card } from "../../components/ui/card";
import purse from "../../assets/purse.png";
import cart from "../../assets/shopping_cart.png";
import coffee from "../../assets/coffee1.png";

import billsBg from "../../assets/purse.png";
import groceriesBg from "../../assets/shopping_cart.png";
import foodBg from "../../assets/coffee1.png";
import giftcardBg from "../../assets/purse.png";
import virtualcardBg from "../../assets/purse.png";
import travelBg from "../../assets/shopping_cart.png";
import insuranceBg from "../../assets/shopping_cart.png";
import ticketBg from "../../assets/purse.png";

const Mdash = ({user}) => {
  const history = useHistory();
  const { setParentMenu } = useContext(DealContext);
    const { loggedUser, setLoggedUser } = useContext(DealContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
   const [showAllServices, setShowAllServices] = useState(false);

   const baseServices = [
  {
    title: "Bills",
    subtitle: "Pay utility bills",
    icon: ReceiptText,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50/80",
    link: "/bills",
    menuKey: "bills",
  },
  {
    title: "Groceries",
    subtitle: "Order groceries",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50/80",
    link: "/groceries",
    menuKey: "groceries",
  },
  {
    title: "Food",
    subtitle: "Order meals",
    icon: UtensilsCrossed,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50/80",
    link: "/foods",
    menuKey: "foods",
  },
  {
    title: "Gift Cards",
    subtitle: "Buy gift cards",
    icon: Gift,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50/80",
    link: "/giftcards",
    menuKey: "giftcards",
    user:user,
  },
];

const extraServices = [
    {
    title: "Insurance",
    subtitle: "Manage policies",
    icon: Shield,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50/80",
    link: "#",
    menuKey: "insurance",
  },
  {
    title: "Virtual Card",
    subtitle: "Manage cards",
    icon: CreditCard,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50/80",
    link: "#",
    menuKey: "virtualcards",
  },
  // {
  //   title: "Travel",
  //   subtitle: "Book trips",
  //   icon: MapPin,
  //   color: "from-teal-500 to-cyan-600",
  //   bgColor: "bg-teal-50/80",
  //   link: "#",
  //   menuKey: "travel",
  // },
  // {
  //   title: "Tickets",
  //   subtitle: "Event tickets",
  //   icon: Ticket,
  //   color: "from-violet-500 to-purple-600",
  //   bgColor: "bg-violet-50/80",
  //   link: "#",
  //   menuKey: "tickets",
  // }
];

const services = showAllServices ? [...baseServices, ...extraServices] : baseServices;
  
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  const handleActionClick = (menuKey, link) => {
    setParentMenu(menuKey);
    history.push(link);
  };

  return (
    <div className=" items-center justify-center mb-4 lg:px-[6%]">
      <div className="px-4 bg-white rounded-lg lg:shadow-sm">
        <div className="sm:ml-14">
          <h4 className="mx-2 mt-3 mb-3 text-xl lg:block">
            What can we help you with?
          </h4>
        </div>
        <QuickActions 
          user={user}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      <div className="flex items-center justify-between mt-3 mb-4 px-2">
        <h2 className="text-xl font-semibold text-slate-800">Services</h2>
        <button 
          className="text-sm text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-700 transition-colors"
          onClick={() => setShowAllServices(!showAllServices)}
        >
          {showAllServices ? "Show less" : "View all"}
          <ChevronRight className="h-4 w-4 transform transition-transform duration-300" />
        </button>

      </div>
        <div className="grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <Card 
            key={service.title}
            onClick={() => handleActionClick(service.menuKey, service.link)}
            className={`group relative p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${service.bgColor} backdrop-blur-sm overflow-hidden animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex flex-col items-center text-center">
              <div className={`bg-gradient-to-r ${service.color} rounded-3xl p-4 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">{service.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{service.subtitle}</p>
            </div>
          </Card>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Mdash;

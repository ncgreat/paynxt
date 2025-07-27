import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { DealContext } from '../../DealContext';
import { Link } from 'react-router-dom';

import {
  Phone,
  ShoppingBasket,
  Pizza,
  Gift,
  CreditCard,
  Plane,
  ShieldCheck,
  Ticket,
  Utensils 
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

const Mdash = () => {
  const history = useHistory();
  const { setParentMenu } = useContext(DealContext);

  const actions = [
  {
    icon: Phone,
    bg: billsBg,
    label: "NxtBills",
    description: "Airtime, Data & Utility Payments",
    fromColor: "#1E3A8A", // blue-800
    toColor: "#10B981",   // green-500
    link: "/bills",
    menuKey: "bills",
  },
  {
    icon: ShoppingBasket,
    bg: groceriesBg,
    label: "Groceries",
    description: "Shop fresh groceries, fruits & household items",
    fromColor: "#9D174D", // pink-800
    toColor: "#F472B6",   // pink-400
    link: "/groceries",
    menuKey: "groceries",
  },
  {
    icon: Utensils,
    bg: foodBg,
    label: "NxtFood",
    description: "Order meals from your favourite vendors",
    fromColor: "#4C1D95", // purple-800
    toColor: "#A78BFA",   // purple-300
    link: "/foods",
    menuKey: "foods",
  },
  {
    icon: Gift,
    bg: giftcardBg,
    label: "Gift Cards",
    description: "Buy and send digital gift cards instantly",
  fromColor: "#134E4A", // teal-900
  toColor: "#A3E635",   // lime-300
    link: "/giftcards",
    menuKey: "giftcards",
  },
  // {
  //   icon: CreditCard,
  //   bg: virtualcardBg,
  //   label: "Virtual Card",
  //   description: "Create & manage virtual cards",
  //   fromColor: "#0F172A", // slate-900
  //   toColor: "#38BDF8",   // sky-400
  //   link: "/virtual-cards",
  //   menuKey: "virtualcards",
  // },
  // {
  //   icon: Plane,
  //   bg: travelBg,
  //   label: "Travel",
  //   description: "Search & book cheap flights",
  //   fromColor: "#7F1D1D", // red-900
  //   toColor: "#F87171",   // red-400
  //   link: "/travel",
  //   menuKey: "travel",
  // },
  // {
  //   icon: ShieldCheck,
  //   bg: insuranceBg,
  //   label: "Insurance",
  //   description: "Get health & asset coverage",
  //   fromColor: "#065F46", // emerald-900
  //   toColor: "#6EE7B7",   // emerald-300
  //   link: "/insurance",
  //   menuKey: "insurance",
  // },
  // {
  //   icon: Ticket,
  //   bg: ticketBg,
  //   label: "Event Tickets",
  //   description: "Book movies, events & transport",
  // fromColor: "#1E293B", // slate-800
  // toColor: "#FB923C",   // orange-400
  //   link: "/tickets",
  //   menuKey: "tickets",
  // },
];

  const handleActionClick = (menuKey, link) => {
    setParentMenu(menuKey);
    history.push(link);
  };

  return (
    <div className="items-center justify-center mb-4 lg:px-[6%]">
      <div className="px-4 bg-white rounded-lg lg:shadow-sm">
        <div className="sm:ml-14">
          <h4 className="mx-2 mt-3 mb-3 text-xl lg:block">
            What can we help you with?
          </h4>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleActionClick(action.menuKey, action.link)}
              >
                <Card
                  className="relative p-4 overflow-hidden group rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(to top, rgba(0,0,0,0.9), ${action.toColor}),
                      url(${action.bg})
                    `,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    color: 'white'
                  }}
                >
                  {/* Overlay & Blur */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm group-hover:backdrop-blur-md transition-all duration-500 rounded-2xl z-0" />

                  {/* Icon with subtle background */}
                  <div className="relative z-10 flex flex-col items-center space-y-3 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{action.label}</p>
                      <p className="text-xs text-white/80">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Mdash;

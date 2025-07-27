import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import { DealContext } from '../../DealContext';
import {  Button } from "../../components/ui/";
import { Receipt, ShoppingCart, ShoppingBag, CreditCard,  Wallet } from "lucide-react";

const Subheader = ({title, subtitle}) => {
  const history = useHistory();
  const { setViewMore, parentMenu } = useContext(DealContext);


    const handleBack = () => {
    if (parentMenu === 'bills') {
      history.push('/bills');
    } else if (parentMenu === 'foods') {
      history.push('/food');
    } else if (parentMenu === 'groceries') {
      history.push('/grocery');
    } else {
      history.goBack(); // fallback
    }
    setViewMore(false);
  };

  return (
     <div className="p-4 bg-[#f8f7f8] border border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <button 
          onClick={handleBack} 
          className="border border-gray-200 rounded-md shadow-md p-2"
        >
          <MdArrowBack />
        </button>
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mt-1 text-[#868686]">{title}</h3>
            <p className="text-emerald-500 text-sm">{subtitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <CreditCard className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default Subheader
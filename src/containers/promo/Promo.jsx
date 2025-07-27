import React from 'react';
import { Card } from "../../components/ui/card";
import {  Button } from "../../components/ui/";
import { ArrowRight, Gift } from "lucide-react";

const Promo = () => {
  return (
    <div className="relative px-6 pb-6">
      <Card className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
        <div className="relative">
          <div className="flex items-center space-x-2 mb-3">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Special Offer</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Save 20% on Groceries</h3>
          <p className="text-purple-100 text-sm mb-4">
            Get exclusive discounts on your favorite brands. Limited time offer!
          </p>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            Claim Now
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mb-8"></div>
      </Card>
    </div>
  );
};

export default Promo;

import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { DealContext } from '../../DealContext';
import loading from '../../assets/loadin.gif';

const Step3 = ({ onPrevious, setCompleteOnboarding, logOut }) => {
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);

  const [nin, setNin] = useState('');
  const [utility, setUtility] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
    };

  
    useEffect(() => {

    const encodedVendor = getCookie('lastVendor');

      if(!loggedVendor && !Array.isArray(loggedVendor)){
        if (encodedVendor) {

          try {
          const vendor = JSON.parse(atob(encodedVendor));
          // console.log(vendor);
          setLoggedVendor(vendor.vendorLogged);
          } catch (err) {
          console.log("Error decoding user cookie:", err);
          }
        }
      }
    
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
  
    const formData = new FormData();
    formData.append('nin', nin);
    formData.append('vendor_id', loggedVendor?.user?.id);
    if (utility) {
      formData.append('utility_bill', utility);
    }
  
    try {
      const response = await fetch(`${getBaseUrl()}/business_verification`, {
        method: 'POST',
        body: formData, // Don't set Content-Type manually for FormData
      });
  
      const data = await response.json();
      if(data.status === 'Successful'){
          setCompleteOnboarding(true);
      }

    } catch (error) {
      console.error("Submission error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verification Information</h2>
      <p className="text-gray-600 mb-6">
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          placeholder="NIN"
          className="w-full p-2 border rounded"
        />
       <div>
          <label className="block mb-1 font-medium">
            Utility Bill
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUtility(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
      </div>
     
      <div className="flex justify-between">
      <button
          type="button"
          onClick={()=>logOut()}
          className="underline text-gray-500 px-4 py-2 border-none rounded-md"
      >
          Sign out
      </button>
      <div className="flex justify-end gap-6">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {isProcessing ? <img src={loading} width={20}/> : "Finish"}
          </button>
        </div>
      </div> 
      </form>
    </div>
  );
};
export default Step3;
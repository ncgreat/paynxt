import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  arrow,
  shift,
} from "@floating-ui/react-dom";
import { ChevronsUpDown, ChevronDown, Check } from "lucide-react";
import { DealContext } from '../../DealContext';
import Swal from "sweetalert2";
import wait from '../../assets/loading.gif';
import loading from '../../assets/loadin.gif';

const Step2 = ({ onNext, onPrevious, logOut }) => {
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);
  const [selectedBank, setSelectedBank] = useState(null);
  const [banks, setBanks] = useState([]);
  const arrowRef = useRef(null);
  const [bankId, setBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountData, setAccountData]= useState([]);

  // Single `useFloating` instance for both dropdown and tooltip
  const { refs, floatingStyles, middlewareData } = useFloating({
    placement: "bottom-start", // Placement for dropdown (adjust dynamically for tooltip)
    middleware: [offset(5), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

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

  useEffect(() => {
    const get_account = async() => {
      // console.log(loggedVendor?.user?.id);
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('id', loggedVendor?.user?.id);
      try{
        const response = await fetch(`${getBaseUrl()}/get_business_account`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();

        console.log(data);
        setAccountData(data.data);

      }catch{

      }finally{
        setIsProcessing(false);
      }
    }
    if(loggedVendor?.user?.id){
      get_account();
    }
  
   }, [])

   useEffect(() => {
    if (accountData) {
      setSelectedBank(accountData.bank_name || "");
      setAccountNumber(accountData.account_number || "");
      setAccountName(accountData.account_name || "");
    }
  }, [accountData]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsProcessing(true);
    // if (Array.isArray(accountData) && accountData.length > 0 && accountData.account_name !== null || accountData.account_name !== '') {
    //   onNext();
    //   return;
    // }
    if (
      Array.isArray(accountData) &&
      accountData.length > 0 &&
      accountData.account_name !== null &&
      accountData.account_name !== ''
    ) {
      onNext();
      return;
    }
    
    try{
      const response = await fetch(`${getBaseUrl()}/business_account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vendor_id: loggedVendor?.user?.id,
          business_bank: selectedBank?.name, 
          business_account_number: accountNumber,
          business_account_name: accountName
        }),
      });

      const data = await response.json();
      onNext(); // Move to the next step

    }catch{

    }finally{
      setIsProcessing(false);
    }
  };
  const get_banks = async () => {
    try {
      setIsLoading(true); // Set loading to true when the process starts
      const response = await fetch(`${getBaseUrl()}/get_banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBanks(data.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // Set loading to false when the process ends
    }
  };

  const get_account = async () => {
    try {
      setIsLoading(true); // Set loading to true when the process starts
      const response = await fetch(`${getBaseUrl()}/get_account_name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            bank: selectedBank?.code,
            account_number: accountNumber,
        })
      });
      const data = await response.json();
      setAccountName(data.data.account_name);
      // console.log(data.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // Set loading to false when the process ends
    }
  };


  useEffect(() => {
    let banksFetched = false;
    if (banksFetched) return;
    get_banks();
    banksFetched = true;
  }, []);

   useEffect(() => {
    if(accountData.account_name !== null){
      // console.log(accountData);
      return;
    }else{
      console.log(accountData);
    }

      if (accountNumber.length === 10) {
        Swal.fire({
          title: 'Confirm Account Number',
          text: `Do you want to verify ${accountNumber}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, verify it',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (!selectedBank) {
            // setError('Please select a bank');
            Swal.fire({
              title: 'Bank',
              text: `Please select a bank`,
              icon: 'error',
            })
            return;
          }
          if (result.isConfirmed) {
            get_account(); // Call your function here
          }
        });
      }
    }, [accountNumber]); // Watch for changes to accountNumber

  return (
    <div>
      {isLoading && (
           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
             <div className="flex flex-col items-center">
             <img src={wait} alt="Loading..." className="h-16 w-16 mb-2 rounded-lg" />
             {/* <span className="text-white text-lg font-medium">Processing your request...</span> */}
             </div>
          </div>
        )}
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <p className="text-gray-600 mb-6">Your business bank information</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 border border-gray-400 p-8 rounded-xl"
      >
        <Listbox value={selectedBank} onChange={setSelectedBank}>
          <Listbox.Button
            ref={refs.setReference}
            required
            className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
          >
            {selectedBank?.name || selectedBank || "Choose Bank..."}
            <ChevronsUpDown className="h-5 w-5 text-gray-400" />
          </Listbox.Button>
          <Listbox.Options
            ref={refs.setFloating}
            style={floatingStyles}
            className="w-[72%] md:w-[48.7%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"
          >
            {banks.map((bank) => (
              <Listbox.Option
                key={bank.id}
                value={bank}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
              >
                {bank.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>

        <input
          type="number"
          required
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
          }}
          placeholder="Account Number"
          className="w-full p-2 border rounded"
        />

        {accountName && (
            <div>
                <input
                    required
                    value={accountName}
                    className="w-full p-2 border rounded"
                    readOnly
                />
            </div>
        )}
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
            {isProcessing ? <img src={loading} width={20}/> : "Next"}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};
export default Step2;
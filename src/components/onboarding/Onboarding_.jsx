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
import Swal from "sweetalert2";
import toast from 'react-hot-toast';
import wait from '../../assets/loading.gif';
import loading from '../../assets/loadin.gif';
import { DealContext } from '../../DealContext';



const Onboarding = () => {
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useHistory();
  const [completeOnboarding, setCompleteOnboarding] = useState(false);
  const [complete, setComplete] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const logOut = () => {
    alert('logOut');
  }


  // let vendor = loggedVendor;

  const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

	
	  useEffect(() => {

		const encodedVendor = getCookie('lastVendor');

      if(loggedVendor && !Array.isArray(loggedVendor)){
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
    if(complete){
      navigate.push("/food-vendor");
    }
},[complete])

useEffect(() => {
    if (completeOnboarding) {
      toast.success('Onboarding complete! Redirecting...');
  
      const timer = setTimeout(() => {
        navigate.push("/food-vendor");
      }, 2500);
  
      return () => clearTimeout(timer);
    }
  }, [completeOnboarding]);

  const Step1 = ({ onNext, onPrevious, logOut, setComplete }) => {
    const [address, setAddress] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState(null);
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [instagram, setInstagram] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [profileData, setProfileData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getBaseUrl = () => {
      return `${import.meta.env.VITE_API_BASE_URL}/api`;
     };

     useEffect(() => {
      const get_profile = async() => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('id', loggedVendor?.user?.id);
        try{
          const response = await fetch(`${getBaseUrl()}/get_business_profile`, {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();

          console.log(data);
          if (data?.data?.onboard_complete === 1) {
            setComplete(true);
          } else if (data?.data) {
            setProfileData(data.data);
          }

  
        }catch{
  
        }finally{
          setIsProcessing(false);
        }
      }
      if(loggedVendor?.user?.id){
        get_profile();
      }
    
     }, [])

     useEffect(() => {
      if (profileData) {
        setAddress(profileData.address || "");
        setContactPhone(profileData.phone || "");
        setWebsite(profileData.website || "");
        setFacebook(profileData.facebook || "");
        setInstagram(profileData.instagram || "");
        setTwitter(profileData.twitter || "");
      }
    }, [profileData]);
     
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      setIsProcessing(true);

      if(profileData){
        onNext();
        return;
      }

      const formData = new FormData();
      formData.append('vendor_id', loggedVendor?.user?.id);
      formData.append('vendor_name', loggedVendor?.user?.business_name);
      formData.append('address', address);
      formData.append('phone', contactPhone);
      formData.append('website', website);
      formData.append('facebook', facebook);
      formData.append('instagram', instagram);
      formData.append('twitter', twitter);
      if (logo) {
        formData.append('logo_url', logo);
      }
      try{
        const response = await fetch(`${getBaseUrl()}/business_profile`, {
					method: 'POST',
          body: formData, // Don't set Content-Type manually for FormData
				});

        const data = await response.json();
        onNext(); // Move to the next step

      }catch{

      }finally{
        setIsProcessing(false);
      }
    };
    
    // if (isLoading) {
    //   return <div>Loading...</div>; // or a spinner
    // }

    if (isProcessing) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <img src={wait} alt="Loading..." />
        </div>
      );
    }

    return (
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
        <p className="text-gray-600 mb-6">
          Add your business information and contact details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 border border-gray-400 p-8 rounded-xl"
        >
          <input
            type="text"
              required
            value={loggedVendor?.user?.business_name}
            placeholder="Business Name"
            className="w-full p-2 border rounded"
            readOnly
          />

          <input
            type="text"
              required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Business Address"
            className="w-full p-2 border rounded"
          />

          <input
            type="tel"
              required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Business Phone"
            className="w-full p-2 border rounded"
          />

          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Business Website (optional)"
            className="w-full p-2 border rounded"
          />

          <div>
            <label className="block mb-1 font-medium">
              Business Logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="block mb-1 font-medium">
              Social Media (optional)
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Facebook Handle (URL)"
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter Handle (URL)"
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram Handle (URL)"
                className="w-full p-2 border rounded"
              />
            </div>
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
              {isProcessing ? <img src={loading} width={20}/> : "Next"}
            </button>
          </div>
        </div> 

        </form>
      </div>
    );
  };

  const Step3 = ({ onPrevious, setCompleteOnboarding, logOut }) => {

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

  const steps = [
    { component: (props) => <Step1 {...props} logOut={logOut} setComplete={setComplete} /> },
    { component: (props) => <Step2 {...props} logOut={logOut}  /> },
    { component: (props) => <Step3 {...props} setCompleteOnboarding={setCompleteOnboarding} logOut={logOut} /> }
  ];

  const StepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate("/food-vendor"); // Redirect to the dashboard
  };

  return (
    <>
      
      <div className="p-6 max-w-4xl mx-auto mt-6  rounded-lg">
      <h1 className="text-3xl text-gray-800 mb-6">
        {currentStep === steps.length - 1
          ? "Setup Complete 🎉"
          : "Hey there, set up your account!"}
      </h1>

      <div className="space-y-8">
        <StepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            setCompleteOnboarding={setCompleteOnboarding}
            logOut={()=>logOut()}
            setComplete={setComplete}
        />
      </div>

      {completeOnboarding && currentStep === steps.length - 1 && (
        <div className="mt-6 text-green-700 text-lg">
            🎉 Onboarding complete! Redirecting to your dashboard...
        </div>
        )}
    </div>
   </>
  );
};

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

        // console.log(data);
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
    if(accountData){
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
    if(accountData){
      return;
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

export default Onboarding;

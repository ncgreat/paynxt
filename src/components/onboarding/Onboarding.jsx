import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import toast from 'react-hot-toast';
import wait from '../../assets/loading.gif';
import loading from '../../assets/loadin.gif';
import { DealContext } from '../../DealContext';
import Step1 from "../vendor/Step1";
import Step3 from "../vendor/Step3";
import Step2 from "../vendor/Step2";




const Onboarding = () => {
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useHistory();
  const [completeOnboarding, setCompleteOnboarding] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  const history = useHistory();

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
   };

  const logOut = () => {
    alert('logOut');
  }

  const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

	useEffect(() => {
    const encodedVendor = getCookie('lastVendor');
    if(!encodedVendor){
      history.push('/'); // Redirect to login
    }

  }, [])

	  useEffect(() => {

		const encodedVendor = getCookie('lastVendor');

      if(loggedVendor && !Array.isArray(loggedVendor)){
        if (encodedVendor) {

          try {
          const vendor = JSON.parse(atob(encodedVendor));
          setLoggedVendor(vendor.vendorLogged);
          } catch (err) {
          console.log("Error decoding user cookie:", err);
          }
        }
      }
		
	  }, []);


// Fetch profile and check onboarding status
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("id", loggedVendor?.user?.id);

      const response = await fetch(`${getBaseUrl()}/get_business_profile`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const onboarded = data?.data?.onboard_complete === 1;
      // console.log(data);
      if (onboarded) {
        navigate.push("/food-vendor");
      } else {
        setProfileData(data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false); // Done checking
    }
  };

  if (loggedVendor?.user?.id) {
    fetchProfile();
  }
}, [loggedVendor]);

useEffect(() => {
    if (completeOnboarding) {
      toast.success('Onboarding complete! Redirecting...');
  
      const timer = setTimeout(() => {
        navigate.push("/food-vendor");
      }, 2500);
  
      return () => clearTimeout(timer);
    }
  }, [completeOnboarding]);


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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={wait} width={100} alt="Loading..." />
      </div>
    );
  }

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



export default Onboarding;

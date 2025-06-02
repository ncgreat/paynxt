import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";  
import { DealContext } from '../../DealContext';
import wait from '../../assets/loading.gif';
import loading from '../../assets/loadin.gif';
  
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
    const { loggedVendor, setLoggedVendor } = useContext(DealContext);

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

        //   console.log(data);
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

      console.log(profileData);
      setIsProcessing(true);

      if(profileData?.address || profileData?.phone){
        console.log(profileData?.address);
        console.log(profileData?.phone);
        onNext();
        return;
      }

      console.log('hi');

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
      console.log(formData);
      try{
        const response = await fetch(`${getBaseUrl()}/business_profile`, {
          method: 'POST',
          body: formData, // Don't set Content-Type manually for FormData
        });

        const data = await response.json();
        console.log(data);
        onNext(); // Move to the next step

      }catch{

      }finally{
        setIsProcessing(false);
      }
    };
    
  // if (isProcessing) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <img src={wait} width={100} alt="Loading..." />
  //     </div>
  //   );
  // }


    return (
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
        <p className="text-gray-600 mb-6">
          Add your business information and contact details.
        </p>

        <form
          onSubmit={handleSubmit1}
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
  export default Step1;

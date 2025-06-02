import React, { useState, useEffect, useRef, useContext } from "react";
import { DealContext } from '../../DealContext';
import loadingGif from '../../assets/loading.gif'; // fixed typo
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

const Step1 = ({ onNext, onPrevious, logOut, setComplete }) => {
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState(null);
  const arrowRef = useRef(null);
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const { loggedVendor } = useContext(DealContext);
  const [selectedCategory, setSelectedCategory] = useState('');

  const getBaseUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api`;

    // Single `useFloating` instance for both dropdown and tooltip
    const { refs, floatingStyles, middlewareData } = useFloating({
      placement: "bottom-start", // Placement for dropdown (adjust dynamically for tooltip)
      middleware: [offset(5), flip(), shift(), arrow({ element: arrowRef })],
      whileElementsMounted: autoUpdate,
    });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('id', loggedVendor?.user?.id);

      try {
        const response = await fetch(`${getBaseUrl()}/get_business_profile`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data?.data) {
          if (data.data.onboard_complete === 1) {
            setComplete(true);
          } else {
            setProfileData(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (loggedVendor?.user?.id) {
      fetchProfile();
    }
  }, [loggedVendor?.user?.id]);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if(profileData?.address || profileData?.phone){
      console.log(profileData?.address);
      console.log(profileData?.phone);
      onNext();
      return;
    }

    const formData = new FormData();
    formData.append('vendor_id', loggedVendor?.user?.id);
    formData.append('vendor_name', loggedVendor?.user?.business_name);
    formData.append('business_category', selectedCategory);
    formData.append('address', address);
    formData.append('phone', contactPhone);
    formData.append('website', website);
    formData.append('facebook', facebook);
    formData.append('instagram', instagram);
    formData.append('twitter', twitter);
    if (logo) {
      formData.append('logo_url', logo);
    }

    try {
      const response = await fetch(`${getBaseUrl()}/business_profile`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Profile submitted:", data);
      onNext();
    } catch (error) {
      console.error("Error submitting profile:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
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
          value={loggedVendor?.user?.business_name || ""}
          placeholder="Business Name"
          className="w-full p-2 border rounded"
          readOnly
        />

             <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                  <Listbox.Button
                    ref={refs.setReference}
                    required
                    className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
                  >
                    {selectedCategory || "Choose Business Category..."}
                    <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="w-[72%] md:w-[48.7%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"
                  >
                      <Listbox.Option
                        value='Food'
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
                      >
                        Food
                      </Listbox.Option>
                      <Listbox.Option
                        value='Groceries'
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
                      >
                        Groceries
                      </Listbox.Option>
                  </Listbox.Options>
                </Listbox>

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
            onClick={logOut}
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
              disabled={isProcessing}
              className={`bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center ${
                isProcessing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <img src={loadingGif} width={20} alt="loading..." />
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step1;

import { useState, useEffect, useContext } from "react";
import { DealContext } from "../DealContext";

const CompanySettings = () => {
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (loggedVendor) {
      setBusinessName(loggedVendor.user.business_name || "");
      setAddress(loggedVendor.user.address || "");
      setPhone(loggedVendor.user.phone || "");
      setEmail(loggedVendor.user.email || "");
    }
  }, [loggedVendor]);

  const handleUpdate = () => {
    // Example payload to send to the API
    const updatedInfo = {
      business_name: businessName,
      address,
      phone,
      email,
    };

    // Simulate update call
    console.log("Updated vendor info:", updatedInfo);

    // Optionally update context
    setLoggedVendor({
      ...loggedVendor,
      user: {
        ...loggedVendor.user,
        ...updatedInfo,
      }
    });

    alert("Settings updated successfully!");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-gray-800 mb-6">Vendor Settings</h2>
      <p className="text-gray-600 mb-4">Manage company details and preferences.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Vendor Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default CompanySettings;

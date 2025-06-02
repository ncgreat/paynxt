import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useContext } from 'react';
import { FiLock, FiUser, FiBriefcase, FiChevronRight } from "react-icons/fi";
import { Listbox, Transition  } from "@headlessui/react";
import { useFloating, autoUpdate, offset, flip, arrow, shift } from "@floating-ui/react-dom";
import { ChevronsUpDown, ChevronDown, Check } from "lucide-react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isProfileSettings, setIsProfileSettings] = useState(false);
    const [isUpdateKYC, setIsUpdateKYC] = useState(false);
    const [isNextKin, setIsNextKin] = useState(false);
	const [isResetTransactionPin, setIsResetTransactionPin] = useState(false);
    const [isPinVisible, setIsPinVisible] = useState(true);
	const [isPassVisible, setIsPassVisible] = useState(true);
    const [isKYCVisible, setIsKYCVisible] = useState(true);
    const [isProfileVisible, setIsProfileVisible] = useState(true);
    const [isNOKVisible, setIsNOKVisible] = useState(true);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [otp, setOtp] = useState("");
	const [newPin, setNewPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
    const arrowRef = useRef(null);

    	  // Single `useFloating` instance for both dropdown and tooltip
	  const { refs, floatingStyles, middlewareData } = useFloating({
        placement: "bottom", // Placement for dropdown (adjust dynamically for tooltip)
        middleware: [offset(9), flip(), shift(), arrow({ element: arrowRef })],
        whileElementsMounted: autoUpdate,
    });

      // Handle OTP Verification
	const handleOtpVerification = (e) => {
        e.preventDefault();
        // Logic to verify the OTP
        if (otp === "123456") {
          setIsOtpVerified(true); // Mock verification success
        } else {
          alert("Invalid OTP. Please try again.");
        }
      };
      
      // Handle PIN Modification
      const handlePinModification = async(e) => {
        e.preventDefault();
        if (newPin !== confirmPin) {
            Swal.fire({
                title: 'Error',
                text: 'PIN do not match. Please try again.',
                icon: 'error',
                customClass: {
                    container: 'borderless',
                },
            });
          return;
        }
        if (newPin.length !== 4) {
            Swal.fire({
                title: 'Error',
                text: 'PIN must be 4 digits.',
                icon: 'error',
                customClass: {
                    container: 'borderless',
                },
            });
          return;
        }
        const response = await fetch(`${getBaseUrl()}/set-pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pin: newPin,
                user_id: user.id
            }),
        });
        const data = await response.json();
    
        if (data.status === 'successful') {
            const account = JSON.parse(localStorage.getItem('account'));
            account.transaction_pin = 'true';
            localStorage.setItem('account', JSON.stringify(account));
            // setIsTransactionPin(true);
            setIsModalOpen(false);
            Swal.fire({
                title: 'PIN Update',
                text: 'Your PIN was set successfully',
                icon: 'success',
                customClass: {
                    container: 'borderless',
                },
            });
        }
      };
      
    return (
        <div className='p-5 items-center justify-center pt-2'>
            <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 1 },
            }}
            className="w-full text-[#ddd] "
            >
                
            {/* <span className="font-bold text-[#042326]">Settings</span> */}
            </motion.div>
            <div className="pt-2">
            {/* Settings Tabs */}
            <div className="settings-tabs">
                <div className="tabs flex mb-4 border-b border-[#ccc]">
                <div className='flex items-center'>
                    <FiUser className='ml-2'/>
                <button
                    className={`tab-button -ml-4 ${activeTab === "account" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("account"); 
                        setIsResetPassword(false);
                        setIsResetTransactionPin(false);
                        setIsPassVisible(true);
                        setIsProfileVisible(true);
                        setIsProfileSettings(false);
                        setIsUpdateKYC(false);
                        setIsPinVisible(true);
                        setIsKYCVisible(true);
                        setIsNOKVisible(true);
                        setIsNextKin(false);
                    }}
                >
                    Account
                </button>
                </div>
                <div className='flex items-center'>
                    <FiLock className='ml-2'/>
                    <button
                        className={`tab-button -ml-3 ${activeTab === "security" ? "active" : ""}`}
                        onClick={() => setActiveTab("security")}
                    >
                        Security
                    </button>
                </div>
                <div className='flex items-center'>
                    <FiBriefcase className='ml-2'/>
                    <button
                        className={`tab-button -ml-3 ${activeTab === "wallet" ? "active" : ""}`}
                        onClick={() => setActiveTab("wallet")}
                    >
                        Wallet
                    </button>
                </div>
                
                </div>
                
                {/* Tab Content */}
                <div className="tab-content">
                {/* Account Tab Content */}
                {activeTab === "account" && (
                    <div>
                    {isProfileSettings ? (
                    <div>
                    <h2 className="text-lg  mb-4">Account Settings</h2>
                    <form>
                        <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        </div>
                        
                        <div className="mb-4">
                        <label htmlFor="profile-pic" className="block text-sm font-medium">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profile-pic"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        </div>
                        <button
                        type="button"
                        className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
                        >
                        Save Changes
                        </button>
                        <button
                            onClick={() => {setIsProfileSettings(false); setIsNOKVisible(true)}}
                            type="button"
                            className="ml-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        >
                         Cancel
                        </button>
                    </form>
                    </div>
                ):(
                    <button
                    onClick={() => {setIsProfileSettings(true); setIsKYCVisible(false); setIsNOKVisible(false);}} // Add logic for disabling 2FA
                    className="bg-[#230d29] text-white px-4 py-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isProfileVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                         Profile Settings
                          <FiChevronRight />
                    </button>
                )}     

                {isNextKin ? (
                    <div>
                    <h2 className="text-lg  mb-4">Next of Kin</h2>
                    <form>
                        <div className="mb-4">
                        {/* <label htmlFor="name" className="block text-sm font-medium">
                            Next of kin
                        </label> */}
                        <input
                            type="text"
                            id="name"
                            placeholder="Next of kin"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        </div>

                        <div className="mb-4">
                        {/* <label htmlFor="name" className="block text-sm font-medium">
                            Relationship
                        </label> */}
                        {/* <input
                            type="text"
                            id="relationship"
                            placeholder="Relationship"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        /> */}

                        <Listbox
												// value={accountOptionSelected}
												onChange={(selected) => {
													setAccountOptionSelected(selected);
													setPhoneNumber("");
												}}
											>
												<Listbox.Button
													ref={refs.setReference}
													className="block my-2 w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
												>
													{/* {accountOptionSelected === 'phone' ? "Phone Number" : accountOptionSelected === 'account' ? "Relations" : "Select account type..."} */}
                                                    Relationship
													<ChevronsUpDown className="h-5 w-5 text-gray-400" />
												</Listbox.Button>
												<Listbox.Options
													ref={refs.setFloating}
													style={floatingStyles}
													// className="w-full bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[160px] overflow-auto text-[14px]"
                                                    className="w-[82%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"

												>
													<Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Father</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Mother</Listbox.Option>
                                                    <Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Brother</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Sister</Listbox.Option>
                                                    <Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Husband</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Wife</Listbox.Option>
                                                    <Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Uncle</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Aunty</Listbox.Option> 
													<Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Cousin</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Niece</Listbox.Option>
                                                    <Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Nephew</Listbox.Option>
													<Listbox.Option value="account" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Son</Listbox.Option>
                                                    <Listbox.Option value="phone" className="cursor-pointer px-3 py-2 hover:bg-gray-100">Daughter</Listbox.Option>

												</Listbox.Options>
											</Listbox>
                        </div>

                        <div className="mb-4">
                        {/* <label htmlFor="name" className="block text-sm font-medium">
                            Email Address
                        </label> */}
                        <input
                            type="email"
                            id="email"
                            placeholder=" Email Address"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        </div>
                        
                        <div className="mb-4">
                        {/* <label htmlFor="name" className="block text-sm font-medium">
                            Phone Number
                        </label> */}
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone Number"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        </div>

                        <button
                        type="button"
                        className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
                        >
                        Update Next of Kin
                        </button>
                        <button
							onClick={() => {setIsNextKin(false); setIsProfileVisible(true)}}
							type="button"
							className="ml-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
						>
							Cancel
						</button>
                    </form>
                    </div>
                ):(
                    <button
                    onClick={() => {setIsNextKin(true);  setIsKYCVisible(false); setIsProfileVisible(false);}} // Add logic for disabling 2FA
                    className="bg-[#230d29] text-white px-4 py-2 my-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isNOKVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                         Next of Kin
                          <FiChevronRight />
                    </button>
                )}    
                    </div>
                )}

                {/* Security Tab Content */}
                {activeTab === "security" && (
                    <div>
                    {/* <h2 className="text-lg mb-4">Security Settings</h2> */}

                    <div className="">
                        {/* <h3 className="font-medium mb-2">Two-Factor Authentication</h3> */}
                        {isResetPassword ? (
                            <div>
                                <form>
                                    <div className="mb-4">
                                    <label htmlFor="current-password" className="block text-sm font-medium">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="current-password"
                                        placeholder="Enter your current password"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                    </div>
                                    <div className="mb-4">
                                    <label htmlFor="new-password" className="block text-sm font-medium">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        placeholder="Enter a new password"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                    </div>
                                    <div className="mb-4">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        placeholder="Confirm your new password"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                    </div>
                                    <button
                                    type="button"
                                    className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
                                    >
                                    Update Password
                                    </button>
                                    <button
                                        onClick={() => {setIsResetPassword(false); setIsPinVisible(true)}}
                                        type="button"
                                        className="ml-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => {setIsResetPassword(true), setIsPinVisible(false)}} // Add logic for disabling 2FA
                                    className="bg-[#230d29] text-white px-4 py-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                                    style={{
                                        display: isPassVisible ? "flex" : "none",
                                        appearance: "textfield", // Removes spinner in some browsers
                                    }}
                                >
                                    Reset Password
                                     <FiChevronRight />
                                </button>
                            </div>
                        )}

                        

                        {isResetTransactionPin ? (
                            <div>
                                {/* OTP Verification */}
                                {!isOtpVerified ? (
                                    <form onSubmit={handleOtpVerification}>
                                    <div className="mb-4">
                                        <label htmlFor="otp" className="block text-sm font-medium">
                                        Enter 6-Digit OTP Sent to Your Email
                                        </label>
                                        <input
                                        type="text"
                                        id="otp"
                                        maxLength="6"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
                                    >
                                        Verify OTP
                                    </button>
                                    <button
                                        onClick={() => {setIsOtpVerified(false); setIsResetTransactionPin(false); setIsPassVisible(true); setIsPinVisible(true);}}
                                        type="button"
                                        className="ml-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    </form>
                                ) : (
                                    // Transaction PIN Modification Form
                                    <form onSubmit={handlePinModification}>
                                    <div className="mb-4">
                                        <label htmlFor="new-pin" className="block text-sm font-medium">
                                        New Transaction PIN
                                        </label>
                                        <input
                                        type="password"
                                        id="new-pin"
                                        maxLength="4"
                                        placeholder="Enter New 4-Digit PIN"
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirm-pin" className="block text-sm font-medium">
                                        Confirm New PIN
                                        </label>
                                        <input
                                        type="password"
                                        id="confirm-pin"
                                        maxLength="4"
                                        placeholder="Confirm Your New 4-Digit PIN"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
                                    >
                                        Update PIN
                                    </button>
                                    <button
                                        onClick={() => { setIsOtpVerified(false); setIsResetTransactionPin(false); setIsPassVisible(true); setIsPinVisible(true);}}
                                        type="button"
                                        className="ml-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => {setIsResetTransactionPin(true), setIsPassVisible(false)}} // Add logic for disabling 2FA
                                    className="bg-[#230d29] text-white px-4 py-2 rounded-md mt-2 hover:bg-[#206657] w-full text-left items-center justify-between"
                                    style={{
                                        display: isPinVisible ? "flex" : "none",
                                        appearance: "textfield", // Removes spinner in some browsers
                                    }}
                                >
                                    Reset Transaction Pin
                                     <FiChevronRight />
                                </button>
                            </div>
                        )}

                    </div>
                    
                    </div>
                )}

                {activeTab === "wallet" && (
                    <div>
                        <div className="flex mt-4 ">
                                <label>
                                    Show Wallet Balance
                                </label>
                                <label className="toggle mb-4 ml-3">
									<input type="checkbox" />
									<span className="slider"></span>
									<span className="labels"></span>
								</label>
                        </div>
                    </div>
                )}

                </div>
            </div>

           
            </div>
        </div>        	                    
        )
    }

    export default Settings              
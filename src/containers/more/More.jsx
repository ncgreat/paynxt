import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import { FiChevronRight  } from "react-icons/fi";
import { DealContext } from '../../DealContext';

const More = ({user}) => {
    const [activeTab, setActiveTab] = useState('account');
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isProfileSettings, setIsProfileSettings] = useState(false);
    const [isUpdateKYC, setIsUpdateKYC] = useState(false);
    const [isNextKin, setIsNextKin] = useState(false);
	const [isResetTransactionPin, setIsResetTransactionPin] = useState(false);
    const [isPinVisible, setIsPinVisible] = useState(true);
	const [isPassVisible, setIsPassVisible] = useState(true);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [otp, setOtp] = useState("");
	const [newPin, setNewPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        {
          from: 'bot',
          text: `<strong>Hi, ${user?.user.name}!</strong><br />How can I assist you today?`,
        },
      ]);

      const [isTyping, setIsTyping] = useState(false);
      
    // Inside your component:
    const chatRef = useRef(null);

    const navigate = useHistory();
	const { resetUser, setIsSettings, setIsMenuOpen, loggedUser  } = useContext(DealContext);

    // console.log(loggedUser.user.name);
    // console.log(user.user.email);

    // let user = loggedUser?.user.name;

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

      // Scroll to bottom on new message
        useEffect(() => {
            if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }, [messages]);

      const handleSubmit1 = async () => {
        const response = await fetch('https://n8n-1sk1.onrender.com/webhook/run-ai-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
    
        const result = await response.json();
        console.log(result); // Optional: handle UI feedback
      };

      const handleSubmit2 = async () => {
        if (!query.trim()) return;
    
        // Add user message to chat
        const newMessages = [...messages, { from: 'user', text: query }];
        setMessages(newMessages);
        setQuery('');

         // Wait 5 seconds, then show "typing..." message
        setTimeout(() => {
            setIsTyping(true);
            setMessages(prev => [...prev, { from: 'bot', text: 'Typing...' }]);
        }, 3500);
    
        try {
          const response = await fetch('https://n8n-1sk1.onrender.com/webhook/run-ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
    
          const result = await response.json();

          let botReply = '';

        if (result[0].body) {
            const personalizedBody = result[0].body
              .replace("[Customer's Name]", user?.user.name)
              .replace("Dear Customer", `Dear ${user?.user.name}`)
              .replace("Dear Valued Customer", `Dear ${user?.user.name}`)
              .replace("for most banks", '')
              .replace(
                'Best regards, Kelly, Customer Support PayNxt',
                'Best regards,<br/><strong>Kelly</strong>,<br/>Customer Support PayNxt'
              )
              .replace(/\n/g, '<br/>'); // Converts all line breaks to <br />
          
            botReply = personalizedBody;
          } else {
            botReply = result.reply || 'Thanks for your query! Our support team will reach out shortly.';
          }
          
          setMessages([...newMessages, { from: 'bot', text: botReply }]);

        } catch (err) {
          setMessages([...newMessages, { from: 'bot', text: 'There was an error. Please try again later.' }]);
        }
      };

      const handleSubmit = async () => {
        if (!query.trim()) return;
      
        const newMessages = [...messages, { from: 'user', text: query }];
        setMessages(newMessages);
        setQuery('');
      
        setTimeout(() => {
          setIsTyping(true);
          setMessages(prev => [...prev, { from: 'bot', text: 'Typing...' }]);
        }, 1500);
      
        // Retry wrapper
        const retryFetch = async (retries = 4, delay = 2000) => {
          try {
            // https://n8n-1sk1.onrender.com/webhook-test/run-ai-agent
            
            const response = await fetch('https://n8n-1sk1.onrender.com/webhook/run-ai-agent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, user_id:user?.user.id, email: user?.user.email }),
            });
      
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
          } catch (err) {
            if (retries > 0) {
              await new Promise(res => setTimeout(res, delay)); // wait before retry
              return retryFetch(retries - 1, delay);
            } else {
              throw err;
            }
          }
        };
      
        try {
          const result = await retryFetch(); // try with retry logic
      
          let botReply = '';
      
          if (result[0].body) {
            const personalizedBody = result[0].body
              .replace("[Customer's Name]", user?.user.name)
              .replace("[Customer Name]", user?.user.name)
              .replace("Dear Customer", `Dear ${user?.user.name}`)
              .replace(" for most banks", '')
              .replace(
                'Kelly, Customer Support PayNxt',
                '<strong>Kelly</strong>,\nCustomer Support \nPayNxt'
              )
              .replace(/\n/g, '<br/>');
      
            botReply = personalizedBody;
          } else {
            botReply = result.reply || 'Thanks for your query! Our support team will reach out shortly.';
          }
      
          setMessages([...newMessages, { from: 'bot', text: botReply }]);
        } catch (err) {
          setMessages([...newMessages, { from: 'bot', text: 'We are currently experiencing high volume of request. <br/>Please try again in two minutes! <br/>Regards, <br/><strong>Kelly</strong> <br/> Customer Support<br/> PayNxt' }]);
        } finally {
          setIsTyping(false);
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
            setIsTransactionPin(true);
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

      const logOut = () => {
		document.cookie = `lastUser=; path=/; max-age=0`;
		localStorage.clear();
		resetUser();
		navigate.push('/');
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
                
            {/* <span className="font-bold text-[#042326]">Extras</span> */}
            </motion.div>
            <div className="pt-2">

                <div className="tab-content">
                    <div>
                    {isProfileSettings ? (
                <div className="max-w-xl mx-auto p-4 border rounded-lg bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Chat Support</h2>
              
                <div 
                    ref={chatRef}
                    className="h-96 overflow-y-auto mb-4 p-2 border rounded bg-gray-50"
                >
                
                  {messages.map((msg, idx) => {
                    const isUser = msg.from === 'user';
                    const contentProps = isUser
                        ? { children: msg.text }
                        : { dangerouslySetInnerHTML: { __html: msg.text } };

                    return (
                        <div
                        key={idx}
                        className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                            isUser ? 'bg-[#206657] text-white' : 'bg-gray-200 text-gray-900'
                            }`}
                            {...contentProps}
                        />
                        </div>
                    );
                    })}
                </div>
              
                <div className="flex gap-2">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your message..."
                    rows={2}
                    className="flex-grow border rounded-lg p-2 resize-none"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-[#206657] hover:bg-[#230d29] text-white px-4 py-2 rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
              
                ):(
                    <button
                    onClick={() => {setIsProfileSettings(true);setIsPassVisible(false); }} // Add logic for disabling 2FA
                    className="bg-[#230d29] text-white px-4 py-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isPassVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                        Get Help
                        <FiChevronRight />
                    </button>
                )}  

                       {isUpdateKYC ? (
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
                    </form>
                    </div>
                ):(
                    <button
                    // onClick={() => {setIsUpdateKYC(true)}} // Add logic for disabling 2FA
                    className="bg-[#230d29] text-white px-4 py-2 my-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isPassVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                         Refer & Earn [ 50 Points per referral ]
                         <FiChevronRight />
                    </button>
                )}   

                {isNextKin ? (
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
                    </form>
                    </div>
                ):(
                    <button
                    // onClick={() => {setIsNextKin(true)}} // Add logic for disabling 2FA
                    className="bg-[#230d29] text-white px-4 py-2 my-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isPassVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                         Contact Us
                         <FiChevronRight />
                    </button>
                )}    

                   <button
                    onClick={() => {logOut()}}
                    className="bg-[#230d29] text-white px-4 py-2 my-2 rounded-md hover:bg-[#206657] w-full text-left items-center justify-between"
                    style={{
                        display: isPassVisible ? "flex" : "none",
                        appearance: "textfield", // Removes spinner in some browsers
                    }}
                     >
                         Logout
                         <FiChevronRight />
                    </button>
                    </div>
                

                </div>
            {/* </div> */}

           
            </div>
        </div>        	                    
        )
    }

    export default More              
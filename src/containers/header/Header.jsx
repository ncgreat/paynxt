import React, { useEffect, useRef } from "react";
import { BsArrowRightShort } from 'react-icons/bs';
import { FaGift } from 'react-icons/fa';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import Typed from "typed.js";
import './header.css';
import { motion, useInView } from 'framer-motion';
import smile from '../../assets/paynxt-mobile.png';

const Header = () => {
  const typedElement = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

useEffect(() => {
  let typed;
  if (isInView && typedElement.current) {
    typed = new Typed(typedElement.current, {
    //   strings: [
    //     "pay bills",
    //     "order meals",
    //     "order groceries",
	// 	"purchase gift cards",
    //   ],

	  strings:[
		"Order Essentials", 
		"Pay Seamlessly",
		"Get Rewarded",
		"Stay Organized",
		"Save More"
	  ],
      typeSpeed: 100,
      backSpeed: 60,
      backDelay: 1000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }
  return () => {
    if (typed) typed.destroy();
  };
}, [isInView]);


  return (
    <div className="super__header">
      <div className="super__header-content relative z-10">
        <div className='z-20 mb-40'>
          {/* Typing Effect */}
<motion.div
  ref={containerRef}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="min-h-[60px] flex justify-center items-center mt-6"
>
  {/* <h3 className="text-4xl ">
	We help you&nbsp;
    <span className="text-green-600" ref={typedElement}></span>
  </h3>
  <h3 className="text-4xl ">with ease and convenience</h3> */}
  <div className="text-center">
  <h2 className="text-3xl font-medium text-gray-700 mb-1">
   Start Today and
  </h2>
  <h2 className="text-4xl font-bold text-green-600 mb-1">
    <span className="tracking-wide" ref={typedElement}></span>
  </h2>
  <h3 className="text-lg text-gray-500">
    With Ease and Convenience
  </h3>
</div>

</motion.div>

          <motion.h3
            className="text-lg lg:text-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* You can include a supportive subtitle here */}
          </motion.h3>

          {/* Email Input + CTA */}
          <div className='flex mt-4 justify-center'>
            {/* <motion.input
              type="email"
              placeholder="Your email address"
              className="w-[80%] lg:w-[60%] px-4 py-2 text-sm rounded-l-md text-gray-500 bg-transparent border border-gray-300 dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0EADBF] focus:border-transparent"
              aria-label="Email address"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            /> */}
            <motion.button
              className="bg-[#0EADBF] hover:bg-[#08675C] text-white px-6 py-2 rounded-full text-xs md:text-base flex items-center transition-all duration-300"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
				<span className="px-6">
					   Get Started
				</span>
           
              <BsArrowRightShort className=" text-lg animate-pulse" />
            </motion.button>
          </div>
        </div>

        {/* Circle Background and Cards */}
        <div className='hidden mt-6 h-[250px] relative overflow-hidden lg:flex'>
          {/* Circle Line (visual only) */}
          <div className='absolute top-96 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[760px] w-full px-5 border-2 border-gray-500 rounded-full z-0'></div>
          <div className='absolute top-[370px] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[745px] w-full px-5 border-2 border-gray-500 rounded-full z-0'></div>

          {/* Info Card 1 */}
          <motion.div
            className="bg-white p-2 rounded-xl shadow-lg w-64 h-[210px] flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105 z-10"
            whileHover={{ y: -10 }}
          >
            <HiOutlineLightningBolt className="text-3xl text-[#0EADBF] mb-2 group-hover:drop-shadow-[0_0_8px_rgba(14,173,191,0.6)] transition" />
            <h3 className="font-semibold text-gray-800">Smart Services</h3>
            <p className="text-sm text-gray-500 mt-1">
              Settle your utility bills, order food and groceries.
            </p>
          </motion.div>

          {/* App Image */}
          <motion.img
            src={smile}
            alt="PayNxt Mobile App"
            className="w-[800px] h-auto object-cover object-top mix-blend-multiply opacity-90"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          {/* Info Card 2 */}
          <motion.div
            className="bg-white p-2 rounded-xl shadow-lg w-64 h-[210px] flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105 z-10"
            whileHover={{ y: -10 }}
          >
            <FaGift className="text-3xl text-[#10B981] mb-2 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] transition" />
            <h3 className="font-semibold text-gray-800">Enjoy Cashback</h3>
            <p className="text-sm text-gray-500 mt-1">
              Get instant rewards on every transaction.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Header;

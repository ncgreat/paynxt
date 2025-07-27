import React, { useState, useEffect, useContext  } from 'react';
import Slider from 'react-slick';
import { Link, useHistory  } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DealContext } from '../../DealContext';
import logo from '../../assets/logo.png';

const benefits = [
  {
    icon: '💳',
    title: 'Effortless Bill Payments',
    desc: 'Say goodbye to long queues and failed transactions. With a few taps, pay for electricity, cable, airtime, and more — instantly and securely.',
  },
  {
    icon: '⏰',
    title: 'Smart Auto-Pay Features',
    desc: 'Never miss a due date again. Schedule recurring payments and let our system handle the rest. Stay stress-free and punctual.',
  },
  {
    icon: '🛒',
    title: 'Groceries & Essentials Delivered',
    desc: 'From pantry staples to household needs — shop directly from top supermarkets and have it all delivered to your doorstep. No cash, no stress.',
  },
  {
    icon: '🍲',
    title: 'Hot Meals, Anytime',
    desc: 'Craving your favorite meal? Browse menus from nearby restaurants and order in seconds. Pay digitally and enjoy doorstep delivery in minutes.',
  },
  {
    icon: '📊',
    title: 'Real-Time Wallet Insights',
    desc: 'Track your balance, spending trends, and transaction history in one glance. Your financial dashboard, simplified and always up-to-date.',
  },
  {
    icon: '🔐',
    title: 'Security You Can Trust',
    desc: 'Built with bank-grade encryption and fraud protection. Your data, identity, and money are always safe with us.',
  },
];

const BenefitsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {loggedUser, setLoggedUser, balance, resetBalance  } = useContext(DealContext);
  const [loading, setLoading] = useState(true);

  const navigate = useHistory();

  let user = '';

   const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

//   useEffect(() => {
//     const lastUser = getCookie('lastUserEmail');
//     if (lastUser) {
//       navigate.push('/login', { replace: true });
//     }
//   }, [])
//   useEffect(() => {
//     const encodedUser = getCookie('lastUser');
//     if (encodedUser) {
//       try {
//         const user1 = JSON.parse(atob(encodedUser));
//         setLoggedUser(user1.logged);
//         user = user1.logged.user;
//       } catch (err) {
//         console.error("Error decoding user cookie:", err);
//       }
//     }
//     if(user == undefined){
//         user=user? user.user : loggedUser.user;
//         first_name = user?.name.split(' ')[0];
//     }
//   }, []);

         

useEffect(() => {
    const lastUser = getCookie('lastUser');
    if(lastUser){
      navigate.push('/dashboard', { replace: true });
    }
}, []);

useEffect(() => {
    const lastUser = getCookie('lastUserEmail');
    if (lastUser) {
        const delay = setTimeout(() => {
          setLoading(false); // hide loader
          navigate.push('/login', { replace: true }); // navigate after delay
        }, 2500); // 10.5 seconds
      
        return () => clearTimeout(delay); // clean up if component unmounts early
      }

    const encodedUser = getCookie('lastUser');
    if (encodedUser) {
      try {
        const user1 = JSON.parse(atob(encodedUser));
        setLoggedUser(user1.logged);
        user = user1.logged.user;
      } catch (err) {
        console.error("Error decoding user cookie:", err);
      }
    }

    if (user) {
      navigate.push('/dashboard', { replace: true });
    } else {
    //   setLoading(false); // done checking, safe to render
        const delay = setTimeout(() => setLoading(false), 1500); // Simulate loading
        return () => clearTimeout(delay);
    }
  }, []);

// useEffect(() => {
//     const encodedUser = getCookie('lastUser');
//     if (encodedUser) {
//       try {
//         const userObj = JSON.parse(atob(encodedUser));
//         setLoggedUser(userObj.logged);
//         if (userObj?.logged?.user) {
//           navigate.push('/dashboard', { replace: true });
//         }
//       } catch (err) {
//         console.error("Error decoding user cookie:", err);
//       }
//     }

//     const delay = setTimeout(() => setLoading(false), 1200); // Simulate loading
//     return () => clearTimeout(delay);
//   }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    touchMove: true,
    autoplay: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const progress = ((currentSlide + 1) / benefits.length) * 100;

  if (loading) {
    return (
      <motion.div
        className="h-screen w-screen flex flex-col items-center justify-center bg-[#0d2b36] text-white"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 5.6 }}
      >
        <motion.img
          src={logo}
          alt="App Logo"
          className="w-15 h-20 mb-6 -mt-28"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Loading your personalized experience...
        </motion.p>
      </motion.div>
    );
  }

//   if (loading) {
//     return (
//       <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0d2b36] text-white">
//         <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-sm text-gray-400 animate-pulse">Getting things ready...</p>
//       </div>
//     );
//   }

// if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0d2b36] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Skip */}
      {/* <div className="w-full px-10 pt-6 flex justify-end ">
        <Link to="/login">
          <button className="text-sm p-4 text-gray-400 hover:text-white border border-gray-400 rounded-md">Skip</button>
        </Link>
      </div> */}

      {/* Slider */}
      <Slider {...settings} className="w-full max-w-md px-6 relative -top-16">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="p-6 flex flex-col items-center justify-center text-center py-52"
          >
            <div className="text-5xl">{b.icon}</div>
            <h2 className="text-2xl font-semibold">{b.title}</h2>
            <p className="text-sm text-gray-300 leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </Slider>

     
      {/* Progress Bar */}
      <div className="w-full max-w-md px-6 relative -top-20">
        <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-300 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CTA */}

      <div className="w-full max-w-md px-6 relative -top-4">
        <Link to="/login">
          <button className="w-full bg-gray-300 hover:bg-gray-500 text-[#0d2b36] py-4 rounded-xl font-medium text-sm transition">
            Get Started
          </button>
        </Link>
        <p className="text-center text-xs text-gray-400 pt-2">Secured by 256-bit encryption 🔒</p>
      </div>
      
      
    </div>
  );
};

export default BenefitsPage;

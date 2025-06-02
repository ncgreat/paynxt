import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: '💳',
    title: 'Pay Bills in Seconds',
    desc: 'Airtime, electricity, TV, and more — all just a tap away.',
  },
  {
    icon: '⏰',
    title: 'Auto-Schedule Payments',
    desc: 'Set it once and never miss a due date again.',
  },
  {
    icon: '📊',
    title: 'Track Every Transaction',
    desc: 'Smart analytics to help you stay on top of your spending.',
  },
  {
    icon: '🔐',
    title: 'Bank-Grade Security',
    desc: 'Your data and money are always protected.',
  },
];

const BenefitsPage = () => {
  return (
    <div className="min-h-screen bg-[#1f1f2e] text-white px-6 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        Why Choose Us?
      </h1>

      <div className="space-y-6">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#2f2f46] p-6 rounded-xl shadow-md flex items-start gap-4"
          >
            <div className="text-3xl">{b.icon}</div>
            <div>
              <h2 className="font-semibold text-lg mb-1">{b.title}</h2>
              <p className="text-sm text-gray-300">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8">
        <Link to="/sign-up">
          <button className="w-full bg-[#3f77eb] hover:bg-[#3268d6] text-white py-4 rounded-xl font-medium text-sm transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BenefitsPage;

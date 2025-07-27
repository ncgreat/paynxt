import React, { useRef } from 'react';

const OtpInput = ({ otp, setOtp }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const otpArr = otp.split('');
    otpArr[idx] = val;
    setOtp(otpArr.join(''));

    // Auto-focus next
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const otpArr = otp.split('');
      otpArr[idx - 1] = '';
      setOtp(otpArr.join(''));
      inputsRef.current[idx - 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex justify-between space-x-3 mb-6">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={otp[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => inputsRef.current[i] = el}
          className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#582066]"
        />
      ))}
    </div>
  );
};

export default OtpInput;
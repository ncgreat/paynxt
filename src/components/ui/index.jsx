import React from 'react';

// ✅ Button Component
export const Button = ({ onClick, children, variant = 'primary' }) => {
  const baseStyle = 'flex items-center bg-gray-300 bg-opacity-30 rounded-lg px-4 py-2 mt-2 font-semibold';
  const variants = {
    primary: 'bg-gradient-to-r from-pink-700 to-pink-500 text-white hover:from-pink-600 hover:to-pink-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </button>
  );
};

// ✅ Card Component
export const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4">
    {children}
  </div>
);

// CardContent Component
export const CardContent = ({ children }) => (
  <div className="p-1 flex flex-col items-center text-center justify-center">
    {children}
  </div>
);

// ✅ Input Component
export const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
  />
);

// ✅ Label Component
export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

// ✅ Dialog Component
export const Dialog = ({ isOpen, onClose, children }) => (
  isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative">
        {children}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
      </div>
    </div>
  ) : null
);

// ✅ DialogHeader Component
export const DialogHeader = ({ children }) => (
  <div className="p-4 border-b font-bold text-xl">
    {children}
  </div>
);

// ✅ DialogContent Component
export const DialogContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

// ✅ DialogTitle Component
export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-800 px-4 pt-4">
    {children}
  </h2>
);

// ✅ DialogFooter Component
export const DialogFooter = ({ children }) => (
  <div className="p-4 border-t flex justify-end">
    {children}
  </div>
);

// ✅ Progress Component
export const Progress = ({ value, max }) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <div
      className="bg-blue-500 h-4 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

// ✅ Badge Component
export const Badge = ({ text, variant = 'primary' }) => {
  const badgeColors = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-500 text-white',
    neutral: 'bg-gray-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColors[variant]}`}>
      {text}
    </span>
  );
};

// ✅ Spinner Component
export const Spinner = ({ size = 'md', color = 'blue' }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-${color}-500 border-t-transparent ${spinnerSizes[size]}`}
    />
  );
};

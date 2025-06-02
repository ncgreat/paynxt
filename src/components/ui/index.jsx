import React from 'react';

// Button Component
export const Button = ({ onClick, children, variant = 'primary' }) => {
  const baseStyle = 'px-4 py-2 mt-2 rounded font-semibold';
  const variants = {
    primary: 'bg-gradient-to-r from-pink-700 to-pink-500 text-white hover:bg-gradient-to-l from-pink-600 to-pink-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-">
    {children}
  </div>
);

// CardContent Component
export const CardContent = ({ children }) => (
  <div className="p-1">
    {children}
  </div>
);

// Input Component
export const Input = ({ value, onChange, placeholder }) => (
  <input 
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-300"
  />
);

// Textarea Component
export const Textarea = ({ value, onChange, placeholder }) => (
  <textarea 
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
  />
);

// Dialog Component
export const Dialog = ({ isOpen, onClose, children }) => (
  isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>
  ) : null
);

export const DialogHeader = ({ children }) => (
  <div className="p-4 border-b font-bold text-xl">
    {children}
  </div>
);

export const DialogContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

export const DialogFooter = ({ children }) => (
  <div className="p-4 border-t flex justify-end">
    {children}
  </div>
);

// Progress Component
export const Progress = ({ value, max }) => (
  <div className="w-full bg-gray-200 rounded-full h-4">
    <div 
      className="bg-blue-500 h-4 rounded-full" 
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);


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
// Let me know if you’d like me to add more components or customize anything! 🚀

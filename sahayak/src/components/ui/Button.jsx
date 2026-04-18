import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// Utility for merging tailwind classes safely
// eslint-disable-next-line react-refresh/only-export-components
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'lg', 
  className, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:ring-4 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-saffron text-navy hover:bg-orange-500 focus:ring-saffron",
    secondary: "bg-navy text-white hover:bg-blue-900 focus:ring-navy",
    outline: "border-2 border-navy text-navy hover:bg-gray-100 focus:ring-navy",
    success: "bg-green text-white hover:bg-green-700 focus:ring-green"
  };

  const sizes = {
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl", // Large default for accessibility
    xl: "px-10 py-5 text-2xl w-full" 
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'success']),
  size: PropTypes.oneOf(['md', 'lg', 'xl']),
  className: PropTypes.string,
};

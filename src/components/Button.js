import React from 'react';

const Button = ({ onClick, className, children, ...props }) => {
  return (
    <button 
      className={className} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
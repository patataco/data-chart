import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};
const Button = ({ children, isActive, onClick, ...rest }: ButtonProps) => {
  return (
    <button
      className={`rounded-lg border border-gray-400 px-4 py-2 font-bold  ${
        isActive ? 'bg-neutral-400 text-white' : 'text-gray-700'
      }`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

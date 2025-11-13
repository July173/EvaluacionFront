import React from 'react';

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

const UiButton: React.FC<Props> = ({ label, onClick, className = '', variant = 'primary' }) => {
  const base = 'px-4 py-2 rounded-md font-medium';
  const styles: Record<string, string> = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-white border border-green-200 text-green-700 hover:bg-green-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {label}
    </button>
  );
};

export default UiButton;

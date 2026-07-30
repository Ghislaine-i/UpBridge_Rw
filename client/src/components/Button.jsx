import React from 'react';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  accent: 'btn-accent',
};

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  fullWidth = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${variantClasses[variant] || variantClasses.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;

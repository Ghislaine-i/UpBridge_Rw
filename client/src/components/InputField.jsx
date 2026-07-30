import React from 'react';

const InputField = ({ label, id, error, className = '', ...rest }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input id={id} className={`input-field ${error ? 'border-red-400 focus:ring-red-200' : ''}`} {...rest} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;

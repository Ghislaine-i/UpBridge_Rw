import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, label = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-primary">
      <Loader2 className="h-8 w-8 animate-spin" />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-background">{content}</div>;
  }

  return <div className="w-full py-10 flex items-center justify-center">{content}</div>;
};

export default LoadingSpinner;

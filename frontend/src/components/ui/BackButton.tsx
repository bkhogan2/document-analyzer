import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from './Button';

interface BackButtonProps {
  fallback?: string;
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ fallback = '/applications', className = '', label = 'Back' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length <= 2 || location.pathname === fallback) {
      navigate(fallback);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleBack}
      variant="text"
      className={`flex items-center text-gray-600 hover:text-gray-900 ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-1" />
      {label}
    </Button>
  );
}; 
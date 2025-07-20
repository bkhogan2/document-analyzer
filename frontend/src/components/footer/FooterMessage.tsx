import React from 'react';

interface FooterMessageProps {
  message?: string;
}

export const FooterMessage: React.FC<FooterMessageProps> = ({ 
  message = "Upload all required documents to proceed with your SBA loan application. Documents will be reviewed for completeness and accuracy."
}) => {
  return (
    <div className="text-center text-gray-500 text-sm mb-8">
      {message}
    </div>
  );
}; 
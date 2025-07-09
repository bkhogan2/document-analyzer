import React from 'react';

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title = "SBA Loan Document Collection",
  description = "Upload the required documents for your SBA loan application. All documents should be current and complete."
}) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-gray-600 text-lg">
        {description}
      </p>
    </div>
  );
}; 
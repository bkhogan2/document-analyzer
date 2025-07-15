import React from 'react';
import { FormField } from './FormField';
import type { FormFieldConfig } from './FormField';

export interface FormBuilderConfig {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  layout?: 'single' | 'grid' | 'custom';
  gridCols?: number; // Default grid columns for responsive layout
}

interface FormBuilderProps {
  config: FormBuilderConfig;
  className?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ config, className = '' }) => {
  const { title, description, fields, layout = 'grid', gridCols = 2 } = config;

  const getGridClasses = () => {
    switch (layout) {
      case 'single':
        return 'space-y-6';
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${gridCols} gap-6`;
      case 'custom':
        return 'space-y-6';
      default:
        return `grid grid-cols-1 md:grid-cols-${gridCols} gap-6`;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <div className={getGridClasses()}>
        {fields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            config={fieldConfig}
          />
        ))}
      </div>
    </div>
  );
}; 
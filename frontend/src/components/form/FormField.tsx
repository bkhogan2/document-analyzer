import React from 'react';
import { useFormContext } from 'react-hook-form';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, unknown>;
  options?: Array<{ value: string; label: string }>;
  gridCols?: number; // For responsive grid layout
  helpText?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
}

interface FormFieldProps {
  config: FormFieldConfig;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ config, className = '' }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[config.name];

  const baseInputClasses = "w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

  const renderField = () => {
    switch (config.type) {
      case 'select':
        return (
          <select
            {...register(config.name, config.validation)}
            className={`${baseInputClasses} ${errorClasses} ${className}`}
            disabled={config.disabled}
          >
            <option value="">{config.placeholder || 'Select an option'}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...register(config.name, config.validation)}
            className={`${baseInputClasses} ${errorClasses} ${className} resize-vertical min-h-[100px]`}
            placeholder={config.placeholder}
            disabled={config.disabled}
            maxLength={config.maxLength}
            minLength={config.minLength}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(config.name, config.validation)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
              disabled={config.disabled}
            />
            <label className="ml-2 text-sm text-gray-700">{config.label}</label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  {...register(config.name, config.validation)}
                  value={option.value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:bg-gray-100"
                  disabled={config.disabled}
                />
                <label className="ml-2 text-sm text-gray-700">{option.label}</label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            {...register(config.name, config.validation)}
            className={`${baseInputClasses} ${errorClasses} ${className} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            disabled={config.disabled}
            accept={config.accept}
            multiple={config.multiple}
          />
        );

      default:
        return (
          <input
            type={config.type}
            {...register(config.name, config.validation)}
            className={`${baseInputClasses} ${errorClasses} ${className}`}
            placeholder={config.placeholder}
            disabled={config.disabled}
            maxLength={config.maxLength}
            minLength={config.minLength}
            min={config.min}
            max={config.max}
            step={config.step}
          />
        );
    }
  };

  return (
    <div className={`${config.gridCols ? `col-span-${config.gridCols}` : ''}`}>
      {config.type !== 'checkbox' && config.type !== 'radio' && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {config.helpText && (
        <p className="text-sm text-gray-500 mt-1">{config.helpText}</p>
      )}
      {error && (
        <p className="text-red-600 text-xs mt-1">{String(error.message)}</p>
      )}
    </div>
  );
}; 
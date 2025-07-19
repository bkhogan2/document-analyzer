import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { PageHeader } from './PageHeader';
import { Breadcrumbs } from './Breadcrumbs';
import type { StepRef } from '../types/api';

export interface WelcomeFormData {
  applicantName: string;
  applicantEmail: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

export type WelcomeStepRef = StepRef;

export const WelcomeStep = forwardRef<WelcomeStepRef, {
  onSubmit: (data: WelcomeFormData) => void;
  onFormStateChange?: (state: { isValid: boolean }) => void;
}>(function WelcomeStep({ onSubmit, onFormStateChange }, ref) {
  const methods = useForm<WelcomeFormData>({
    defaultValues: {
      applicantName: '',
      applicantEmail: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors, isValid } } = methods;

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit]);

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange({ isValid });
    }
  }, [isValid, onFormStateChange]);

  return (
    <FormProvider {...methods}>
      <div className="flex-1 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs />
          <PageHeader
            title="Welcome to Your SBA Loan Application"
            description="Please provide your contact and business information to get started."
          />
          <form className="space-y-8 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('applicantName', { required: 'Name is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
                {errors.applicantName && <p className="text-red-600 text-xs mt-1">{errors.applicantName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('applicantEmail', { required: 'Email is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Enter your email address"
                />
                {errors.applicantEmail && <p className="text-red-600 text-xs mt-1">{errors.applicantEmail.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  {...register('streetAddress', { required: 'Street address is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="123 Main St"
                />
                {errors.streetAddress && <p className="text-red-600 text-xs mt-1">{errors.streetAddress.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="San Diego"
                />
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="CA"
                  maxLength={2}
                />
                {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  {...register('zip', { required: 'ZIP code is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="92103"
                  maxLength={10}
                />
                {errors.zip && <p className="text-red-600 text-xs mt-1">{errors.zip.message}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}); 
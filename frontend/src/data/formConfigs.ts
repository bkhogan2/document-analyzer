import type { FormFieldConfig } from '../components/form/FormField';

// Welcome Step Configuration
export const welcomeStepConfig: FormFieldConfig[] = [
  {
    name: 'applicantName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
    validation: { required: 'Name is required' },
    gridCols: 1
  },
  {
    name: 'applicantEmail',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email address',
    required: true,
    validation: { 
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address'
      }
    },
    gridCols: 1
  },
  {
    name: 'streetAddress',
    label: 'Street Address',
    type: 'text',
    placeholder: '123 Main St',
    required: true,
    validation: { required: 'Street address is required' },
    gridCols: 2
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'San Diego',
    required: true,
    validation: { required: 'City is required' },
    gridCols: 1
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    placeholder: 'CA',
    required: true,
    validation: { 
      required: 'State is required',
      maxLength: { value: 2, message: 'State must be 2 characters' }
    },
    maxLength: 2,
    gridCols: 1
  },
  {
    name: 'zip',
    label: 'ZIP Code',
    type: 'text',
    placeholder: '92103',
    required: true,
    validation: { 
      required: 'ZIP code is required',
      pattern: {
        value: /^\d{5}(-\d{4})?$/,
        message: 'Invalid ZIP code format'
      }
    },
    maxLength: 10,
    gridCols: 1
  }
];

// Loan Information Step Configuration
export const loanInfoStepConfig: FormFieldConfig[] = [
  {
    name: 'loanAmount',
    label: 'Loan Amount Requested',
    type: 'number',
    placeholder: '50000',
    required: true,
    validation: { 
      required: 'Loan amount is required',
      min: { value: 1000, message: 'Minimum loan amount is $1,000' },
      max: { value: 5000000, message: 'Maximum loan amount is $5,000,000' }
    },
    min: 1000,
    max: 5000000,
    step: 1000,
    helpText: 'Enter the amount you are requesting',
    gridCols: 1
  },
  {
    name: 'loanPurpose',
    label: 'Loan Purpose',
    type: 'select',
    required: true,
    validation: { required: 'Loan purpose is required' },
    options: [
      { value: 'working-capital', label: 'Working Capital' },
      { value: 'equipment', label: 'Equipment Purchase' },
      { value: 'real-estate', label: 'Real Estate' },
      { value: 'debt-refinance', label: 'Debt Refinance' },
      { value: 'startup', label: 'Startup Costs' },
      { value: 'other', label: 'Other' }
    ],
    gridCols: 1
  },
  {
    name: 'businessPlan',
    label: 'Business Plan Description',
    type: 'textarea',
    placeholder: 'Describe how you plan to use the loan funds...',
    required: true,
    validation: { 
      required: 'Business plan description is required',
      minLength: { value: 50, message: 'Description must be at least 50 characters' }
    },
    minLength: 50,
    maxLength: 1000,
    helpText: 'Explain how you will use the loan funds to grow your business',
    gridCols: 2
  }
];

// Business Information Step Configuration
export const businessInfoStepConfig: FormFieldConfig[] = [
  {
    name: 'businessName',
    label: 'Business Name',
    type: 'text',
    placeholder: 'Your Business Name',
    required: true,
    validation: { required: 'Business name is required' },
    gridCols: 1
  },
  {
    name: 'businessType',
    label: 'Business Type',
    type: 'select',
    required: true,
    validation: { required: 'Business type is required' },
    options: [
      { value: 'llc', label: 'LLC' },
      { value: 'corporation', label: 'Corporation' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
      { value: 'nonprofit', label: 'Nonprofit' }
    ],
    gridCols: 1
  },
  {
    name: 'businessAddress',
    label: 'Business Address',
    type: 'text',
    placeholder: 'Business street address',
    required: true,
    validation: { required: 'Business address is required' },
    gridCols: 2
  },
  {
    name: 'businessCity',
    label: 'Business City',
    type: 'text',
    placeholder: 'Business city',
    required: true,
    validation: { required: 'Business city is required' },
    gridCols: 1
  },
  {
    name: 'businessState',
    label: 'Business State',
    type: 'text',
    placeholder: 'CA',
    required: true,
    validation: { 
      required: 'Business state is required',
      maxLength: { value: 2, message: 'State must be 2 characters' }
    },
    maxLength: 2,
    gridCols: 1
  },
  {
    name: 'businessZip',
    label: 'Business ZIP Code',
    type: 'text',
    placeholder: '92103',
    required: true,
    validation: { 
      required: 'Business ZIP code is required',
      pattern: {
        value: /^\d{5}(-\d{4})?$/,
        message: 'Invalid ZIP code format'
      }
    },
    maxLength: 10,
    gridCols: 1
  },
  {
    name: 'businessPhone',
    label: 'Business Phone',
    type: 'tel',
    placeholder: '(555) 123-4567',
    required: true,
    validation: { 
      required: 'Business phone is required',
      pattern: {
        value: /^[+]?[1-9][\d]{0,15}$/,
        message: 'Invalid phone number format'
      }
    },
    gridCols: 1
  },
  {
    name: 'businessWebsite',
    label: 'Business Website (Optional)',
    type: 'text',
    placeholder: 'https://www.yourbusiness.com',
    required: false,
    validation: {
      pattern: {
        value: /^https?:\/\/.+/,
        message: 'Please enter a valid URL starting with http:// or https://'
      }
    },
    gridCols: 1
  },
  {
    name: 'businessDescription',
    label: 'Business Description',
    type: 'textarea',
    placeholder: 'Describe your business, products/services, and target market...',
    required: true,
    validation: { 
      required: 'Business description is required',
      minLength: { value: 100, message: 'Description must be at least 100 characters' }
    },
    minLength: 100,
    maxLength: 2000,
    helpText: 'Provide a detailed description of your business operations',
    gridCols: 2
  }
];

// Owner Information Step Configuration
export const ownerInfoStepConfig: FormFieldConfig[] = [
  {
    name: 'ownerName',
    label: 'Owner Name',
    type: 'text',
    placeholder: 'Owner full name',
    required: true,
    validation: { required: 'Owner name is required' },
    gridCols: 1
  },
  {
    name: 'ownerTitle',
    label: 'Owner Title',
    type: 'text',
    placeholder: 'CEO, President, etc.',
    required: true,
    validation: { required: 'Owner title is required' },
    gridCols: 1
  },
  {
    name: 'ownerSSN',
    label: 'Social Security Number',
    type: 'text',
    placeholder: 'XXX-XX-XXXX',
    required: true,
    validation: { 
      required: 'SSN is required',
      pattern: {
        value: /^\d{3}-\d{2}-\d{4}$/,
        message: 'Please enter SSN in format XXX-XX-XXXX'
      }
    },
    maxLength: 11,
    helpText: 'Required for credit check and background verification',
    gridCols: 1
  },
  {
    name: 'ownerDOB',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    validation: { required: 'Date of birth is required' },
    gridCols: 1
  },
  {
    name: 'ownerCitizenship',
    label: 'U.S. Citizenship',
    type: 'radio',
    required: true,
    validation: { required: 'Citizenship status is required' },
    options: [
      { value: 'citizen', label: 'U.S. Citizen' },
      { value: 'permanent-resident', label: 'Permanent Resident' },
      { value: 'non-citizen', label: 'Non-Citizen' }
    ],
    gridCols: 2
  }
];

// Certification Step Configuration
export const certificationStepConfig: FormFieldConfig[] = [
  {
    name: 'truthfulInformation',
    label: 'I certify that all information provided is true and accurate',
    type: 'checkbox',
    required: true,
    validation: { 
      required: 'You must certify that the information is truthful' 
    },
    gridCols: 2
  },
  {
    name: 'authorizeCreditCheck',
    label: 'I authorize a credit check and background investigation',
    type: 'checkbox',
    required: true,
    validation: { 
      required: 'You must authorize the credit check' 
    },
    gridCols: 2
  },
  {
    name: 'agreeToTerms',
    label: 'I agree to the terms and conditions of this application',
    type: 'checkbox',
    required: true,
    validation: { 
      required: 'You must agree to the terms and conditions' 
    },
    gridCols: 2
  },
  {
    name: 'electronicSignature',
    label: 'Electronic Signature',
    type: 'text',
    placeholder: 'Type your full name to sign electronically',
    required: true,
    validation: { 
      required: 'Electronic signature is required',
      minLength: { value: 2, message: 'Please enter your full name' }
    },
    minLength: 2,
    helpText: 'By typing your name, you are providing an electronic signature',
    gridCols: 2
  }
];

// Pre-Screen Questions Step Configuration
export const preScreenStepConfig: FormFieldConfig[] = [
  {
    name: 'bankruptcy',
    label: 'Have you or your business filed for bankruptcy in the past 7 years?',
    type: 'radio',
    required: true,
    validation: { required: 'Please answer this question' },
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    gridCols: 2
  },
  {
    name: 'taxLiens',
    label: 'Do you have any outstanding tax liens?',
    type: 'radio',
    required: true,
    validation: { required: 'Please answer this question' },
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    gridCols: 2
  },
  {
    name: 'criminalRecord',
    label: 'Do you have any criminal convictions?',
    type: 'radio',
    required: true,
    validation: { required: 'Please answer this question' },
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    gridCols: 2
  },
  {
    name: 'additionalInfo',
    label: 'Additional Information (Optional)',
    type: 'textarea',
    placeholder: 'Please provide any additional information that may be relevant to your application...',
    required: false,
    maxLength: 1000,
    helpText: 'Use this space to explain any "Yes" answers above or provide additional context',
    gridCols: 2
  }
];

// Form configuration mapping for easy access
export const formConfigs = {
  'welcome-1': welcomeStepConfig,
  'loan-info-1': loanInfoStepConfig,
  'business-info-1': businessInfoStepConfig,
  'owner-info-1': ownerInfoStepConfig,
  'certification-1': certificationStepConfig,
  'pre-screen-1': preScreenStepConfig,
} as const;

export type StepId = keyof typeof formConfigs;

// EXAMPLE: How to add new fields easily
// To add a new field to the welcome step, just add it to the array:
/*
export const welcomeStepConfig: FormFieldConfig[] = [
  // ... existing fields ...
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567',
    required: true,
    validation: { 
      required: 'Phone number is required',
      pattern: {
        value: /^[+]?[1-9][\d]{0,15}$/,
        message: 'Invalid phone number format'
      }
    },
    gridCols: 1
  },
  {
    name: 'businessExperience',
    label: 'Years of Business Experience',
    type: 'number',
    placeholder: '5',
    required: true,
    validation: { 
      required: 'Business experience is required',
      min: { value: 0, message: 'Experience cannot be negative' },
      max: { value: 50, message: 'Please enter a realistic number' }
    },
    min: 0,
    max: 50,
    gridCols: 1
  }
];

// To add a completely new step:
/*
export const financialInfoStepConfig: FormFieldConfig[] = [
  {
    name: 'annualRevenue',
    label: 'Annual Revenue',
    type: 'number',
    placeholder: '500000',
    required: true,
    validation: { 
      required: 'Annual revenue is required',
      min: { value: 0, message: 'Revenue cannot be negative' }
    },
    min: 0,
    step: 1000,
    helpText: 'Enter your business annual revenue',
    gridCols: 1
  },
  {
    name: 'profitMargin',
    label: 'Profit Margin (%)',
    type: 'number',
    placeholder: '15',
    required: true,
    validation: { 
      required: 'Profit margin is required',
      min: { value: 0, message: 'Profit margin cannot be negative' },
      max: { value: 100, message: 'Profit margin cannot exceed 100%' }
    },
    min: 0,
    max: 100,
    step: 0.1,
    helpText: 'Enter your business profit margin percentage',
    gridCols: 1
  }
];

// Then add it to the formConfigs:
export const formConfigs = {
  'welcome-1': welcomeStepConfig,
  'loan-info-1': loanInfoStepConfig,
  'business-info-1': businessInfoStepConfig,
  'financial-info-1': financialInfoStepConfig, // NEW STEP!
  'owner-info-1': ownerInfoStepConfig,
  'certification-1': certificationStepConfig,
  'pre-screen-1': preScreenStepConfig,
} as const;
*/ 
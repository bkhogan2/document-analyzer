// Form configurations for different application types and steps
export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: Record<string, unknown>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, unknown>;
}

// Welcome step configuration
export const welcomeStepConfig: FormConfig = {
  id: 'welcome',
  title: 'Welcome to Your SBA Loan Application',
  description: 'Let\'s get started with some basic information about your loan request.',
  fields: [
    {
      name: 'applicantName',
      label: 'Primary Applicant Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      name: 'applicantEmail',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address'
    },
    {
      name: 'requestedAmount',
      label: 'Requested Loan Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter amount in dollars'
    },
    {
      name: 'loanPurpose',
      label: 'Loan Purpose',
      type: 'select',
      required: true,
      options: [
        { value: 'working-capital', label: 'Working Capital' },
        { value: 'equipment', label: 'Equipment Purchase' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'startup', label: 'Startup Costs' },
        { value: 'expansion', label: 'Business Expansion' }
      ]
    }
  ]
};

// Business information step configuration
export const businessInfoConfig: FormConfig = {
  id: 'business-info',
  title: 'Business Information',
  description: 'Tell us about your business.',
  fields: [
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your business name'
    },
    {
      name: 'businessType',
      label: 'Business Type',
      type: 'select',
      required: true,
      options: [
        { value: 'llc', label: 'LLC' },
        { value: 'corporation', label: 'Corporation' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'sole-proprietorship', label: 'Sole Proprietorship' }
      ]
    },
    {
      name: 'businessAddress',
      label: 'Business Address',
      type: 'textarea',
      required: true,
      placeholder: 'Enter your business address'
    },
    {
      name: 'yearsInBusiness',
      label: 'Years in Business',
      type: 'number',
      required: true,
      placeholder: 'Enter number of years'
    }
  ]
};

// Owner information step configuration
export const ownerInfoConfig: FormConfig = {
  id: 'owner-info',
  title: 'Owner Information',
  description: 'Information about business owners.',
  fields: [
    {
      name: 'ownerName',
      label: 'Owner Name',
      type: 'text',
      required: true,
      placeholder: 'Enter owner name'
    },
    {
      name: 'ownershipPercentage',
      label: 'Ownership Percentage',
      type: 'number',
      required: true,
      placeholder: 'Enter percentage (0-100)'
    },
    {
      name: 'ssn',
      label: 'Social Security Number',
      type: 'text',
      required: true,
      placeholder: 'XXX-XX-XXXX'
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'text',
      required: true,
      placeholder: 'MM/DD/YYYY'
    }
  ]
};

// All form configurations
export const formConfigs: Record<string, FormConfig> = {
  welcome: welcomeStepConfig,
  'business-info': businessInfoConfig,
  'owner-info': ownerInfoConfig
};

// Helper function to get form config by ID
export const getFormConfig = (configId: string): FormConfig | undefined => {
  return formConfigs[configId];
}; 
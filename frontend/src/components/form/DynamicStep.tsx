import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormBuilder } from './FormBuilder';
import { formConfigs, type StepId } from '../../data/formConfigs';
import { PageHeader } from '../PageHeader';
import { Breadcrumbs } from '../Breadcrumbs';

export interface DynamicStepRef {
  submitForm: () => void;
}

interface DynamicStepProps {
  stepId: StepId;
  onSubmit: (data: Record<string, unknown>) => void;
  onFormStateChange?: (state: { isValid: boolean }) => void;
  defaultValues?: Record<string, unknown>;
}

export const DynamicStep = forwardRef<DynamicStepRef, DynamicStepProps>(
  ({ stepId, onSubmit, onFormStateChange, defaultValues = {} }, ref) => {
    const fieldConfig = formConfigs[stepId];
    
    if (!fieldConfig) {
      return <div>Step configuration not found for: {stepId}</div>;
    }

    // Create default values object from field config
    const createDefaultValues = () => {
      const defaults: Record<string, unknown> = {};
      fieldConfig.forEach(field => {
        if (defaultValues[field.name] !== undefined) {
          defaults[field.name] = defaultValues[field.name];
        } else {
          // Set appropriate defaults based on field type
          switch (field.type) {
            case 'checkbox':
              defaults[field.name] = false;
              break;
            case 'radio':
              defaults[field.name] = '';
              break;
            case 'select':
              defaults[field.name] = '';
              break;
            default:
              defaults[field.name] = '';
          }
        }
      });
      return defaults;
    };

    const methods = useForm({
      defaultValues: createDefaultValues(),
      mode: 'onChange',
    });

    const { handleSubmit, formState: { isValid } } = methods;

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)(),
    }), [handleSubmit, onSubmit]);

    useEffect(() => {
      if (onFormStateChange) {
        onFormStateChange({ isValid });
      }
    }, [isValid, onFormStateChange]);

    // Get step title and description from stepId
    const getStepInfo = () => {
      const stepMap: Record<StepId, { title: string; description: string }> = {
        'welcome-1': {
          title: 'Welcome to Your SBA Loan Application',
          description: 'Please provide your contact and business information to get started.'
        },
        'loan-info-1': {
          title: 'Loan Information',
          description: 'Tell us about the loan you are requesting and how you plan to use the funds.'
        },
        'business-info-1': {
          title: 'Business Information',
          description: 'Provide details about your business structure and operations.'
        },
        'owner-info-1': {
          title: 'Owner Information',
          description: 'Tell us about the business owner(s) and their background.'
        },
        'certification-1': {
          title: 'Certification & Agreement',
          description: 'Please review and certify the information provided in this application.'
        },
        'pre-screen-1': {
          title: 'Pre-Screen Questions',
          description: 'Please answer these questions to help us understand your eligibility.'
        }
      };
      
      return stepMap[stepId] || {
        title: 'Application Step',
        description: 'Please complete the information below.'
      };
    };

    const { title, description } = getStepInfo();

    return (
      <FormProvider {...methods}>
        <div className="flex-1 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs />
            <PageHeader
              title={title}
              description={description}
            />
            <div className="max-w-2xl mx-auto w-full">
              <FormBuilder
                config={{
                  fields: fieldConfig,
                  layout: 'grid',
                  gridCols: 2
                }}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    );
  }
); 